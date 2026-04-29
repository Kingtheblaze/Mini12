"use client";

import { useState } from "react";
import { Plus, Github } from "lucide-react";
import { Skill } from "@/lib/types";
import { ManageSkillsModal } from "./ManageSkillsModal";
import { useRouter } from "next/navigation";

interface SkillsSidebarProps {
    initialSkills: Skill[];
}

export const SkillsSidebar = ({ initialSkills }: SkillsSidebarProps) => {
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const router = useRouter();

    return (
        <section className="glass p-6 rounded-2xl relative overflow-hidden group">
            <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                Your Skills
                <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5 group-hover:border-purple-500/30 transition-all">
                    {initialSkills.length} Total
                </span>
            </h2>
            <div className="space-y-3">
                {initialSkills.length === 0 ? (
                    <p className="text-xs text-gray-500 italic py-2">Add your first skill to start swapping!</p>
                ) : (
                    initialSkills.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                            <span className="text-gray-300 font-medium">{s.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${s.type === 'HAVE' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {s.type}
                            </span>
                        </div>
                    ))
                )}
                
                <button 
                    onClick={() => setIsManageModalOpen(true)}
                    className="w-full btn-primary py-3 text-sm mt-4 font-bold rounded-xl shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Manage Skills
                </button>
            </div>

            <ManageSkillsModal 
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                initialSkills={initialSkills}
                onUpdate={() => router.refresh()}
            />
        </section>
    );
};
