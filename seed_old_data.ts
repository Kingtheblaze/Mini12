import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
    const dataPath = "C:\\Users\\DH\\.gemini\\antigravity\\brain\\672c0054-e53d-46f4-a151-a8d810ed4e44\\scratch\\extracted_data.json";
    if (!fs.existsSync(dataPath)) {
        console.error("Extracted data JSON not found!");
        return;
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    
    console.log("Starting database migration to Supabase...");
    
    // 1. Clear existing data in correct order to avoid foreign key violations
    console.log("Clearing existing data...");
    await prisma.creditTransaction.deleteMany({});
    await prisma.swapRequest.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.user.deleteMany({});
    
    // 2. Insert Users
    console.log(`Inserting ${data.User.length} users...`);
    for (const u of data.User) {
        await prisma.user.create({
            data: {
                id: u.id,
                name: u.name,
                email: u.email,
                passwordHash: "$2b$10$z6RsaMDB/nRIic7R2OrM1.UNaMq2vO5upPY58YPPXcfZlC9Gpu/dm", // Sets password to 'password124'
                department: u.department,
                year: u.year,
                bio: u.bio,
                timeCredits: u.timeCredits,
                rating: u.rating,
                totalSessions: u.totalSessions,
                createdAt: new Date(u.createdAt)
            }
        });
    }
    
    // 3. Insert Skills
    console.log(`Inserting ${data.Skill.length} skills...`);
    for (const s of data.Skill) {
        await prisma.skill.create({
            data: {
                id: s.id,
                userId: s.userId,
                name: s.name,
                type: s.type,
                category: s.category
            }
        });
    }
    
    // 4. Insert SwapRequests
    console.log(`Inserting ${data.SwapRequest.length} swap requests...`);
    for (const r of data.SwapRequest) {
        await prisma.swapRequest.create({
            data: {
                id: r.id,
                requesterId: r.requesterId,
                receiverId: r.receiverId,
                message: r.message,
                status: r.status,
                sessionTime: r.sessionTime ? new Date(r.sessionTime) : null,
                creditsAmt: r.creditsAmt,
                createdAt: new Date(r.createdAt)
            }
        });
    }
    
    // 5. Insert CreditTransactions
    console.log(`Inserting ${data.CreditTransaction.length} transactions...`);
    for (const t of data.CreditTransaction) {
        await prisma.creditTransaction.create({
            data: {
                id: t.id,
                fromUserId: t.fromUserId,
                toUserId: t.toUserId,
                amount: t.amount,
                type: t.type,
                requestId: t.requestId,
                createdAt: new Date(t.createdAt)
            }
        });
    }
    
    console.log("Migration completed successfully! All old data is now in Supabase.");
}

main()
    .catch(e => console.error("Migration failed:", e))
    .finally(async () => await prisma.$disconnect());
