"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/lib/types";

interface SwapRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    skill: Skill;
}

export const SwapRequestModal = ({ isOpen, onClose, skill }: SwapRequestModalProps) => {
    const [message, setMessage] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const generateAiMessage = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/ai/match-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: skill.userId }),
            });
            const data = await res.json();
            if (data.message) {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Failed to generate message:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: skill.userId,
                    message: message,
                    creditsAmt: 1,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to send request");
            }
            // Optionally, we could show a toast success message here
            onClose();
        } catch (error) {
            console.error("Error sending swap request:", error);
            // Optionally show error toast here
        } finally {
            setIsSending(false);
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
                    className="relative w-full max-w-lg max-h-[85vh] bg-[#0D1117] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 z-[10000] flex flex-col"
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-purple-600/10 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold">Request Skill Swap</h2>
                            <p className="text-xs text-purple-400">Trading for: {skill.name}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-300">Your Message</label>
                                <button
                                    onClick={generateAiMessage}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 group transition-all"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3 group-hover:scale-110" />
                                    )}
                                    Magic Draft with Claude
                                </button>
                            </div>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hi, I'm interested in swapping skills with you! I can teach you..."
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none no-scrollbar"
                            />
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                            <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <p className="text-[11px] text-blue-300 leading-relaxed">
                                Tip: Be specific about what you can offer in return. Personalizing your request increases your chance of acceptance by 40%.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 shrink-0">
                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || isSending}
                            className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg shadow-purple-600/20 disabled:opacity-50"
                        >
                            {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" /> Send Swap Request
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

            </div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};
