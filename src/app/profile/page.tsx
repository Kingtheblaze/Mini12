import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { User as UserIcon, Shield, Star, Award, TrendingUp, History } from "lucide-react";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) return redirect("/login");

    const userId = parseInt(session.user.id);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            skills: true,
            requestsSent: { include: { receiver: { select: { name: true } } }, orderBy: { id: "desc" }, take: 5 },
            requestsRecv: { include: { requester: { select: { name: true } } }, orderBy: { id: "desc" }, take: 5 },
        },
    });

    if (!user) return redirect("/login");

    const stats = [
        { label: "Time Credits", value: `${user.timeCredits}h`, icon: Star, color: "text-yellow-400" },
        { label: "Total Swaps", value: user.totalSessions, icon: TrendingUp, color: "text-green-400" },
        { label: "Reliability", value: "98%", icon: Shield, color: "text-blue-400" },
        { label: "Reputation", value: user.rating || "5.0", icon: Award, color: "text-purple-400" },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 space-y-12">
            {/* Profile Header */}
            <section className="flex flex-col md:flex-row items-center gap-8 glass p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center relative z-10">
                    <UserIcon className="w-16 h-16 text-white" />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-black" />
                </div>

                <div className="text-center md:text-left space-y-2 relative z-10">
                    <h1 className="text-4xl font-bold">{user.name}</h1>
                    <p className="text-gray-400">
                        {user.department} • Year {user.year}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">Early Adopter</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">Mentor</span>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl text-center space-y-2 group hover:scale-105 transition-transform cursor-default">
                        <stat.icon className={`w-6 h-6 mx-auto ${stat.color} group-hover:animate-pulse`} />
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills & Badges */}
                <section className="glass p-8 rounded-2xl space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400" /> Expertise & Needs
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Skills Offered</p>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.filter(s => s.type === "HAVE").map(s => (
                                    <span key={s.id} className="px-3 py-1 glass rounded-lg text-xs hover:bg-white/10 transition-colors">
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Skills Desired</p>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.filter(s => s.type === "NEED").map(s => (
                                    <span key={s.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-colors">
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent History */}
                <section className="glass p-8 rounded-2xl space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <History className="w-5 h-5 text-blue-400" /> Recent Swap Activity
                    </h2>
                    <div className="space-y-4">
                        {[...user.requestsSent, ...user.requestsRecv].length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No swap history found.</p>
                        ) : (
                            <>
                                {[...user.requestsSent, ...user.requestsRecv].map((req: any) => (
                                    <div key={req.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-xs font-bold">
                                                {req.requesterId === userId
                                                    ? `Swapped with ${req.receiver.name}`
                                                    : `Swapped with ${req.requester.name}`}
                                            </p>
                                            <p className="text-[10px] text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${req.status === "COMPLETED" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-500"}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
