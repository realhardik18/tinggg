'use client'
import Sidenav from "../components/Sidenav";
import { MagnifyingGlass, Bell, Plus, Calendar, Clock, Tag, FunnelSimple, ArrowDown, ArrowUp, Sparkle, X, PencilSimple, Trash } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

// Define a simple fade-in animation
const fadeInAnimation = {
    '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(-10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
    },
    'animation': 'fadeIn 0.3s ease-out forwards'
};

export default function Activities() {
    // Get Gemini API key from environment variable
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const iconSize = 20;
    const iconColor = "#FF6B00"; // Orange accent color
    
    // Activities state
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    
    // Form states
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('one_time');
    const [form, setForm] = useState({
        name: '',
        description: '',
        type: 'one_time',
        date: '',
        time: '',
        days: [],
        recurringTimes: {},
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentActivityId, setCurrentActivityId] = useState(null);
    
    // AI states
    const [showAiPrompt, setShowAiPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isProcessingAi, setIsProcessingAi] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Check for API key on component mount
    useEffect(() => {
        if (!GEMINI_API_KEY) {
            console.warn("Gemini API key not found. Set the NEXT_PUBLIC_GEMINI_API_KEY environment variable for AI functionality.");
        }
        
        // Fetch activities when component mounts
        fetchActivities();
    }, []);
    
    // Fetch activities from the API
    const fetchActivities = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/activities?page=${page}&limit=10&userId=default_user`);
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            const data = await response.json();
            setActivities(data.activities);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError('Failed to load activities. Please try again later.');
            showToast('Failed to load activities', 3000, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Load more activities
    const loadMoreActivities = () => {
        if (pagination.page < pagination.pages) {
            fetchActivities(pagination.page + 1);
        }
    };
    
    // Create a new activity
    const createActivity = async (activityData) => {
        try {
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(activityData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create activity');
            }
            
            const data = await response.json();
            showToast('Activity created successfully!', 3000);
            
            // Refresh activities
            fetchActivities();
            return data.activity;
            
        } catch (err) {
            console.error('Error creating activity:', err);
            showToast('Failed to create activity', 3000, 'error');
            throw err;
        }
    };
    
    // Update an existing activity
    const updateActivity = async (id, activityData) => {
        try {
            const response = await fetch('/api/activities', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: id, ...activityData }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update activity');
            }
            
            const data = await response.json();
            showToast('Activity updated successfully!', 3000);
            
            // Refresh activities
            fetchActivities();
            return data.activity;
            
        } catch (err) {
            console.error('Error updating activity:', err);
            showToast('Failed to update activity', 3000, 'error');
            throw err;
        }
    };
    
    // Delete an activity
    const deleteActivity = async (id) => {
        if (!confirm('Are you sure you want to delete this activity?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/activities?id=${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete activity');
            }
            
            showToast('Activity deleted successfully!', 3000);
            
            // Refresh activities
            fetchActivities();
            
        } catch (err) {
            console.error('Error deleting activity:', err);
            showToast('Failed to delete activity', 3000, 'error');
        }
    };
    
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
    };    // Handle form field changes
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'type') {
            setFormType(value);
            setForm({ ...form, type: value, days: [], recurringTimes: {} });
        } else if (name === 'days') {
            let newDays = form.days.includes(value)
                ? form.days.filter(day => day !== value)
                : [...form.days, value];
            setForm({ ...form, days: newDays });
        } else if (name.startsWith('recurringTime_')) {
            const day = name.split('_')[1];
            setForm({ ...form, recurringTimes: { ...form.recurringTimes, [day]: value } });
        } else if (name === 'allDaysTime') {
            // Apply the same time to all selected days
            const updatedTimes = {};
            form.days.forEach(day => {
                updatedTimes[day] = value;
            });
            setForm({ ...form, recurringTimes: updatedTimes });
        } else {
            setForm({ ...form, [name]: value });
        }
    };    // Process AI prompt to generate activity details
    const processAiPrompt = async () => {
        if (!aiPrompt.trim()) return;
        
        setIsProcessingAi(true);
        
        try {
            // Check if API key is available
            if (!GEMINI_API_KEY) {
                console.error("Gemini API key is not set. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
                throw new Error("API key not found");
            }            // Define the prompt
            const geminiPrompt = `
            You are an AI assistant helping to create personalized calendar activities and reminders.
            
            Parse the following user input and extract the following information:
            1. Activity name (a short, clear title)
            2. Description (make this personalized, motivational and directly addressing the user with "you")
            3. Whether it's a one-time or recurring activity
            4. If one-time, the date (in YYYY-MM-DD format) and time (in 24-hour HH:MM format)
            5. If recurring, which days of the week (Mon, Tue, Wed, Thu, Fri, Sat, Sun) and time(s)
            
            User input: "${aiPrompt}"
            
            Important date/time guidelines:
            - For specific dates mentioned, use those
            - For "today", use ${getTodayDate()}, for "tomorrow", use ${getTomorrowDate()}
            - For vague time periods like "morning", use 08:00, "afternoon" use 14:00, "evening" use 19:00
            - If no date is specified for a one-time event, use tomorrow's date: ${getTomorrowDate()}
            - For specific dates in the format MM/DD or MM-DD, convert to proper YYYY-MM-DD format using the current year
            - For times, convert all times to 24-hour format
            
            For the description:
            - Make it personal and directly address the user ("you" not "I")            
            - Keep it concise but helpful (10-15 words max)            
            
            Respond in the following JSON format only:
            {
              "name": "Activity title",
              "description": "description addressing the user directly",
              "type": "one_time OR recurring",
              "date": "YYYY-MM-DD (if one-time)",
              "time": "HH:MM (if one-time)",
              "days": ["Mon", "Wed", "Fri"] (if recurring),
              "recurringTimes": {"Mon": "08:00", "Wed": "09:00", "Fri": "08:00"} (if recurring)
            }
            
            Don't include any explanations, just the JSON.
            `;
              // Make API request to Gemini
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: geminiPrompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.2, // Low temperature for more deterministic outputs
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const responseData = await response.json();
            
            // Extract the text from the response
            const generatedText = responseData.candidates[0]?.content?.parts[0]?.text;
            
            if (!generatedText) {
                throw new Error("No text generated from API");
            }
            
            // Extract JSON from the response
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            let activityData;
            
            if (jsonMatch) {
                try {
                    activityData = JSON.parse(jsonMatch[0]);
                } catch (parseError) {
                    console.error("Error parsing JSON:", parseError);
                    throw new Error("Failed to parse generated JSON");
                }
            } else {
                throw new Error("No valid JSON found in response");
            }
            
            // Update form with AI-generated data
            setForm(prev => ({
                ...prev,
                name: activityData.name || '',
                description: activityData.description || '',
                type: activityData.type || 'one_time',
                date: activityData.type === 'one_time' ? activityData.date || '' : '',
                time: activityData.type === 'one_time' ? activityData.time || '' : '',
                days: activityData.type === 'recurring' ? activityData.days || [] : [],
                recurringTimes: activityData.type === 'recurring' ? activityData.recurringTimes || {} : {},
            }));
            
            // Update form type
            setFormType(activityData.type || 'one_time');
              // Hide AI prompt
            setShowAiPrompt(false);
            setAiPrompt('');
            
            // Show success toast
            showToast('Smart Fill completed! Review and save your activity.', 3000);
        } catch (error) {
            console.error("Error processing AI prompt:", error);
            // Fallback to mock implementation if API fails
            try {
                console.log("Falling back to mock implementation");
                const mockResponse = mockGeminiProcess(aiPrompt);
                
                // Update form with mock data
                setForm(prev => ({
                    ...prev,
                    name: mockResponse.name,
                    description: mockResponse.description,
                    type: mockResponse.type,
                    date: mockResponse.type === 'one_time' ? mockResponse.date : '',
                    time: mockResponse.type === 'one_time' ? mockResponse.time : '',
                    days: mockResponse.type === 'recurring' ? mockResponse.days : [],
                    recurringTimes: mockResponse.type === 'recurring' ? mockResponse.recurringTimes : {},
                }));
                
                // Update form type
                setFormType(mockResponse.type);
                
                // Hide AI prompt
                setShowAiPrompt(false);
                setAiPrompt('');
            } catch (mockError) {
                console.error("Mock processing also failed:", mockError);
                alert("Failed to process your request. Please try again or fill out the form manually.");
            }
        } finally {
            setIsProcessingAi(false);
        }
    };
    
    // Mock function to simulate Gemini API processing
    const mockGeminiProcess = (prompt) => {
        // This function simulates what Gemini API would return
        // In a real implementation, you'd call the actual API
        
        const promptLower = prompt.toLowerCase();
        
        // Default response structure
        let response = {
            name: '',
            description: '',
            type: 'one_time',
            date: getTomorrowDate(),
            time: '09:00',
            days: [],
            recurringTimes: {}
        };
        
        // Extract activity name (use the first sentence or phrase)
        response.name = prompt.split(/[.?!,]/).filter(p => p.trim())[0].trim();
        
        // Determine if recurring based on keywords
        if (promptLower.includes('everyday') || 
            promptLower.includes('every day') || 
            promptLower.includes('weekly') || 
            promptLower.includes('daily') ||
            promptLower.includes('recurring') ||
            promptLower.includes('every week') ||
            promptLower.includes('each week')) {
            
            response.type = 'recurring';
            
            // Default to weekdays
            response.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            
            // Check for specific days
            const dayMapping = {
                'monday': 'Mon', 'tuesday': 'Tue', 'wednesday': 'Wed', 
                'thursday': 'Thu', 'friday': 'Fri', 'saturday': 'Sat', 'sunday': 'Sun'
            };
            
            Object.entries(dayMapping).forEach(([dayName, shortName]) => {
                if (promptLower.includes(dayName)) {
                    if (!response.days.includes(shortName)) {
                        response.days.push(shortName);
                    }
                }
            });
            
            // If it mentions weekend, add weekend days
            if (promptLower.includes('weekend')) {
                if (!response.days.includes('Sat')) response.days.push('Sat');
                if (!response.days.includes('Sun')) response.days.push('Sun');
            }
            
            // If it explicitly mentions all days or every day
            if (promptLower.includes('every day') || promptLower.includes('all days') || promptLower.includes('everyday')) {
                response.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            }
            
            // Set default time for all selected days
            let defaultTime = '09:00';
            
            // Try to extract time
            const timeRegex = /(\d{1,2}):?(\d{2})?\s*(am|pm)?/i;
            const timeMatch = promptLower.match(timeRegex);
            
            if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = timeMatch[2] ? timeMatch[2] : '00';
                const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
                
                // Convert to 24-hour format
                if (ampm === 'pm' && hours < 12) {
                    hours += 12;
                } else if (ampm === 'am' && hours === 12) {
                    hours = 0;
                }
                
                defaultTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
            }
            
            // Apply time to all selected days
            const times = {};
            response.days.forEach(day => {
                times[day] = defaultTime;
            });
            
            response.recurringTimes = times;
        } else {
            // One-time activity
            response.type = 'one_time';
              // Try to extract date
            const dateRegex = /(today|tomorrow|next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4})|))/i;
            const dateMatch = promptLower.match(dateRegex);
            
            if (dateMatch) {
                if (dateMatch[1].toLowerCase() === 'today') {
                    response.date = getTodayDate();
                } else if (dateMatch[1].toLowerCase() === 'tomorrow') {
                    response.date = getTomorrowDate();
                } else if (dateMatch[2]) {
                    // Handle "next Monday", etc.
                    response.date = getNextDayDate(dateMatch[2]);
                } else if (dateMatch[3] && dateMatch[4]) {
                    // Handle MM/DD or MM-DD format
                    const month = parseInt(dateMatch[3]);
                    const day = parseInt(dateMatch[4]);
                    const year = dateMatch[5] ? parseInt(dateMatch[5]) : new Date().getFullYear();
                    
                    // Create date in YYYY-MM-DD format
                    response.date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                }
            }
            
            // Try to extract time
            const timeRegex = /(\d{1,2}):?(\d{2})?\s*(am|pm)?/i;
            const timeMatch = promptLower.match(timeRegex);
            
            if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = timeMatch[2] ? timeMatch[2] : '00';
                const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
                
                // Convert to 24-hour format
                if (ampm === 'pm' && hours < 12) {
                    hours += 12;
                } else if (ampm === 'am' && hours === 12) {
                    hours = 0;
                }
                
                response.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
            }
        }
        
        // Extract description (everything after the first sentence)
        const firstSentenceEnd = prompt.search(/[.?!,]/);
        if (firstSentenceEnd !== -1 && firstSentenceEnd < prompt.length - 1) {
            response.description = prompt.substring(firstSentenceEnd + 1).trim();
        }
        
        return response;
    };
    
    // Helper functions for date formatting
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };
      const getNextDayDate = (dayName) => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        const targetDay = days.indexOf(dayName.toLowerCase());
        const currentDay = today.getDay();
        
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7;
        
        const result = new Date();
        result.setDate(today.getDate() + daysToAdd);
        return result.toISOString().split('T')[0];
    };
      // Function to show toast notifications
    const showToast = (message, duration = 3000, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, duration);
    };
    
    // Open edit form
    const openEditForm = (activity) => {
        // Extract data from the activity for the form
        const isRecurring = activity.metadata?.method === 'recurring';
        
        let formData = {
            name: '',
            description: '',
            type: isRecurring ? 'recurring' : 'one_time',
            date: '',
            time: '',
            days: [],
            recurringTimes: {},
        };
        
        // Extract name and description
        const descParts = activity.description.split(': ');
        formData.name = descParts[0];
        formData.description = descParts.length > 1 ? descParts.slice(1).join(': ') : '';
        
        // Extract date and time for one-time activities
        if (!isRecurring && activity.timestamp) {
            const date = new Date(activity.timestamp);
            formData.date = date.toISOString().split('T')[0];
            formData.time = date.toTimeString().substring(0, 5);
        }
        
        // Extract days and times for recurring activities
        if (isRecurring && Array.isArray(activity.tags)) {
            formData.days = activity.tags.filter(tag => daysOfWeek.includes(tag));
            
            // Extract times from metadata if available
            if (activity.metadata?.recurringTimes) {
                formData.recurringTimes = activity.metadata.recurringTimes;
            }
        }
        
        // Set form data
        setForm(formData);
        setFormType(formData.type);
        setIsEditing(true);
        setCurrentActivityId(activity._id);
        setShowForm(true);
    };
    
    // Reset form
    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            type: 'one_time',
            date: '',
            time: '',
            days: [],
            recurringTimes: {},
        });
        setFormType('one_time');
        setIsEditing(false);
        setCurrentActivityId(null);
        setShowForm(false);
    };
    
    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Create timestamp string for one-time activities
        const timestamp = form.type === 'one_time' ? `${form.date}T${form.time}:00` : '';
        
        // Create activity object
        const activityData = {
            user_id: 'default_user',
            type: form.type === 'one_time' ? 'manual_entry' : 'reminder_sent',
            timestamp: timestamp,
            description: form.name + (form.description ? ': ' + form.description : ''),
            tags: form.type === 'recurring' ? form.days : [form.type],
            metadata: {
                method: form.type === 'recurring' ? 'recurring' : 'one_time',
                triggered_by: 'user',
                recurringTimes: form.type === 'recurring' ? form.recurringTimes : {},
                next_trigger: form.type === 'recurring' ? 
                    Object.keys(form.recurringTimes).length > 0 ? 
                        `next_${Object.keys(form.recurringTimes)[0].toLowerCase()}` : null 
                    : null
            }
        };
        
        try {
            if (isEditing && currentActivityId) {
                // Update existing activity
                await updateActivity(currentActivityId, activityData);
            } else {
                // Create new activity
                await createActivity(activityData);
            }
            
            // Reset form and hide modal
            resetForm();
        } catch (err) {
            console.error('Error saving activity:', err);
            // Toast notification is already shown in create/update functions
        }
    };
      return(<div className="flex h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
                <div className="absolute top-[-15%] right-[-5%] w-[30rem] h-[30rem] bg-orange-500/10 rounded-full blur-[100px] opacity-70"></div>
                <div className="absolute bottom-[-20%] left-[15%] w-[35rem] h-[35rem] bg-orange-500/5 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute top-[20%] left-[40%] w-[25rem] h-[25rem] bg-zinc-800/20 rounded-full blur-[80px] opacity-70"></div>
                <div className="absolute top-[60%] right-[15%] w-[20rem] h-[20rem] bg-orange-600/5 rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0"></div>
            </div>
            
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 animate-fade-in">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-lg shadow-lg shadow-purple-900/20 flex items-center">
                        <Sparkle size={20} weight="fill" className="mr-2" />
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
            
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
                                    disabled
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
                    <button 
                        className="flex items-center justify-center py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 text-white font-medium"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={20} className="mr-2" weight="bold" />
                        Add New Activity
                    </button>
                </div>                {/* Activity Form Modal */}                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                        <form onSubmit={handleFormSubmit} className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 rounded-2xl shadow-2xl border border-zinc-800/70 w-full max-w-2xl space-y-7 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full -ml-10 -mb-10 pointer-events-none"></div>
                            
                            {/* Close button */}
                            <button 
                                type="button" 
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800/50 z-10"
                                onClick={() => setShowForm(false)}
                            >
                                &times;
                            </button>                              {/* Header */}
                            <div className="mb-2 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {isEditing ? 'Edit Activity' : 'Create Activity'}
                                    </h2>
                                    <p className="text-zinc-400 text-sm">
                                        {isEditing ? 'Update your activity details' : 'Set up a new activity or reminder'}
                                    </p>
                                </div>
                                {!isEditing && (
                                    <button 
                                        type="button"
                                        onClick={() => setShowAiPrompt(true)}
                                        className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                        title="AI Smart Fill"
                                    >
                                        <Sparkle size={16} weight="fill" />
                                        <span className="text-sm font-medium">Smart Fill</span>
                                    </button>
                                )}
                            </div>{/* AI Prompt Modal */}
                            {showAiPrompt && (
                                <div className="bg-gradient-to-b from-indigo-900/70 to-purple-900/70 -mx-8 -mt-7 mb-5 p-5 pt-6 rounded-t-xl border-b border-indigo-500/30 relative">
                                    <button 
                                        type="button" 
                                        className="absolute top-3 right-3 text-indigo-300 hover:text-white transition-colors" 
                                        onClick={() => {
                                            setShowAiPrompt(false);
                                            setAiPrompt('');
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Sparkle size={18} weight="fill" className="text-indigo-300" />
                                                Describe your activity
                                            </h3>
                                        </div>
                                        
                                        <div className="relative">
                                            <textarea 
                                                value={aiPrompt} 
                                                onChange={(e) => setAiPrompt(e.target.value)} 
                                                placeholder="E.g. 'Remind me to go for a run every Monday, Wednesday and Friday at 7am' or 'Doctor's appointment next Thursday at 2pm'"
                                                className="w-full px-4 py-3 rounded-lg bg-indigo-950/60 text-white border border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all min-h-[80px] resize-none" 
                                                disabled={isProcessingAi}
                                            />
                                        </div>
                                        
                                        <div className="flex justify-end">
                                            <button 
                                                type="button"
                                                onClick={processAiPrompt}
                                                disabled={isProcessingAi || !aiPrompt.trim()}
                                                className={`py-2 px-4 rounded-lg text-white font-medium flex items-center gap-2 ${
                                                    isProcessingAi || !aiPrompt.trim() 
                                                        ? 'bg-indigo-700/50 text-indigo-300/70 cursor-not-allowed' 
                                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-md'
                                                }`}
                                            >
                                                {isProcessingAi ? (
                                                    <>
                                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkle size={16} weight="fill" />
                                                        Generate
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-5">
                                {/* Task Name */}
                                <div className="group">
                                    <label className="block text-zinc-300 mb-1.5 text-sm font-medium">Task Name</label>
                                    <div className="relative">
                                        <input 
                                            name="name" 
                                            value={form.name} 
                                            onChange={handleFormChange} 
                                            required 
                                            placeholder="What do you want to track?"
                                            className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all" 
                                        />
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <div>
                                    <label className="block text-zinc-300 mb-1.5 text-sm font-medium">Description</label>
                                    <textarea 
                                        name="description" 
                                        value={form.description} 
                                        onChange={handleFormChange}
                                        placeholder="Add some details (optional)"
                                        className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all min-h-[80px] resize-none" 
                                    />
                                </div>
                                
                                {/* Activity Type */}
                                <div>
                                    <label className="block text-zinc-300 mb-2 text-sm font-medium">Activity Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label 
                                            className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all ${
                                                formType === 'one_time' 
                                                ? 'bg-orange-500/20 border-orange-500/50 text-white' 
                                                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="type" 
                                                value="one_time" 
                                                checked={formType === 'one_time'} 
                                                onChange={handleFormChange} 
                                                className="sr-only" 
                                            />
                                            <Calendar size={18} weight={formType === 'one_time' ? 'fill' : 'regular'} />
                                            <span>One Time</span>
                                        </label>
                                        <label 
                                            className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all ${
                                                formType === 'recurring' 
                                                ? 'bg-orange-500/20 border-orange-500/50 text-white' 
                                                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="type" 
                                                value="recurring" 
                                                checked={formType === 'recurring'} 
                                                onChange={handleFormChange} 
                                                className="sr-only" 
                                            />
                                            <ArrowDown size={18} weight={formType === 'recurring' ? 'fill' : 'regular'} />
                                            <span>Recurring</span>
                                        </label>
                                    </div>
                                </div>
                                
                                {/* One Time Fields */}
                                {formType === 'one_time' && (
                                    <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-zinc-300 mb-1.5 text-sm font-medium">Date</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Calendar size={16} color="#FF6B00" />
                                                    </div>
                                                    <input 
                                                        type="date" 
                                                        name="date" 
                                                        value={form.date} 
                                                        onChange={handleFormChange} 
                                                        required 
                                                        className="pl-10 w-full px-3 py-2.5 rounded-lg bg-zinc-900/80 text-white border border-zinc-700/70 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all" 
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-zinc-300 mb-1.5 text-sm font-medium">Time</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Clock size={16} color="#FF6B00" />
                                                    </div>
                                                    <input 
                                                        type="time" 
                                                        name="time" 
                                                        value={form.time} 
                                                        onChange={handleFormChange} 
                                                        required 
                                                        className="pl-10 w-full px-3 py-2.5 rounded-lg bg-zinc-900/80 text-white border border-zinc-700/70 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                  {/* Recurring Fields */}
                                {formType === 'recurring' && (
                                    <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 space-y-4">
                                        <div>
                                            <label className="block text-zinc-300 mb-2 text-sm font-medium">Select Days</label>
                                            <div className="flex flex-wrap gap-2">
                                                {daysOfWeek.map(day => (
                                                    <label 
                                                        key={day} 
                                                        className={`
                                                            px-3 py-2 rounded-lg cursor-pointer border transition-all
                                                            ${form.days.includes(day) 
                                                                ? 'bg-orange-500/30 text-white border-orange-500/60 shadow-lg shadow-orange-500/10' 
                                                                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
                                                            }
                                                        `}
                                                    >
                                                        <input 
                                                            type="checkbox" 
                                                            name="days" 
                                                            value={day} 
                                                            checked={form.days.includes(day)} 
                                                            onChange={handleFormChange} 
                                                            className="sr-only" 
                                                        />
                                                        {day}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {form.days.length > 0 && (
                                            <div className="space-y-3 pt-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-zinc-300 text-sm font-medium">Set Times</label>
                                                    
                                                    {form.days.length > 1 && (
                                                        <div className="bg-zinc-900/60 rounded-lg p-2 flex items-center space-x-3 border border-zinc-800/70">
                                                            <label className="text-xs text-zinc-300 whitespace-nowrap">Same time for all days:</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                                    <Clock size={12} color="#FF6B00" />
                                                                </div>
                                                                <input 
                                                                    type="time" 
                                                                    name="allDaysTime" 
                                                                    onChange={handleFormChange} 
                                                                    className="pl-7 py-1 rounded-md bg-zinc-950/90 text-white border border-zinc-700/70 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-xs w-24" 
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {form.days.map(day => (
                                                        <div key={day} className="flex items-center gap-3 bg-zinc-900/40 p-2 rounded-lg">
                                                            <span className="text-orange-500 font-medium w-10">{day}</span>
                                                            <div className="relative flex-1">
                                                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                                    <Clock size={14} color="#FF6B00" />
                                                                </div>
                                                                <input 
                                                                    type="time" 
                                                                    name={`recurringTime_${day}`} 
                                                                    value={form.recurringTimes[day] || ''} 
                                                                    onChange={handleFormChange} 
                                                                    required 
                                                                    className="pl-7 w-full py-1.5 rounded-md bg-zinc-950/90 text-white border border-zinc-700/70 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-sm" 
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 px-4 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg text-white font-semibold hover:from-orange-500 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/20"
                                >
                                    Save Activity
                                </button>
                            </div>
                        </form>
                    </div>
                )}                {/* Activities table-like cards */}
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
                        <div className="col-span-2">Tags</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    
                    {/* Loading state */}
                    {isLoading ? (
                        <div className="p-10 text-center text-zinc-400">
                            <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full inline-block mb-2"></div>
                            <p>Loading activities...</p>
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-400">
                            <p>{error}</p>
                            <button 
                                onClick={() => fetchActivities()}
                                className="mt-3 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="p-10 text-center text-zinc-400 text-lg">
                            No activities found. Create your first one!
                        </div>
                    ) : (
                        activities.map((activity, index) => (
                            <div 
                                key={activity._id} 
                                className={`grid grid-cols-12 gap-4 p-5 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors ${index % 2 === 0 ? 'bg-black/10' : ''}`}
                            >
                                <div className="col-span-3 flex items-start">
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">
                                            {activity.timestamp ? formatDate(activity.timestamp) : '-'}
                                        </span>
                                        <span className="text-zinc-500 text-xs flex items-center mt-1">
                                            <Clock size={12} className="mr-1" /> 
                                            {activity.metadata?.method || '-'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="col-span-4">
                                    <p className="text-white">{activity.description}</p>
                                    {activity.metadata?.response && (
                                        <p className="text-zinc-400 text-sm mt-1 italic">"{activity.metadata.response}"</p>
                                    )}
                                </div>
                                
                                <div className="col-span-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.type)}`}>
                                        {formatType(activity.type)}
                                    </span>
                                </div>
                                
                                <div className="col-span-2 flex flex-wrap gap-2">
                                    {activity.tags && activity.tags.map((tag, idx) => (
                                        <span 
                                            key={idx} 
                                            className="bg-zinc-800/50 text-zinc-300 text-xs px-2 py-1 rounded-full flex items-center"
                                        >
                                            <Tag size={10} className="mr-1 text-orange-500" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="col-span-1 flex items-center justify-end space-x-2">
                                    <button 
                                        onClick={() => openEditForm(activity)}
                                        className="p-2 bg-zinc-800/70 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors"
                                        title="Edit Activity"
                                    >
                                        <PencilSimple size={16} />
                                    </button>
                                    <button 
                                        onClick={() => deleteActivity(activity._id)}
                                        className="p-2 bg-zinc-800/70 hover:bg-red-900/70 rounded-lg text-zinc-300 hover:text-red-300 transition-colors"
                                        title="Delete Activity"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {/* Load more button (shown if there are more pages) */}
                {!isLoading && activities.length > 0 && pagination.page < pagination.pages && (
                    <div className="flex justify-center">
                        <button 
                            onClick={loadMoreActivities}
                            className="py-3 px-6 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors text-sm flex items-center justify-center"
                        >
                            Load More Activities
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}