"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { RequestDetailsModal } from "@/components/RequestDetailsModal";
import { SwapRequest } from "@/lib/types";

export const RecentRequests = ({ requests, currentUserId }: { requests: any[], currentUserId: number }) => {
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const router = useRouter();

    const handleRefresh = () => {
        router.refresh(); // Refresh server component data
    };

    return (
        <section className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> Recent Swap Requests
            </h2>
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <p className="text-gray-500 italic py-4">No active swap requests yet.</p>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                            <div>
                                <p className="font-semibold">
                                    {req.requesterId === currentUserId ? `Sent to ${req.receiver.name}` : `Received from ${req.requester.name}`}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold
                                        ${req.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                        ${req.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-400' : ''}
                                        ${req.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : ''}
                                        ${req.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' : ''}
                                    `}>
                                        {req.status}
                                    </span>
                                    <span>• {req.creditsAmt} hr session</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedRequest(req)}
                                className="text-sm text-purple-400 font-bold hover:text-purple-300 hover:bg-purple-500/10 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>

            <RequestDetailsModal 
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
                currentUserId={currentUserId}
                onStatusUpdate={handleRefresh}
            />
        </section>
    );
};
