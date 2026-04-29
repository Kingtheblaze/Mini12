import prisma from "@/lib/db";
import MarketplaceClient from "@/components/MarketplaceClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const skills = await prisma.skill.findMany({
    include: {
      user: {
        select: {
          name: true,
          department: true,
          rating: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });

  return <MarketplaceClient initialSkills={skills as any} />;
}
