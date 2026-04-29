import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id);
        const { otherUserId, message } = await req.json();

        if (!otherUserId) {
            return NextResponse.json({ error: "Target User ID required" }, { status: 400 });
        }

        const targetId = parseInt(otherUserId);

        // Atomic transaction to create both requests
        const [reqA, reqB] = await prisma.$transaction([
            // Request 1: Me -> Them (I want to learn from them)
            prisma.swapRequest.create({
                data: {
                    requesterId: userId,
                    receiverId: targetId,
                    message: message || "Hi! I noticed we have complementary skills. Let's do a mutual swap!",
                    creditsAmt: 1,
                    status: "PENDING"
                }
            }),
            // Request 2: Them -> Me (They want to learn from me)
            prisma.swapRequest.create({
                data: {
                    requesterId: targetId,
                    receiverId: userId,
                    message: "Mutual swap request generated automatically.",
                    creditsAmt: 1,
                    status: "PENDING"
                }
            })
        ]);

        return NextResponse.json({ 
            message: "Mutual swap requests initiated successfully",
            requests: [reqA, reqB]
        }, { status: 201 });

    } catch (error) {
        console.error("Mutual Swap Error:", error);
        return NextResponse.json({ error: "Failed to initiate mutual swap" }, { status: 500 });
    }
}
