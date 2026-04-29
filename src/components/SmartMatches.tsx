/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { useState } from "react";
import { Zap, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Skill } from "@/lib/types";
import { SwapRequestModal } from "./SwapRequestModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SmartMatchesProps {
    matches: any[]; // Extended Skill type with user
    currentUserSkills: Skill[];
}

export const SmartMatches = ({ matches, currentUserSkills }: SmartMatchesProps) => {
    const [selectedSkill, setSelectedSkill] = useState<any | null>(null);
    const [isMutuallySending, setIsMutuallySending] = useState<number | null>(null);
    const router = useRouter();

    const checkMutual = (match: any) => {
        const myNeeds = currentUserSkills.filter(s => s.type === "NEED").map(s => s.name.toLowerCase());
        const myHaves = currentUserSkills.filter(s => s.type === "HAVE").map(s => s.name.toLowerCase());
        
        const theirNeeds = match.user.skills.filter((s: Skill) => s.type === "NEED").map((s: Skill) => s.name.toLowerCase());
        const theirHaves = match.user.skills.filter((s: Skill) => s.type === "HAVE").map((s: Skill) => s.name.toLowerCase());

        // We both have what the other needs
        const iHaveTheyNeed = myHaves.some((h: string) => theirNeeds.includes(h));
        const theyHaveINeed = theirHaves.some((h: string) => myNeeds.includes(h));

        return iHaveTheyNeed && theyHaveINeed;
    };

    const handleMutualSwap = async (match: any) => {
        setIsMutuallySending(match.id);
        try {
            const res = await fetch("/api/requests/mutual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    otherUserId: match.userId,
                    message: `Perfect match! Let's swap ${match.name} and help each other.`
                })
            });

            if (res.ok) {
                toast.success("Mutual swap requested! Net-zero exchange initiated.");
                router.refresh();
            } else {
                toast.error("Failed to initiate mutual swap.");
            }
        } catch (error) {
            toast.error("Mutual swap error.");
        } finally {
            setIsMutuallySending(null);
        }
    };

    return (
        <section className="glass p-6 rounded-2xl relative overflow-hidden group">
            {/* Ambient Background Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] -z-10 group-hover:bg-orange-500/10 transition-all duration-700"></div>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" /> Smart Matches
                {matches.length > 0 && (
                    <span className="ml-auto text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">
                        {matches.length} matches found
                    </span>
                )}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.length === 0 ? (
                    <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                        <div className="p-3 bg-white/5 rounded-full">
                            <Zap className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-gray-400 font-medium text-sm">No direct matches yet</p>
                            <p className="text-xs text-gray-500">Add more "NEED" skills to your profile to find partners!</p>
                        </div>
                    </div>
                ) : (
                    matches.map((match) => {
                        const isProviding = match.type === "HAVE";
                        const rationale = isProviding
                            ? `They offer "${match.name}" which you need.`
                            : `They need "${match.name}" which you offer.`;

                        const isMutual = checkMutual(match);

                        return (
                            <div 
                                key={match.id} 
                                className="group/card p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all relative overflow-hidden active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isProviding ? "bg-purple-500/20 text-purple-400 border border-purple-500/20" : "bg-blue-500/20 text-blue-400 border border-blue-500/20"}`}>
                                            {isProviding ? "Direct Match" : "High Demand"}
                                        </span>
                                        {isMutual && (
                                            <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 animate-pulse">
                                                Perfect Swap
                                            </span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => setSelectedSkill(match)}
                                        className="p-2 bg-white/5 rounded-lg opacity-0 group-hover/card:opacity-100 transition-all transform translate-x-2 group-hover/card:translate-x-0"
                                    >
                                        <ArrowRight className="w-4 h-4 text-purple-400" />
                                    </button>
                                </div>
                                
                                <div onClick={() => setSelectedSkill(match)} className="space-y-1 cursor-pointer">
                                    <p className="font-bold text-xl tracking-tight leading-none capitalize group-hover/card:text-purple-400 transition-colors">
                                        {match.name}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium tracking-tight">by {match.user.name} • {match.user.department}</p>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-yellow-500" />
                                        </div>
                                        <p className="text-[11px] text-gray-400 font-medium truncate max-w-[120px]">
                                            {rationale}
                                        </p>
                                    </div>
                                    
                                    {isMutual && (
                                        <button 
                                            onClick={() => handleMutualSwap(match)}
                                            disabled={isMutuallySending !== null}
                                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-lg shadow-yellow-500/10 flex items-center gap-1"
                                        >
                                            {isMutuallySending === match.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                            Mutual Swap
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {selectedSkill && (
                <SwapRequestModal 
                    isOpen={!!selectedSkill}
                    onClose={() => setSelectedSkill(null)}
                    skill={selectedSkill}
                />
            )}
        </section>
    );
};
