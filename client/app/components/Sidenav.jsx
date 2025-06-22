'use client'
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, ChatsCircle, ClipboardText, UserCircle, BellSimple, FileText } from "@phosphor-icons/react";

export default function Sidenav() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    
    const iconSize = 24;
    const iconColor = "#FF6B00"; // Orange accent color
      // Check if a nav item is active
    const isActive = (path) => {
        return pathname === path;
    };
    
    // Handle collapsing toggle with simple toggle
    const handleToggleCollapse = () => {
        setCollapsed(prev => !prev);
    };
    
    // Compute width class based on current state
    const sidebarWidth = collapsed ? 'w-20' : 'w-64';
    
    return (
        <div className={`flex flex-col h-screen ${sidebarWidth} bg-black/80 text-white justify-between py-6 px-4 transition-all duration-300 ease-in-out backdrop-blur-md z-10 border-r border-zinc-800/30 shadow-lg`}>
            {/* Top: Logo and Title + Collapse Button */}
            <div>
                <div className="flex items-center mb-10">
                    <button 
                        onClick={handleToggleCollapse}
                        className="w-10 h-10 bg-zinc-900/60 rounded-lg flex items-center justify-center mr-3 border border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200 hover:border-orange-500/30 group relative"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <BellSimple 
                            size={iconSize} 
                            color={iconColor} 
                            weight="bold" 
                            className={`transition-transform duration-300 ${collapsed ? 'rotate-12 scale-90' : ''}`}
                        />
                        {collapsed && 
                            <span className="absolute left-full ml-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm whitespace-nowrap z-50">
                                Expand Menu
                            </span>
                        }
                    </button>
                    {!collapsed && 
                        <span className="text-2xl font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out">
                            Tingg
                        </span>
                    }
                </div>
                  {/* Navigation Items */}
                <nav className="flex flex-col gap-2">
                    <Link 
                        href="/dashboard" 
                        className={`group hover:bg-zinc-900/50 rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 border-l-2 ${
                            isActive('/dashboard') 
                                ? 'border-orange-500 bg-zinc-900/40 text-white' 
                                : 'border-transparent hover:border-orange-500 text-zinc-400 hover:text-white'
                        } backdrop-blur-sm`}
                    >
                        <House 
                            size={iconSize} 
                            color={isActive('/dashboard') ? iconColor : "#9ca3af"} 
                            weight={isActive('/dashboard') ? "fill" : "regular"} 
                            className="min-w-[24px]" 
                        />
                        {!collapsed && 
                            <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                                Dashboard
                            </span>
                        }
                    </Link>
                    <Link 
                        href="/chat" 
                        className={`group hover:bg-zinc-900/50 rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 border-l-2 ${
                            isActive('/chat') 
                                ? 'border-orange-500 bg-zinc-900/40 text-white' 
                                : 'border-transparent hover:border-orange-500 text-zinc-400 hover:text-white'
                        } backdrop-blur-sm`}
                    >
                        <ChatsCircle 
                            size={iconSize} 
                            color={isActive('/chat') ? iconColor : "#9ca3af"} 
                            weight={isActive('/chat') ? "fill" : "regular"} 
                            className="min-w-[24px]" 
                        />
                        {!collapsed && 
                            <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                                Chat
                            </span>
                        }
                    </Link>
                    <Link 
                        href="/activities" 
                        className={`group hover:bg-zinc-900/50 rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 border-l-2 ${
                            isActive('/activities') 
                                ? 'border-orange-500 bg-zinc-900/40 text-white' 
                                : 'border-transparent hover:border-orange-500 text-zinc-400 hover:text-white'
                        } backdrop-blur-sm`}
                    >
                        <ClipboardText 
                            size={iconSize} 
                            color={isActive('/activities') ? iconColor : "#9ca3af"} 
                            weight={isActive('/activities') ? "fill" : "regular"} 
                            className="min-w-[24px]" 
                        />
                        {!collapsed && 
                            <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                                Activities
                            </span>                        }
                    </Link>
                    <Link 
                        href="/records" 
                        className={`group hover:bg-zinc-900/50 rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 border-l-2 ${
                            isActive('/records') 
                                ? 'border-orange-500 bg-zinc-900/40 text-white' 
                                : 'border-transparent hover:border-orange-500 text-zinc-400 hover:text-white'
                        } backdrop-blur-sm`}
                    >
                        <FileText 
                            size={iconSize} 
                            color={isActive('/records') ? iconColor : "#9ca3af"} 
                            weight={isActive('/records') ? "fill" : "regular"} 
                            className="min-w-[24px]" 
                        />
                        {!collapsed && 
                            <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                                Records
                            </span>
                        }                    </Link>
                </nav>
            </div>
              {/* Bottom: Account */}
            <div className="border-t border-zinc-800/30 pt-6">
                <Link 
                    href="/account" 
                    className={`group hover:bg-zinc-900/50 rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 border-l-2 ${
                        isActive('/account') 
                            ? 'border-orange-500 bg-zinc-900/40 text-white' 
                            : 'border-transparent hover:border-orange-500 text-zinc-400 hover:text-white'
                    } backdrop-blur-sm`}
                >
                    <UserCircle 
                        size={iconSize} 
                        color={isActive('/account') ? iconColor : "#9ca3af"} 
                        weight={isActive('/account') ? "fill" : "regular"} 
                        className="min-w-[24px]" 
                    />
                    {!collapsed && 
                        <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                            Account
                        </span>
                    }
                </Link>
            </div>
        </div>
    );
}