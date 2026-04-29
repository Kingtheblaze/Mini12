"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
    skill: string;
    reason: string;
    priority: "high" | "medium";
}

export const AiSuggestions = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/ai/suggestions", { method: "POST" });
            const data = await res.json();
            if (data.suggestions) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    return (
        <section className="glass p-6 rounded-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 blur-3xl group-hover:bg-purple-600/30 transition-colors"></div>
            
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" /> Claude's Recommendations
                </h2>
                <button 
                    onClick={fetchSuggestions}
                    disabled={isLoading}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="space-y-4 relative z-10">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        <p className="text-sm text-gray-400 animate-pulse">Personalizing your path...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {suggestions.map((s, i) => (
                                <motion.div
                                    key={s.skill}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all group/item"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-100">{s.skill}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${s.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                            {s.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{s.reason}</p>
                                    <button className="flex items-center gap-1 text-[11px] font-bold text-purple-400 group-hover/item:gap-2 transition-all">
                                        Explores <ArrowRight className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
};
