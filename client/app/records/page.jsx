'use client'
import { useState, useEffect, useMemo } from "react";
import Sidenav from "../components/Sidenav";
import { CircleNotch, MagnifyingGlass, Plus, ArrowsClockwise } from "@phosphor-icons/react";

export default function Records() {
    const [records, setRecords] = useState([]);
    const [activities, setActivities] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});
    const iconSize = 20;
    const iconColor = "#FF6B00"; // Orange accent color
    
    // Helper function to safely get activity name from complex objects
    const getActivityName = (activity) => {
        if (!activity) return null;
        
        // Direct name property
        if (activity.name) return activity.name;
        
        // Name in form object
        if (activity.form && activity.form.name) return activity.form.name;
        
        // Description as fallback
        if (activity.description) return activity.description;
        
        // Check in metadata
        if (activity.metadata && activity.metadata.form_data && activity.metadata.form_data.name) {
            return activity.metadata.form_data.name;
        }
        
        return null;
    };
    
    // Helper function to safely get substring with null/undefined check
    const safeSubstring = (str, start, end) => {
        if (!str) return '';
        if (typeof str !== 'string') {
            str = String(str);
        }
        return str.substring(start, end);
    };
    
    // Function to toggle card expansion
    const toggleCardExpansion = (activityId) => {
        setExpandedCards(prev => ({
            ...prev,
            [activityId]: !prev[activityId]
        }));
    };

    // Group records by activity ID
    const groupedRecords = useMemo(() => {
        const groups = {};
        
        records.forEach(record => {
            const activityId = record.activityId || 'unknown';
            if (!groups[activityId]) {
                groups[activityId] = {
                    id: activityId,
                    records: [],
                    count: 0
                };
            }
            groups[activityId].records.push(record);
            groups[activityId].count += 1;
        });
        
        return Object.values(groups);
    }, [records]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                
                // Fetch all records
                const recordsResponse = await fetch('/api/get-all');
                
                if (!recordsResponse.ok) {
                    throw new Error('Failed to fetch records');
                }
                  const recordsData = await recordsResponse.json();
                const allRecords = recordsData.records || [];
                setRecords(allRecords);
                  // Extract unique activity IDs
                const activityIds = [...new Set(allRecords.map(record => record.activityId).filter(Boolean))];
                console.log('Activity IDs to fetch:', activityIds);
                
                // Fetch activity details for each unique activity ID
                const activityDetails = {};
                await Promise.all(
                    activityIds.map(async (activityId) => {                            try {
                                console.log(`Fetching activity with ID: ${activityId}`);
                                
                                // First try with regular API
                                let activityResponse = await fetch(`/api/activity?id=${activityId}`);
                                
                                // If that fails, try with extended API
                                if (!activityResponse.ok) {
                                    console.log(`Regular API failed, trying extended API for ${activityId}`);
                                    activityResponse = await fetch(`/api/extactivity?id=${activityId}`);
                                }
                                
                                if (activityResponse.ok) {
                                    const activityData = await activityResponse.json();
                                    if (activityData.activity) {
                                        activityDetails[activityId] = activityData.activity;
                                        const activityName = getActivityName(activityData.activity);
                                        console.log(`Successfully fetched activity ${activityId}:`, activityName || 'Unnamed');
                                    }
                                } else {
                                    const errorText = await activityResponse.text();
                                    console.warn(`Failed to fetch activity ${activityId} (Status ${activityResponse.status}):`, errorText);
                                    
                                    // Create a placeholder activity with the ID
                                    activityDetails[activityId] = { 
                                        _id: activityId,
                                        form: { name: `Activity ${safeSubstring(activityId, 0, 8)}...` },
                                        notFound: true
                                    };
                                    console.log(`Created placeholder for activity ${activityId}`);
                                }
                        } catch (err) {
                            console.error(`Error fetching activity ${activityId}:`, err);
                        }
                    })
                );
                
                setActivities(activityDetails);
                console.log('Fetched activities:', activityDetails);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    
    return (
        <div className="flex h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[25%] w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-[30%] left-[40%] w-64 h-64 bg-zinc-700/10 rounded-full blur-3xl"></div>
            </div>
            
            <Sidenav />
            <div className="flex-1 flex flex-col overflow-hidden z-1 relative">
                {/* Header */}
                <div className="px-8 py-5 border-b border-zinc-800/50 flex justify-between items-center bg-black/30 backdrop-blur-md">
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Records</h1>
                        <div className="text-xs text-zinc-400">
                            {!loading && !error && records.length > 0 && (
                                <span>{records.length} records found</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlass size={iconSize} color="#6b7280" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search records..." 
                                className="pl-10 pr-4 py-2 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-white w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent backdrop-blur-md"
                            />
                        </div>
                        <button className="p-2.5 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2">
                            <Plus size={iconSize} color="white" />
                            <span className="text-white text-sm">New Record</span>
                        </button>
                    </div>
                </div>
                
                {/* Main content - Records Area */}
                <div className="flex-1 overflow-y-auto px-8 py-6 bg-gradient-to-b from-black/20 to-transparent">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-zinc-300">Loading records...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-red-300 max-w-md mx-auto mt-10">
                            <p>Error: {error}</p>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="h-full flex items-center justify-center flex-col text-center">
                            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                                <span className="text-orange-500 text-3xl">📄</span>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-2">No records found</h3>
                            <p className="text-zinc-400 max-w-md">Create your first record to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {groupedRecords.map((group) => (
                                <div 
                                    key={group.id} 
                                    className="bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-zinc-700/30 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all overflow-hidden flex flex-col"
                                >
                                    <div className="p-5">                                        <div className="flex justify-between items-center mb-4">                                            <h3 className="text-white font-semibold text-lg">
                                                {activities[group.id] ? 
                                                    getActivityName(activities[group.id]) || `Activity ${safeSubstring(group.id, 0, 8)}...` : 
                                                    `Activity ${safeSubstring(group.id, 0, 8)}...`
                                                }
                                            </h3>
                                            <div className="bg-orange-500/10 text-orange-300 text-xs py-1 px-2 rounded-full">
                                                {group.count} record{group.count !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                          {/* Summary table header */}
                                        <div className="bg-black/30 rounded-t-lg p-3 grid grid-cols-5 gap-3 border-b border-zinc-700/30">
                                            <div className="text-zinc-400 text-sm font-medium">ID</div>
                                            <div className="text-zinc-400 text-sm font-medium">Completed</div>
                                            <div className="text-zinc-400 text-sm font-medium">Date</div>
                                            <div className="text-zinc-400 text-sm font-medium col-span-2">Details</div>
                                        </div>
                                        
                                        {/* Records summary (collapsed view) */}
                                        <div className="bg-black/20 rounded-b-lg">
                                            {group.records.slice(0, 3).map((record) => (
                                                <div key={record._id} className="p-3 grid grid-cols-5 gap-3 border-b border-zinc-800/20 last:border-0">
                                                    <div className="text-zinc-300 text-sm truncate">{typeof record._id === 'string' ? record._id.substring(0, 8) : record._id?.toString().substring(0, 8)}...</div>
                                                    <div className="text-zinc-300 text-sm">
                                                        {record.completed ? 
                                                            <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Yes</span> : 
                                                            <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">No</span>
                                                        }
                                                    </div>
                                                    <div className="text-zinc-300 text-sm">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Unknown'}</div>
                                                    <div className="text-zinc-300 text-sm truncate col-span-2">{record.details || record.task || '-'}</div>
                                                </div>
                                            ))}
                                            {group.records.length > 3 && !expandedCards[group.id] && (
                                                <div className="p-3 text-center text-zinc-400 text-sm italic">
                                                    + {group.records.length - 3} more records
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Toggle button for expanding/collapsing */}
                                        <button 
                                            onClick={() => toggleCardExpansion(group.id)} 
                                            className="mt-4 w-full p-2 bg-zinc-800/50 rounded-lg text-zinc-300 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-orange-500/20 transition-all"
                                        >
                                            {expandedCards[group.id] ? 'Collapse Details' : 'View All Records'}
                                            <ArrowsClockwise size={iconSize} color={iconColor} className={expandedCards[group.id] ? "transform rotate-180" : ""} />
                                        </button>
                                        
                                        {/* Expanded detailed view (Excel-like) */}
                                        {expandedCards[group.id] && (
                                            <div className="mt-4">                                                {/* Activity details if available */}
                                                {activities[group.id] && (
                                                    <div className="mb-4 p-4 bg-black/30 rounded-lg border border-zinc-700/30">
                                                        <h4 className="text-white text-md font-semibold mb-2">Activity Details</h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="text-zinc-400 text-sm">Name:</div>
                                                            <div className="text-zinc-300 text-sm">{getActivityName(activities[group.id]) || 'Unnamed Activity'}</div>
                                                            
                                                            {activities[group.id].description && (
                                                                <>
                                                                    <div className="text-zinc-400 text-sm">Description:</div>
                                                                    <div className="text-zinc-300 text-sm">{activities[group.id].description}</div>
                                                                </>
                                                            )}
                                                            
                                                            {activities[group.id].form && activities[group.id].form.description && (
                                                                <>
                                                                    <div className="text-zinc-400 text-sm">Form Description:</div>
                                                                    <div className="text-zinc-300 text-sm">{activities[group.id].form.description}</div>
                                                                </>
                                                            )}
                                                            
                                                            {activities[group.id].form && activities[group.id].form.type && (
                                                                <>
                                                                    <div className="text-zinc-400 text-sm">Type:</div>
                                                                    <div className="text-zinc-300 text-sm capitalize">{activities[group.id].form.type}</div>
                                                                </>
                                                            )}
                                                            
                                                            {activities[group.id].tags && activities[group.id].tags.length > 0 && (
                                                                <>
                                                                    <div className="text-zinc-400 text-sm">Days:</div>
                                                                    <div className="text-zinc-300 text-sm flex flex-wrap gap-1">
                                                                        {activities[group.id].tags.map(tag => (
                                                                            <span key={tag} className="bg-orange-500/10 text-orange-300 px-2 py-0.5 rounded-full text-xs">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                            
                                                            <div className="text-zinc-400 text-sm">ID:</div>
                                                            <div className="text-zinc-300 text-sm break-all">{group.id}</div>
                                                            
                                                            <div className="text-zinc-400 text-sm">Created:</div>
                                                            <div className="text-zinc-300 text-sm">
                                                                {activities[group.id].createdAt ? 
                                                                    new Date(activities[group.id].createdAt.$date?.$numberLong || activities[group.id].createdAt).toLocaleString() : 
                                                                    'Unknown date'
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">                                                        <thead>
                                                            <tr className="bg-black/40 text-left">
                                                                <th className="p-3 text-zinc-300 text-sm font-medium border-b border-zinc-700/30">ID</th>
                                                                <th className="p-3 text-zinc-300 text-sm font-medium border-b border-zinc-700/30">Completed</th>
                                                                <th className="p-3 text-zinc-300 text-sm font-medium border-b border-zinc-700/30">Date</th>
                                                                <th className="p-3 text-zinc-300 text-sm font-medium border-b border-zinc-700/30">Details</th>
                                                                <th className="p-3 text-zinc-300 text-sm font-medium border-b border-zinc-700/30">Task</th>
                                                                <th className="p-3 text-zinc-300 text-sm font-medium border-b border-zinc-700/30">Activity ID</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {group.records.map((record) => (
                                                                <tr key={record._id} className="border-b border-zinc-800/20 hover:bg-black/20">
                                                                    <td className="p-3 text-zinc-300 text-sm">{typeof record._id === 'string' ? record._id : record._id?.toString()}</td>
                                                                    <td className="p-3 text-zinc-300 text-sm">
                                                                        {record.completed ? 
                                                                            <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Yes</span> : 
                                                                            <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">No</span>
                                                                        }
                                                                    </td>
                                                                    <td className="p-3 text-zinc-300 text-sm">{record.createdAt ? new Date(record.createdAt).toLocaleString() : 'Unknown'}</td>
                                                                    <td className="p-3 text-zinc-300 text-sm">{record.details || '-'}</td>
                                                                    <td className="p-3 text-zinc-300 text-sm">{record.task || '-'}</td>
                                                                    <td className="p-3 text-zinc-300 text-sm">{record.activityId || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
