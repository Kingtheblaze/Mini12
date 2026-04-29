"use client";

import { useState, useEffect } from "react";
import { SkillCard } from "@/components/SkillCard";
import { SkillCardSkeleton } from "@/components/SkillCardSkeleton";
import { Search, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/lib/types";

export default function MarketplaceClient({ initialSkills }: { initialSkills: Skill[] }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [category, setCategory] = useState("All");
    const [skills, setSkills] = useState(initialSkills);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const filtered = initialSkills.filter(skill => {
            const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase()) ||
                (skill.user?.name?.toLowerCase().includes(search.toLowerCase()) ?? false);
            const matchesType = filter === "ALL" || skill.type === filter;
            const matchesCategory = category === "All" || skill.category === category;
            return matchesSearch && matchesType && matchesCategory;
        });
        setSkills(filtered);
    }, [search, filter, category, initialSkills]);

    const categories = ["All", "Programming", "Mathematics", "Languages", "Science", "Design", "Other"];

    return (
        <div className="space-y-12 py-8">
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight"
                >
                    Learn. <span className="gradient-text">Swap.</span> Grow.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-400 max-w-2xl mx-auto"
                >
                    The hardware of knowledge, the software of community.
                    Trade skills, not coins.
                </motion.p>

                <div className="max-w-xl mx-auto relative mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search skills or creators..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full glass rounded-full py-4 pl-12 pr-6 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                </div>
            </section>

            {/* Filter Bar */}
            <section className="flex flex-wrap items-center justify-between gap-6 glass p-4 rounded-2xl">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-1.5 text-sm rounded-full transition-all whitespace-nowrap ${category === cat ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "glass hover:bg-white/10 text-gray-400"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setFilter("ALL")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === "ALL" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
                    >
                        ALL
                    </button>
                    <button
                        onClick={() => setFilter("HAVE")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === "HAVE" ? "bg-purple-500/20 text-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                    >
                        HAVE
                    </button>
                    <button
                        onClick={() => setFilter("NEED")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === "NEED" ? "bg-blue-500/20 text-blue-400" : "text-gray-500 hover:text-gray-300"}`}
                    >
                        NEED
                    </button>
                </div>
            </section>

            {/* Featured Skills Grid */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 text-gray-400">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">{skills.length} skills found match your criteria</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkillCardSkeleton key={i} />)
                        ) : (
                            skills.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SkillCard skill={skill} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
