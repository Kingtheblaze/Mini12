"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2, Sparkles, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/lib/types";
import { toast } from "sonner";

interface ManageSkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSkills: Skill[];
    onUpdate: () => void;
}

interface Suggestion {
    skill: string;
    reason: string;
    priority: string;
}

export const ManageSkillsModal = ({ isOpen, onClose, initialSkills, onUpdate }: ManageSkillsModalProps) => {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillType, setNewSkillType] = useState<"HAVE" | "NEED">("HAVE");
    const [isAdding, setIsAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    useEffect(() => {
        setSkills(initialSkills);
    }, [initialSkills]);

    useEffect(() => {
        if (isOpen) {
            fetchAiSuggestions();
        }
    }, [isOpen]);

    const fetchAiSuggestions = async () => {
        setIsLoadingSuggestions(true);
        try {
            const res = await fetch("/api/ai/suggestions", { method: "POST" });
            const data = await res.json();
            if (data.suggestions) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error("Failed to fetch AI suggestions:", error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleAddSkill = async (name: string, type: "HAVE" | "NEED") => {
        if (!name.trim()) return;
        setIsAdding(true);
        try {
            const res = await fetch("/api/skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    type,
                    category: "Other", // Default category for now
                }),
            });

            if (res.ok) {
                const newSkill = await res.json();
                setSkills([...skills, newSkill]);
                setNewSkillName("");
                toast.success(`Skill "${name}" added!`);
                onUpdate();
            } else {
                toast.error("Failed to add skill");
            }
        } catch (error) {
            toast.error("Error adding skill");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteSkill = async (id: number) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSkills(skills.filter(s => s.id !== id));
                toast.success("Skill removed");
                onUpdate();
            } else {
                toast.error("Failed to delete skill");
            }
        } catch (error) {
            toast.error("Error deleting skill");
        } finally {
            setDeletingId(null);
        }
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] bg-[#0D1117] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 z-[10000] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-600/5 shrink-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">Manage Your Skills</h2>
                            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full border border-purple-500/20">
                                {skills.length} active skills
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Quick Add Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add New Skill
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    placeholder="Enter skill name (e.g. React, UX Design)"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill(newSkillName, newSkillType)}
                                />
                                <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
                                    <button 
                                        onClick={() => setNewSkillType("HAVE")}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${newSkillType === 'HAVE' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500'}`}
                                    >
                                        HAVE
                                    </button>
                                    <button 
                                        onClick={() => setNewSkillType("NEED")}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${newSkillType === 'NEED' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500'}`}
                                    >
                                        NEED
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleAddSkill(newSkillName, newSkillType)}
                                    disabled={!newSkillName.trim() || isAdding}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Add
                                </button>
                            </div>

                            {/* Claude Suggestions Chips */}
                            <div className="bg-purple-500/5 rounded-2xl p-4 border border-purple-500/10">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Claude's Recommendations
                                    </p>
                                    {isLoadingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-purple-400" />}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.slice(0, 4).map((s) => (
                                        <button
                                            key={s.skill}
                                            onClick={() => handleAddSkill(s.skill, "HAVE")}
                                            className="text-[11px] bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 px-3 py-1.5 rounded-full text-gray-300 transition-all flex items-center gap-2 group"
                                        >
                                            <span>{s.skill}</span>
                                            <Plus className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                    {suggestions.length === 0 && !isLoadingSuggestions && (
                                        <p className="text-[10px] text-gray-500 italic">No suggestions at the moment.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Current Skills Lists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* HAVE List */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest border-l-2 border-purple-500 pl-2">I Can Teach (HAVE)</h3>
                                <div className="space-y-2">
                                    {skills.filter(s => s.type === "HAVE").map((skill) => (
                                        <div key={skill.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 group">
                                            <span className="text-sm font-medium">{skill.name}</span>
                                            <button 
                                                onClick={() => handleDeleteSkill(skill.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                {deletingId === skill.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    ))}
                                    {skills.filter(s => s.type === "HAVE").length === 0 && (
                                        <p className="text-xs text-gray-600 italic py-2">No "HAVE" skills added yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* NEED List */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">I Want to Learn (NEED)</h3>
                                <div className="space-y-2">
                                    {skills.filter(s => s.type === "NEED").map((skill) => (
                                        <div key={skill.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 group">
                                            <span className="text-sm font-medium">{skill.name}</span>
                                            <button 
                                                onClick={() => handleDeleteSkill(skill.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                {deletingId === skill.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    ))}
                                    {skills.filter(s => s.type === "NEED").length === 0 && (
                                        <p className="text-xs text-gray-600 italic py-2">No "NEED" skills added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 bg-black/20 shrink-0">
                        <button 
                            onClick={onClose}
                            className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold transition-all border border-white/10"
                        >
                            Done Managing
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};
