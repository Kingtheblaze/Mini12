import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id);
        const requests = await prisma.swapRequest.findMany({
            where: {
                OR: [
                    { requesterId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                requester: { select: { name: true, department: true } },
                receiver: { select: { name: true, department: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(requests);
    } catch (_error) {
        return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { receiverId, message, creditsAmt } = await req.json();

        if (!receiverId) {
            return NextResponse.json({ error: "Receiver ID required" }, { status: 400 });
        }

        const request = await prisma.swapRequest.create({
            data: {
                requesterId: parseInt(session.user.id),
                receiverId: parseInt(receiverId),
                message,
                creditsAmt: creditsAmt || 1,
                status: "PENDING"
            }
        });

        return NextResponse.json(request, { status: 201 });
    } catch (_error) {
        console.error(_error);
        return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
    }
}
