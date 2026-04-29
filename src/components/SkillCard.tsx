"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Skill } from "@/lib/types";
import { SwapRequestModal } from "@/components/SwapRequestModal";

export const SkillCard = ({ skill }: { skill: Skill }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRequest = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer group"
            >
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                        {skill.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">{skill.user?.rating || "5.0"}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {skill.name}
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                    Offered by <span className="text-purple-300 font-medium">{skill.user?.name || "Unknown"}</span>
                    <br />
                    <span className="text-xs">{skill.user?.department || "No Department"}</span>
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gray-500 text-xs">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                            {skill.type === "HAVE" ? "TEACHING" : "LEARNING"}
                        </span>
                    </div>
                    <button
                        onClick={handleRequest}
                        className="flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors p-2 hover:bg-purple-500/5 rounded-lg"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Request Swap
                    </button>
                </div>
            </motion.div>

            <SwapRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                skill={skill}
            />
        </>
    );
};
