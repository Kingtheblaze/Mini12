"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check, XCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: any; // SwapRequest with requester/receiver joined
    currentUserId: number;
    onStatusUpdate: () => void; // Refresh parent data
}

export const RequestDetailsModal = ({ isOpen, onClose, request, currentUserId, onStatusUpdate }: RequestDetailsModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!isOpen || !request || !mounted) return null;

    const isRequester = request.requesterId === currentUserId;
    const isReceiver = request.receiverId === currentUserId;
    
    const otherUser = isRequester ? request.receiver : request.requester;

    const handleAction = async (newStatus: string) => {
        setIsLoading(true);
        setAction(newStatus);
        setErrorMsg("");

        try {
            const res = await fetch(`/api/requests/${request.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Action failed");
            }

            onStatusUpdate();
            onClose();
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
            setAction(null);
        }
    };

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
                    className="relative w-full max-w-md max-h-[90vh] bg-[#0D1117] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 z-[10000] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-600/10 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold">Swap Request</h2>
                            <p className="text-xs text-blue-400 font-medium">Status: {request.status}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-red-500/20 text-red-300 text-xs border border-red-500/30">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-500 mb-1">
                                    {isRequester ? "You requested to swap with:" : "Swap request from:"}
                                </p>
                                <p className="font-bold text-lg">{otherUser.name}</p>
                                <p className="text-xs text-gray-400">{otherUser.department || "No Department"}</p>
                            </div>
                            
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-500 mb-1">Message:</p>
                                <p className="text-sm italic text-gray-300">"{request.message || "No message provided."}"</p>
                            </div>

                            <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                                <p className="text-xs text-purple-300 flex justify-between">
                                    <span>Time Credit Value:</span>
                                    <span className="font-bold">{request.creditsAmt} hrs</span>
                                </p>
                            </div>

                            {request.status === "ACCEPTED" && (
                                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-xs text-green-400 font-bold mb-1 uppercase tracking-wider">Contact Information</p>
                                    <p className="text-sm text-gray-200">{otherUser.name}'s Email: <span className="font-bold text-white selection:bg-purple-500">{otherUser.email}</span></p>
                                    <p className="text-[10px] text-green-500/70 mt-1 italic">Contact each other to coordinate your swap session!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action buttons footer */}
                    <div className="p-6 border-t border-white/10 bg-black/20 shrink-0">
                        {request.status === "PENDING" && isReceiver && (
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleAction("ACCEPTED")}
                                    disabled={isLoading}
                                    className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-green-500/30 transition-all disabled:opacity-50"
                                >
                                    {isLoading && action === "ACCEPTED" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Accept Swap
                                </button>
                                <button 
                                    onClick={() => handleAction("REJECTED")}
                                    disabled={isLoading}
                                    className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-500/30 transition-all disabled:opacity-50"
                                >
                                    {isLoading && action === "REJECTED" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    Decline
                                </button>
                            </div>
                        )}

                        {request.status === "PENDING" && isRequester && (
                            <div className="text-center text-gray-400 text-sm py-2">
                                Waiting for {otherUser.name}'s response...
                            </div>
                        )}

                        {request.status === "ACCEPTED" && (
                            <button 
                                onClick={() => handleAction("COMPLETED")}
                                disabled={isLoading}
                                className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-md disabled:opacity-50"
                            >
                                {isLoading && action === "COMPLETED" ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                Mark as Completed
                            </button>
                        )}

                        {(request.status === "REJECTED" || request.status === "COMPLETED") && (
                            <div className={`text-center font-bold text-sm py-2 ${request.status === 'COMPLETED' ? 'text-green-400' : 'text-red-400'}`}>
                                This request is {request.status.toLowerCase()}.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};
