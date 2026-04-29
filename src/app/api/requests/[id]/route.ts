import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id);
        const { status } = await req.json();
        const requestId = parseInt(params.id);

        // Fetch existing request
        const swapRequest = await prisma.swapRequest.findUnique({
            where: { id: requestId },
            include: { requester: true, receiver: true }
        });

        if (!swapRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // Authorization checks
        const isRequester = swapRequest.requesterId === userId;
        const isReceiver = swapRequest.receiverId === userId;

        if (!isRequester && !isReceiver) {
             return NextResponse.json({ error: "Forbidden: You are not part of this request." }, { status: 403 });
        }

        // Only receiver can accept or reject
        if ((status === "ACCEPTED" || status === "REJECTED") && !isReceiver) {
             return NextResponse.json({ error: "Forbidden: Only the receiver can accept or reject." }, { status: 403 });
        }

        // Logic for completing a session and transferring credits
        if (status === "COMPLETED" && swapRequest.status !== "COMPLETED") {
            // Assume the requester is "spending" credits to learn, and the receiver is "earning"
            const spenderId = swapRequest.requesterId;
            const earnerId = swapRequest.receiverId;

            if (swapRequest.requester.timeCredits < swapRequest.creditsAmt) {
                 return NextResponse.json({ error: "Requester has insufficient time credits." }, { status: 400 });
            }

            // Atomic transaction for credit transfer
            await prisma.$transaction([
                // Update request status
                prisma.swapRequest.update({
                    where: { id: requestId },
                    data: { status: "COMPLETED" },
                }),
                // Spend credits from requester
                prisma.user.update({
                    where: { id: spenderId },
                    data: { timeCredits: { decrement: swapRequest.creditsAmt } },
                }),
                // Earn credits for receiver
                prisma.user.update({
                    where: { id: earnerId },
                    data: {
                        timeCredits: { increment: swapRequest.creditsAmt },
                        totalSessions: { increment: 1 }
                    },
                }),
                // Record transaction
                prisma.creditTransaction.create({
                    data: {
                        fromUserId: spenderId,
                        toUserId: earnerId,
                        amount: swapRequest.creditsAmt,
                        type: "COMPLETED_SESSION",
                        requestId: requestId,
                    },
                }),
            ]);

            return NextResponse.json({ message: "Session completed and credits transferred" });
        }

        // Simple status update (ACCEPTED/REJECTED)
        const updatedRequest = await prisma.swapRequest.update({
            where: { id: requestId },
            data: { status },
        });

        return NextResponse.json(updatedRequest);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || "Failed to update request" }, { status: 500 });
    }
}
