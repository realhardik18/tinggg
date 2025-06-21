'use client'
import { useState, useRef, useEffect } from 'react';
import Sidenav from "../components/Sidenav";
import { PaperPlaneRight, Sparkle, User, Robot, Plus, MagnifyingGlass, Bell, TrashSimple, DotsThreeOutlineVertical, CircleNotch } from "@phosphor-icons/react";

export default function Chat(){
    const iconSize = 20;
    const iconColor = "#FF6B00"; // Orange accent color
      const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        // Add user message
        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        setMessages([...messages, userMessage]);
        setMessage('');
        
        // Show typing indicator
        setIsTyping(true);
        
        // Simulate bot response with delay
        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                text: "Hello!",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000);
    };
    
    const clearChat = () => {
        if (messages.length > 0 && confirm('Are you sure you want to clear all messages?')) {
            setMessages([]);
        }
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
            <div className="flex-1 flex flex-col overflow-hidden z-1 relative">
                {/* Chat Header */}
                <div className="px-8 py-5 border-b border-zinc-800/50 flex justify-between items-center bg-black/30 backdrop-blur-md">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                            <Robot size={24} color={iconColor} weight="fill" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Ting Ting Assistant</h1>
                            <div className="flex items-center text-xs text-zinc-400">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                Online
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlass size={iconSize} color="#6b7280" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search conversations..." 
                                className="pl-10 pr-4 py-2 bg-zinc-900/40 border border-zinc-800/50 rounded-lg text-white w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent backdrop-blur-md"
                            />
                        </div>
                        <button 
                            onClick={clearChat}
                            className="p-2.5 bg-zinc-900/40 rounded-lg hover:bg-zinc-800/60 transition-colors backdrop-blur-md border border-zinc-800/50 hover:text-orange-500"
                            title="Clear conversation"
                        >
                            <TrashSimple size={iconSize} color="white" />
                        </button>
                        <button className="p-2.5 bg-zinc-900/40 rounded-lg hover:bg-zinc-800/60 transition-colors backdrop-blur-md border border-zinc-800/50">
                            <Bell size={iconSize} color="white" />
                        </button>
                        <button className="p-2.5 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-orange-500/20">
                            <Plus size={iconSize} color="white" />
                        </button>
                    </div>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 bg-gradient-to-b from-black/20 to-transparent">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center flex-col text-center">
                            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                                <Sparkle size={42} color={iconColor} weight="fill" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-2">Start a conversation</h3>
                            <p className="text-zinc-400 max-w-md">Type a message below to begin chatting with Ting Ting</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[60%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} group`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            msg.sender === 'user' 
                                                ? 'bg-orange-500/20 ml-3' 
                                                : 'bg-zinc-800 mr-3'
                                        }`}>
                                            {msg.sender === 'user' 
                                                ? <User size={16} color={iconColor} weight="fill" /> 
                                                : <Robot size={16} color={iconColor} weight="fill" />
                                            }
                                        </div>
                                        <div>
                                            <div className={`py-3 px-4 rounded-2xl ${
                                                msg.sender === 'user' 
                                                    ? 'bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-tr-none text-white border border-orange-500/20' 
                                                    : 'bg-zinc-800/70 rounded-tl-none text-zinc-100 border border-zinc-700/30'
                                            } shadow-sm`}>
                                                {msg.text}
                                            </div>
                                            <div className={`text-xs mt-1 text-zinc-500 ${
                                                msg.sender === 'user' ? 'text-right mr-3' : 'ml-3'
                                            }`}>
                                                {msg.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex flex-row max-w-[60%]">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-zinc-800 mr-3">
                                            <Robot size={16} color={iconColor} weight="fill" />
                                        </div>
                                        <div className="py-3 px-4 rounded-2xl bg-zinc-800/70 rounded-tl-none text-zinc-100 border border-zinc-700/30 shadow-sm">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse"></div>
                                                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse delay-75"></div>
                                                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse delay-150"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Invisible element for auto-scrolling */}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
                
                {/* Message Input */}
                <div className="px-8 py-4 border-t border-zinc-800/30 bg-black/30 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent placeholder-zinc-500"
                        />
                        <button 
                            type="submit"
                            disabled={!message.trim()}
                            className="p-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:opacity-90 transition-all shadow-md shadow-orange-500/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PaperPlaneRight size={20} color="white" weight="fill" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}