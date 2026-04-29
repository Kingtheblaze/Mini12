const { PrismaClient } = require('@prisma/client');

const password = 'Sambhav%402425';
const url = `postgresql://postgres.avonkztccfgwkmssnacb:${password}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;

async function test() {
    console.log(`Testing Tokyo...`);
    process.env.DATABASE_URL = url;
    const prisma = new PrismaClient();
    
    try {
        await prisma.$connect();
        const res = await prisma.$queryRaw`SELECT 1`;
        console.log(`>>> SUCCESS REGION IS TOKYO!`);
        await prisma.$disconnect();
        process.exit(0);
    } catch (err) {
        console.log(`Fail: ${err.message}`);
    }
}

test();
