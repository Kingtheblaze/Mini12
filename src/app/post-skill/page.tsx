"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function PostSkillPage() {
    const [formData, setFormData] = useState({
        name: "",
        type: "HAVE",
        category: "Programming",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/skills", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            toast.success("Skill posted successfully!");
            router.push("/dashboard");
        } else {
            toast.error("Failed to post skill. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="glass p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <PlusCircle className="w-8 h-8 text-purple-400" />
                    <h1 className="text-3xl font-bold">List a New Skill</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Skill Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Python, Graphic Design, Calculus"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="HAVE">I Have (Teach)</option>
                                <option value="NEED">I Need (Learn)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Programming">Programming</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Languages">Languages</option>
                                <option value="Science">Science</option>
                                <option value="Design">Design</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary h-14 text-lg font-bold disabled:opacity-50"
                    >
                        {loading ? "Posting..." : "Create Skill Listing"}
                    </button>
                </form>
            </div>
        </div>
    );
}
