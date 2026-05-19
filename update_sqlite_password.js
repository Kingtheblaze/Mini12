const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.user.updateMany({
            data: {
                passwordHash: "$2b$10$z6RsaMDB/nRIic7R2OrM1.UNaMq2vO5upPY58YPPXcfZlC9Gpu/dm"
            }
        });
        console.log("All passwords reset to password124 successfully in SQLite!");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
