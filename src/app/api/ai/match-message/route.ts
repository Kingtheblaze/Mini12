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

      const { receiverId } = await req.json();

      // Get both users' skills
      const sender = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { skills: true },
      });

      const receiver = await prisma.user.findUnique({
        where: { id: parseInt(receiverId) },
        include: { skills: true },
      });

      const senderHave = sender?.skills
        .filter((s) => s.type === "HAVE")
        .map((s) => s.name)
        .join(", ");

      const receiverHave = receiver?.skills
        .filter((s) => s.type === "HAVE")
        .map((s) => s.name)
        .join(", ");

      console.log("Generating AI match message:", { sender: sender?.name, receiver: receiver?.name });

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 200,
        system: `Write a friendly swap request message under 60 words.
    Sender teaches: ${senderHave || "nothing specified yet"}
    Receiver name: ${receiver?.name || "the user"}
    Receiver teaches: ${receiverHave || "nothing specified yet"}
    Be specific and professional. No placeholders.`,
        messages: [
          { role: "user", content: "Write the swap request message." },
        ],
      });

      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      return NextResponse.json({
        message: text,
      });
  } catch (error: any) {
    console.error("Claude API Error (Match Message):", error);
    return NextResponse.json({ 
        error: "AI Generation Failed", 
        details: error.message,
        type: error.type 
    }, { status: error.status || 500 });
  }
}
