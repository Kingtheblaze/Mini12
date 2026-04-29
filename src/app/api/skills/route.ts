import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // HAVE or NEED
        const category = searchParams.get("category");

        const skills = await prisma.skill.findMany({
            where: {
                ...(type && { type }),
                ...(category && { category }),
            },
            include: {
                user: {
                    select: {
                        name: true,
                        department: true,
                        rating: true,
                    },
                },
            },
        });

        return NextResponse.json(skills);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, type, category } = await req.json();

        if (!name || !type || !category) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const skill = await prisma.skill.create({
            data: {
                name,
                type,
                category,
                userId: parseInt(session.user.id),
            },
        });

        return NextResponse.json(skill, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
    }
}
