"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    Briefcase,
    LayoutDashboard,
    PlusCircle,
    LogOut,
    Search,
    Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showNotifications, setShowNotifications] = useState(false);

    const navItems = [
        { name: "Marketplace", href: "/", icon: Search },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Post Skill", href: "/post-skill", icon: PlusCircle },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                SkillSwap
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5",
                                        pathname === item.href
                                            ? "text-purple-400 bg-purple-400/10"
                                            : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors relative"
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-black" />
                                    </button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-80 glass p-4 rounded-2xl shadow-2xl border border-white/10"
                                            >
                                                <h3 className="text-sm font-bold mb-3 px-2">Notifications</h3>
                                                <div className="space-y-2">
                                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                                        <p className="text-xs font-medium">New Swap Request</p>
                                                        <p className="text-[10px] text-gray-500">John Doe wants to swap Python for UI Design</p>
                                                    </div>
                                                    <p className="text-[10px] text-center text-gray-500 py-2">No other new notifications</p>
                                                </div>
                                                <button className="w-full mt-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                                    View All Activity
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-xs font-bold text-white leading-none">{session.user?.name}</p>
                                        <Link href="/profile" className="text-[10px] text-purple-400 hover:underline">View Profile</Link>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
                                    Login
                                </Link>
                                <Link href="/register" className="btn-primary px-4 py-2 text-sm rounded-xl">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
