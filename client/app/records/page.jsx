'use client'
import Sidenav from "../components/Sidenav";

export default function Records() {
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
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Records</h1>
                </div>
                
                {/* Main content */}
                <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-xl border border-zinc-800/50 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Welcome to Records</h2>
                    <p className="text-zinc-300">This is the records page where you can manage and view your important information.</p>
                </div>
            </div>
        </div>
    )
}