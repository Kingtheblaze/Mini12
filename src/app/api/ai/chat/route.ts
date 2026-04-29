import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await req.json();

  // Get current user's skills and credits from DB
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

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022", // Updated to a real model name
    max_tokens: 1000,
    system: `You are SkillSwap AI, a helpful assistant for a 
peer-to-peer skill barter platform for students.
The current user has:
- Time Credits: ${user?.timeCredits}
- Skills they can teach: ${haveSkills || "No skills added yet"}
- Skills they want to learn: ${needSkills || "No skills added yet"}
Be helpful, concise and encouraging. Keep responses under 150 words.`,
    messages: messages,
  });

  const content = response.content[0];
  const text = content.type === 'text' ? content.text : '';

  return NextResponse.json({
    reply: text,
  });
}
