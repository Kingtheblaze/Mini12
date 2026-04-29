import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  try {
      const session = await auth();
      if (!session?.user?.email)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { skills: true },
      });

      const haveSkills = user?.skills
        .filter((s) => s.type === "HAVE")
        .map((s) => s.name)
        .join(", ");

      const needSkills = user?.skills
        .filter((s) => s.type === "NEED")
        .map((s) => s.name)
        .join(", ");

      console.log("Generating AI suggestions for skills:", { haveSkills, needSkills });

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        system: `You are a skill recommendation AI. 
Return ONLY a JSON array of 4 suggestions. No other text. Use this exact JSON structure:
[{"skill":"Name","reason":"One sentence","priority":"high/medium"}]`,
        messages: [
          {
            role: "user",
            content: `User currently knows: ${haveSkills || "No skills specified yet"}. 
User wants to learn: ${needSkills || "No skills specified yet"}. 
Based on these, suggest 4 complementary or trending skills for a university environment. Return only the JSON.`,
          },
        ],
      });

      console.log("Claude Response Status:", response.type);
      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      const clean = text
        .replace(/```json|```/g, "")
        .trim();

      try {
        const suggestions = JSON.parse(clean);
        return NextResponse.json({
            suggestions: suggestions,
        });
      } catch (error) {
        console.error("Failed to parse JSON from Claude:", text);
        return NextResponse.json({ error: "Failed to generate valid suggestions" }, { status: 500 });
      }
  } catch (error: any) {
    console.error("Claude API Error (Suggestions):", error);
    return NextResponse.json({ 
        error: "AI Service Error", 
        details: error.message,
        type: error.type 
    }, { status: error.status || 500 });
  }
}
