'use client'
import Sidenav from "../components/Sidenav";
import { Gauge, Bell, Plus, MagnifyingGlass, Lightning, ChartLine, Sparkle, CheckCircle, CircleNotch, Calendar, Clock } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const iconSize = 20;
    const iconColor = "#FF6B00"; // Orange accent color
    
    // Tasks state
    const [tasks, setTasks] = useState([
        { id: 1, title: "Design review", completed: false, priority: "High", dueDate: "Today, 2pm" },
        { id: 2, title: "Team meeting", completed: false, priority: "Medium", dueDate: "Tomorrow, 10am" },
        { id: 3, title: "Product demo", completed: false, priority: "High", dueDate: "Friday, 11am" },
        { id: 4, title: "Weekly report", completed: true, priority: "Low", dueDate: "Completed" }
    ]);
    
    // Activities state
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    
    // Fetch activities from API
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('/api/activities?userId=default_user&limit=5');
                const data = await response.json();
                setActivities(data.activities || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setLoading(false);
            }
        };
        
        fetchActivities();
    }, []);
    
    // Set greeting based on time of day
    useEffect(() => {
        const hour = new Date().getHours();
        let greetingText = '';
        
        if (hour >= 5 && hour < 12) {
            greetingText = 'Good morning';
        } else if (hour >= 12 && hour < 18) {
            greetingText = 'Good afternoon';
        } else {
            greetingText = 'Good evening';
        }
        
        setGreeting(`${greetingText}, Hardik`);
    }, []);
    
    // Toggle task completion
    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };
    
    return(
        <div className="flex h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[25%] w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-[30%] left-[40%] w-64 h-64 bg-zinc-700/10 rounded-full blur-3xl"></div>
            </div>
            
            <Sidenav />
            <div className="flex-1 p-8 overflow-auto z-1 relative">
                {/* Header with search and notifications */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlass size={iconSize} color="#6b7280" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="pl-10 pr-4 py-2 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-white w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent backdrop-blur-md"
                            />
                        </div>
                        <button className="p-2.5 bg-zinc-900/40 rounded-lg hover:bg-zinc-800/60 transition-colors backdrop-blur-md border border-zinc-800/50">
                            <Bell size={iconSize} color="white" />
                        </button>
                        <button className="p-2.5 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-orange-500/20">
                            <Plus size={iconSize} color="white" />
                        </button>
                    </div>
                </div>                
                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Greeting Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-xl transform translate-x-5 -translate-y-5"></div>
                        
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-lg font-medium text-white">Welcome</h3>
                            <div className="p-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50">
                                <Sparkle size={24} color={iconColor} weight="fill" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-4 relative z-10">{greeting}</p>
                        <div className="flex items-center gap-2 relative z-10">
                            <p className="text-zinc-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    
                    {/* Stats Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-xl transform translate-x-5 -translate-y-5"></div>
                        
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-lg font-medium text-white">Statistics</h3>
                            <div className="p-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50">
                                <Gauge size={24} color={iconColor} weight="bold" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1 relative z-10">84%</p>
                        <div className="flex items-center gap-2 relative z-10">
                            <p className="text-zinc-400">Engagement rate</p>
                            <span className="text-orange-500 text-sm flex items-center"><ChartLine size={14} className="mr-1" /> +12%</span>
                        </div>
                    </div>
                    
                    {/* Recent Activity Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-xl transform -translate-x-10 translate-y-10"></div>
                        
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-lg font-medium text-white">Recent Activity</h3>
                            <div className="bg-orange-500/10 text-orange-500 text-xs px-2 py-1 rounded-full">
                                Today
                            </div>
                        </div>
                        
                        <div className="space-y-4 relative z-10">
                            {loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <CircleNotch size={24} className="text-orange-500 animate-spin" />
                                    <span className="ml-2 text-zinc-400">Loading activities...</span>
                                </div>
                            ) : activities.length > 0 ? (
                                activities.slice(0, 3).map((activity, i) => (
                                    <div key={activity._id} className="flex items-center pb-3 border-b border-zinc-800/30">
                                        <div className="w-10 h-10 bg-zinc-800/70 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 border border-zinc-700/30">
                                            <Lightning size={20} color={iconColor} weight="fill" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{activity.title || `Activity ${i+1}`}</p>
                                            <p className="text-zinc-400 text-sm">{new Date(activity.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-zinc-500">
                                    No recent activities found
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Tasks Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl transform -translate-x-10 -translate-y-10"></div>
                        
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-lg font-medium text-white">Tasks</h3>
                            <div className="p-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50">
                                <CheckCircle size={20} color={iconColor} weight="fill" />
                            </div>
                        </div>
                        
                        <div className="space-y-3 relative z-10">
                            {tasks.map((task) => (
                                <div 
                                    key={task.id} 
                                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                                        task.completed 
                                            ? 'bg-zinc-800/20 text-zinc-400' 
                                            : 'hover:bg-zinc-800/40'
                                    }`}
                                >
                                    <div className="flex-shrink-0 mr-3">
                                        <button 
                                            onClick={() => toggleTaskCompletion(task.id)}
                                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                                task.completed 
                                                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' 
                                                    : 'border-zinc-700 hover:border-orange-500/50'
                                            }`}
                                        >
                                            {task.completed && <CheckCircle size={14} weight="fill" className="text-orange-500" />}
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${task.completed ? 'line-through' : 'text-white'}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center mt-1 space-x-2 text-xs">
                                            <span className={`px-2 py-0.5 rounded-full ${
                                                task.priority === 'High' 
                                                    ? 'bg-orange-500/20 text-orange-400' 
                                                    : task.priority === 'Medium' 
                                                        ? 'bg-yellow-500/20 text-yellow-400' 
                                                        : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {task.priority}
                                            </span>
                                            <span className="text-zinc-500 flex items-center">
                                                <Clock size={12} className="mr-1" /> {task.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <button className="w-full mt-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors text-sm flex items-center justify-center group">
                                <Plus size={16} className="mr-2 text-orange-500 group-hover:rotate-90 transition-transform duration-200" />
                                Add New Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}