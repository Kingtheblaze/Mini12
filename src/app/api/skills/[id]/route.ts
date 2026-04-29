import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const skillId = parseInt(params.id);
        const userId = parseInt(session.user.id);

        // Verify the skill belongs to the user
        const skill = await prisma.skill.findUnique({
            where: { id: skillId },
        });

        if (!skill) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 });
        }

        if (skill.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.skill.delete({
            where: { id: skillId },
        });

        return NextResponse.json({ message: "Skill deleted successfully" });
    } catch (error) {
        console.error("Failed to delete skill:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
