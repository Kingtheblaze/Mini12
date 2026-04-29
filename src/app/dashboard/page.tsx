import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Clock, Zap, Users, ArrowRight, Sparkles } from "lucide-react";
import { Skill, SwapRequest } from "@/lib/types";
import { AiSuggestions } from "@/components/AiSuggestions";
import { AiAssistant } from "@/components/AiAssistant";

import { RecentRequests } from "@/components/RecentRequests";
import { SkillsSidebar } from "@/components/SkillsSidebar";
import { SmartMatches } from "@/components/SmartMatches";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) return redirect("/login");

    const userId = parseInt(session.user.id);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            skills: true,
            requestsSent: { include: { receiver: { select: { name: true, department: true, email: true } } } },
            requestsRecv: { include: { requester: { select: { name: true, department: true, email: true } } } },
        },
    });

    if (!user) return redirect("/login");

    // Simple Matching Algorithm: Find users who HAVE what I NEED or vice versa
    const myNeeds = user.skills.filter(s => s.type === "NEED").map(s => s.name.toLowerCase());
    const myHaves = user.skills.filter(s => s.type === "HAVE").map(s => s.name.toLowerCase());

    const matches = await prisma.skill.findMany({
        where: {
            AND: [
                { userId: { not: userId } },
                {
                    OR: [
                        { AND: [{ type: "HAVE" }, { name: { in: myNeeds } }] },
                        { AND: [{ type: "NEED" }, { name: { in: myHaves } }] }
                    ]
                }
            ]
        },
        include: { user: { include: { skills: true } } }
    });

    const allRequests = [...user.requestsSent, ...user.requestsRecv].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="space-y-8 py-8 relative">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, <span className="gradient-text">{user.name}</span></h1>
                    <p className="text-gray-400">{user.department} • Year {user.year}</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Time Credits</p>
                            <p className="text-xl font-bold">{user.timeCredits} hrs</p>
                        </div>
                    </div>
                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Sessions</p>
                            <p className="text-xl font-bold">{user.totalSessions}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Requests */}
                    <RecentRequests requests={allRequests} currentUserId={userId} />

                    {/* Skill Suggestions (AI Integrated) */}
                    <AiSuggestions />

                    {/* Skill Matches (Automated) */}
                    <SmartMatches matches={matches} currentUserSkills={user.skills as any[]} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <SkillsSidebar initialSkills={user.skills as any[]} />

                    {/* AI Quick Tips Section */}
                    <section className="glass p-6 rounded-2xl bg-purple-600/5 border-purple-500/20">
                        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Bot className="w-5 h-5 text-purple-400" /> AI Quick Tips
                        </h2>
                        <p className="text-xs text-gray-400 leading-relaxed italic">
                            "Try adding 'Public Speaking' to your HAVE list. It's trending in your department this week!"
                        </p>
                    </section>
                </div>
            </div>

            {/* Floating AI Assistant */}
            <AiAssistant />
        </div>
    );
}

// Inline Bot icon since it might not be imported from lucide-react in current scope
const Bot = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
    </svg>
);
