'use client'
import Sidenav from "../components/Sidenav";
import { MagnifyingGlass, Bell, Plus, Calendar, Clock, Tag, FunnelSimple, ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { useState } from "react";

export default function Activities() {
    const iconSize = 20;
    const iconColor = "#FF6B00"; // Orange accent color
    
    // Mock activities data
    const [activities, setActivities] = useState([
        {
            id: "act_123456",
            user_id: "user_123",
            reminder_id: "rem_789",
            type: "log_completed",
            timestamp: "2023-06-21T21:01:00Z",
            description: "You journaled on Jun 21 — score: ✅",
            tags: ["journal", "daily", "positive", "voice"],
            metadata: {
                ai_score: 1,
                response: "Yes, I did it.",
                method: "voice",
                triggered_by: "auto",
                next_trigger: "2023-06-22T21:00:00Z"
            }
        },
        {
            id: "act_234567",
            user_id: "user_123",
            reminder_id: "rem_456",
            type: "reminder_sent",
            timestamp: "2023-06-20T15:30:00Z",
            description: "Reminder sent: Time to meditate",
            tags: ["meditation", "wellness", "afternoon"],
            metadata: {
                ai_score: null,
                response: null,
                method: "push",
                triggered_by: "schedule",
                next_trigger: "2023-06-21T15:30:00Z"
            }
        },
        {
            id: "act_345678",
            user_id: "user_123",
            reminder_id: "rem_123",
            type: "log_skipped",
            timestamp: "2023-06-19T08:15:00Z",
            description: "Workout skipped on Jun 19 — score: ❌",
            tags: ["workout", "morning", "skipped"],
            metadata: {
                ai_score: 0,
                response: "I was too tired.",
                method: "text",
                triggered_by: "auto",
                next_trigger: "2023-06-20T08:00:00Z"
            }
        },
        {
            id: "act_456789",
            user_id: "user_123",
            reminder_id: "rem_321",
            type: "manual_entry",
            timestamp: "2023-06-18T22:45:00Z",
            description: "Added reading session manually — 30 minutes",
            tags: ["reading", "evening", "manual"],
            metadata: {
                ai_score: 1,
                response: "Read for 30 minutes before bed.",
                method: "manual",
                triggered_by: "user",
                next_trigger: null
            }
        },
        {
            id: "act_567890",
            user_id: "user_123",
            reminder_id: "rem_654",
            type: "reminder_missed",
            timestamp: "2023-06-17T19:00:00Z",
            description: "Missed reminder: Drink water",
            tags: ["hydration", "health", "missed"],
            metadata: {
                ai_score: null,
                response: null,
                method: null,
                triggered_by: "schedule",
                next_trigger: "2023-06-18T19:00:00Z"
            }
        }
    ]);
    
    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Get status color based on activity type
    const getStatusColor = (type) => {
        switch(type) {
            case 'log_completed':
                return 'bg-green-500/20 text-green-400';
            case 'log_skipped':
                return 'bg-red-500/20 text-red-400';
            case 'reminder_sent':
                return 'bg-blue-500/20 text-blue-400';
            case 'reminder_missed':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'manual_entry':
                return 'bg-purple-500/20 text-purple-400';
            default:
                return 'bg-zinc-500/20 text-zinc-400';
        }
    };
    
    // Format activity type for display
    const formatType = (type) => {
        return type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    
    return(        <div className="flex h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
                <div className="absolute top-[-15%] right-[-5%] w-[30rem] h-[30rem] bg-orange-500/10 rounded-full blur-[100px] opacity-70"></div>
                <div className="absolute bottom-[-20%] left-[15%] w-[35rem] h-[35rem] bg-orange-500/5 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute top-[20%] left-[40%] w-[25rem] h-[25rem] bg-zinc-800/20 rounded-full blur-[80px] opacity-70"></div>
                <div className="absolute top-[60%] right-[15%] w-[20rem] h-[20rem] bg-orange-600/5 rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0"></div>
            </div>
            
            <Sidenav />
            <div className="flex-1 p-8 overflow-auto z-1 relative">
                {/* Header with search and notifications */}                {/* Header with title and buttons */}
                <div className="flex flex-col mb-10 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Activities</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlass size={iconSize} color="#6b7280" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search activities..." 
                                    className="pl-10 pr-4 py-2 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-white w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent backdrop-blur-md"
                                />
                            </div>
                            <button className="p-2.5 bg-zinc-900/40 rounded-lg hover:bg-zinc-800/60 transition-colors backdrop-blur-md border border-zinc-800/50">
                                <FunnelSimple size={iconSize} color="white" />
                            </button>
                            <button className="p-2.5 bg-zinc-900/40 rounded-lg hover:bg-zinc-800/60 transition-colors backdrop-blur-md border border-zinc-800/50">
                                <Bell size={iconSize} color="white" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Add Activity Button */}
                    <button className="flex items-center justify-center py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 text-white font-medium">
                        <Plus size={20} className="mr-2" weight="bold" />
                        Add New Activity
                    </button>
                </div>
                  {/* Activities table-like cards */}
                <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-zinc-800/50 shadow-xl mb-8 overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-4 p-5 border-b border-zinc-800/50 text-zinc-400 text-sm font-medium bg-black/20">
                        <div className="col-span-3 flex items-center">
                            <span>Date & Time</span>
                            <button className="ml-1 text-zinc-500 hover:text-white">
                                <ArrowDown size={14} />
                            </button>
                        </div>
                        <div className="col-span-4">Description</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-3">Tags</div>
                    </div>
                    
                    {/* Table body */}
                    {activities.map((activity, index) => (
                        <div 
                            key={activity.id} 
                            className={`grid grid-cols-12 gap-4 p-5 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors ${index % 2 === 0 ? 'bg-black/10' : ''}`}
                        >
                            <div className="col-span-3 flex items-start">
                                <div className="flex flex-col">
                                    <span className="text-white font-medium">
                                        {formatDate(activity.timestamp)}
                                    </span>
                                    <span className="text-zinc-500 text-xs flex items-center mt-1">
                                        <Clock size={12} className="mr-1" /> 
                                        {activity.metadata.method || '-'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="col-span-4">
                                <p className="text-white">{activity.description}</p>
                                {activity.metadata.response && (
                                    <p className="text-zinc-400 text-sm mt-1 italic">"{activity.metadata.response}"</p>
                                )}
                            </div>
                            
                            <div className="col-span-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.type)}`}>
                                    {formatType(activity.type)}
                                </span>
                            </div>
                            
                            <div className="col-span-3 flex flex-wrap gap-2">
                                {activity.tags.map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-zinc-800/50 text-zinc-300 text-xs px-2 py-1 rounded-full flex items-center"
                                    >
                                        <Tag size={10} className="mr-1 text-orange-500" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Load more button */}
                <div className="flex justify-center">
                    <button className="py-3 px-6 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors text-sm flex items-center justify-center">
                        Load More Activities
                    </button>
                </div>
            </div>
        </div>
    )
}