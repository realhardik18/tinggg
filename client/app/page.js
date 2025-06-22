'use client';

import Image from "next/image";
import { Lightning, CheckCircle, Clock, Plus, Calendar, Bell, ChartLine, Sparkle, MagnifyingGlass, CircleNotch } from "@phosphor-icons/react";

export default function Home() {
  const iconSize = 20;
  const iconColor = "#FF6B00"; // Orange accent color

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black overflow-hidden relative">
      {/* Background effects - with animation */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[25%] w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-[30%] left-[40%] w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        
        {/* Additional animated gradient elements */}
        <div className="absolute top-[60%] right-[15%] w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4.5s'}}></div>
        <div className="absolute top-[10%] left-[10%] w-56 h-56 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header */}
      <header className="py-6 px-8 flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/20 mr-3">
            T
          </div>
          <span className="text-xl font-bold text-white">Ting Ting</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">How it works</a>
          <a 
            href="/dashboard" 
            className="px-4 py-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50 text-white hover:bg-zinc-700/70 transition-colors"
          >
            Dashboard
          </a>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8 z-10 relative">
        {/* Hero Section */}
        <div className="text-center mb-16 relative max-w-4xl">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Stay Consistent <br/>
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 inline-block text-transparent bg-clip-text">Without the Effort</span>
          </h1>            <p className="text-xl sm:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Ting Ting turns your everyday language into smart reminders that actually work.
              No complex interfaces. Just say it, and we&apos;ll remember.
            </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 text-white font-medium text-lg flex items-center gap-2 w-full sm:w-auto hover:scale-105 duration-300"
              href="/dashboard"
            >
              <Sparkle size={iconSize} weight="fill" /> Get Started Free
            </a>
            <a
              className="px-8 py-4 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-lg hover:bg-zinc-800/60 transition-colors text-white font-medium text-lg w-full sm:w-auto text-center flex items-center justify-center gap-2 hover:border-orange-500/30 duration-300"
              href="#demo"
            >
              <CircleNotch size={iconSize} /> See How It Works
            </a>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-20">
          {/* Feature Card 1 */}
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px] hover:border-orange-500/30 hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-xl transform translate-x-5 -translate-y-5 group-hover:bg-orange-500/20 transition-all duration-500"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50 group-hover:border-orange-500/30 transition-colors">
                <Lightning size={24} color={iconColor} weight="fill" />
              </div>
              <h3 className="text-xl font-medium text-white">Just say it. Ting Ting remembers.</h3>
            </div>
            
            <div className="space-y-3 relative z-10 pl-4 border-l-2 border-zinc-800 group-hover:border-orange-500/30 transition-colors">
              <p className="text-lg text-zinc-300">&quot;Remind me to journal every night.&quot;</p>
              <p className="text-lg text-zinc-300">&quot;Check on my progress every 3 days.&quot;</p>
              <p className="text-lg text-zinc-300">&quot;Ask me about my reading habit every Sunday.&quot;</p>
            </div>
          </div>
          
          {/* Feature Card 2 */}
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px] hover:border-orange-500/30 hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-xl transform -translate-x-10 translate-y-10 group-hover:bg-orange-500/20 transition-all duration-500"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50 group-hover:border-orange-500/30 transition-colors">
                <CheckCircle size={24} color={iconColor} weight="fill" />
              </div>
              <h3 className="text-xl font-medium text-white">Agentic reminders that work</h3>
            </div>
            
            <p className="text-lg mb-4 text-zinc-300 relative z-10">
              Ting Ting leverages AI to act as your personal agent, taking initiative to help you stay on track with your goals.
            </p>
            
            <div className="flex items-center gap-3 relative z-10 pt-3 border-t border-zinc-800/30 group-hover:border-orange-500/20 transition-colors">
              <div className="w-10 h-10 bg-zinc-800/70 backdrop-blur-sm rounded-lg flex items-center justify-center border border-zinc-700/30 group-hover:border-orange-500/30 transition-colors">
                <Clock size={20} color={iconColor} weight="fill" />
              </div>
              <div>
                <p className="text-white font-medium">Intelligent timing</p>
                <p className="text-zinc-400 text-sm">Optimized for your routine</p>
              </div>
            </div>
          </div>
          
          {/* Feature Card 3 */}
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px] hover:border-orange-500/30 hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl transform -translate-x-10 -translate-y-10 group-hover:bg-orange-500/20 transition-all duration-500"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50 group-hover:border-orange-500/30 transition-colors">
                <ChartLine size={24} color={iconColor} weight="fill" />
              </div>
              <h3 className="text-xl font-medium text-white">Track your consistency</h3>
            </div>
            
            <p className="text-lg mb-4 text-zinc-300 relative z-10">
              Beautiful visualizations help you understand your habits and celebrate your progress over time.
            </p>
            
            <div className="flex items-center gap-3 relative z-10 pt-3 border-t border-zinc-800/30 group-hover:border-orange-500/20 transition-colors">
              <div className="w-10 h-10 bg-zinc-800/70 backdrop-blur-sm rounded-lg flex items-center justify-center border border-zinc-700/30 group-hover:border-orange-500/30 transition-colors">
                <Sparkle size={20} color={iconColor} weight="fill" />
              </div>
              <div>
                <p className="text-white font-medium">Motivating insights</p>
                <p className="text-zinc-400 text-sm">See your progress patterns</p>
              </div>
            </div>
          </div>
          
          {/* Feature Card 4 */}
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px] hover:border-orange-500/30 hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-orange-500/5 rounded-full blur-xl transform translate-x-10 translate-y-10 group-hover:bg-orange-500/20 transition-all duration-500"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-zinc-800/70 backdrop-blur-sm rounded-lg border border-zinc-700/50 group-hover:border-orange-500/30 transition-colors">
                <Calendar size={24} color={iconColor} weight="fill" />
              </div>
              <h3 className="text-xl font-medium text-white">Adaptive AI agent</h3>
            </div>
            
            <p className="text-lg mb-4 text-zinc-300 relative z-10">
              Unlike passive reminder apps, Ting Ting actively monitors your habits and takes initiative to help you succeed.
            </p>
            
            <div className="flex items-center gap-3 relative z-10 pt-3 border-t border-zinc-800/30 group-hover:border-orange-500/20 transition-colors">
              <div className="w-10 h-10 bg-zinc-800/70 backdrop-blur-sm rounded-lg flex items-center justify-center border border-zinc-700/30 group-hover:border-orange-500/30 transition-colors">
                <MagnifyingGlass size={20} color={iconColor} weight="fill" />
              </div>
              <div>
                <p className="text-white font-medium">Proactive assistance</p>
                <p className="text-zinc-400 text-sm">More than just reminders</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Demo Section */}
        <div id="demo" className="w-full max-w-5xl mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">See Ting Ting in Action</h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Creating reminders has never been this intuitive and effortless.
            </p>
          </div>
          
          <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
            
            {/* Simulated interface preview */}
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="bg-zinc-800/70 backdrop-blur-sm p-4 rounded-lg border border-zinc-700/50">
                  <p className="text-zinc-300 mb-2">You say:</p>
                  <p className="text-white text-lg">&quot;Remind me to meditate every morning at 7am&quot;</p>
                </div>
                
                <div className="bg-zinc-800/70 backdrop-blur-sm p-4 rounded-lg border border-zinc-700/50">
                  <p className="text-zinc-300 mb-2">Ting Ting creates:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Clock size={20} color={iconColor} weight="fill" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Daily Meditation</p>
                        <p className="text-zinc-400 text-sm">Every day at 7:00 AM</p>
                      </div>
                    </div>
                    <div className="pl-13 ml-5 border-l border-zinc-700 py-2">
                      <p className="text-zinc-400">Smart reminders with gentle notifications</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 bg-zinc-800/40 rounded-xl border border-zinc-700/30 p-4 h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-zinc-900/10 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-zinc-700/70 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-600/50">
                    <Bell size={32} color={iconColor} weight="fill" />
                  </div>
                  <p className="text-white font-medium text-lg mb-2">Time to meditate</p>
                  <p className="text-zinc-400">7:00 AM · Daily reminder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Agentic AI Section - Replacing Testimonials */}
        <div className="w-full max-w-5xl mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Truly Agentic Experience</h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Unlike traditional reminders, Ting Ting actively works on your behalf to help you build habits.
            </p>
          </div>
          
          <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-xl border border-zinc-800/50 shadow-xl relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px] hover:border-orange-500/30 hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:bg-orange-500/20 transition-all duration-500"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-zinc-800/50 backdrop-blur-sm p-5 rounded-lg border border-zinc-700/40 transition-all duration-300 hover:border-orange-500/30">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightning size={28} color={iconColor} weight="fill" />
                </div>
                <h3 className="text-white font-medium text-lg text-center mb-2">Proactive Assistance</h3>
                <p className="text-zinc-300 text-center">Takes the initiative to help you stay on track, instead of just passively reminding you.</p>
              </div>
              
              <div className="bg-zinc-800/50 backdrop-blur-sm p-5 rounded-lg border border-zinc-700/40 transition-all duration-300 hover:border-orange-500/30">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkle size={28} color={iconColor} weight="fill" />
                </div>
                <h3 className="text-white font-medium text-lg text-center mb-2">Adaptive Intelligence</h3>
                <p className="text-zinc-300 text-center">Learns from your patterns and adjusts its approach based on what works best for you.</p>
              </div>
              
              <div className="bg-zinc-800/50 backdrop-blur-sm p-5 rounded-lg border border-zinc-700/40 transition-all duration-300 hover:border-orange-500/30">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} color={iconColor} weight="fill" />
                </div>
                <h3 className="text-white font-medium text-lg text-center mb-2">Goal Alignment</h3>
                <p className="text-zinc-300 text-center">Understands your broader objectives and helps you make consistent progress toward them.</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800/30 text-center relative z-10">
              <p className="text-lg text-zinc-300">Ting Ting doesn&apos;t just remind you—it actively collaborates with you to achieve your goals.</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="w-full max-w-4xl mb-16">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 backdrop-blur-xl p-10 rounded-2xl border border-zinc-800/50 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Better Habits?</h2>
              <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-8">
                Start your journey to consistency today. No credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <a
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 text-white font-medium text-lg flex items-center gap-2 w-full sm:w-auto"
                  href="/dashboard"
                >
                  <Plus size={iconSize} /> Get Started Free
                </a>
                <a
                  className="px-8 py-4 bg-zinc-800/60 backdrop-blur-xl border border-zinc-700/50 rounded-lg hover:bg-zinc-700/60 transition-colors text-white font-medium text-lg w-full sm:w-auto text-center"
                  href="#"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features List */}
        <div id="how-it-works" className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full mb-16">
          {[
            { 
              title: "Easy Setup", 
              desc: "Start in seconds with natural language",
              icon: <Lightning size={24} color={iconColor} weight="fill" />
            },
            { 
              title: "Smart Reminders", 
              desc: "Get notifications when you need them most",
              icon: <Bell size={24} color={iconColor} weight="fill" />
            },
            { 
              title: "Daily Insights", 
              desc: "Track your progress with beautiful analytics",
              icon: <ChartLine size={24} color={iconColor} weight="fill" />
            }
          ].map((feature, i) => (
            <div key={i} className="bg-zinc-900/30 backdrop-blur-sm p-6 rounded-lg border border-zinc-800/40 transition-all duration-300 hover:translate-y-[-5px] hover:bg-zinc-900/40">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-white font-medium text-lg text-center mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="py-8 border-t border-zinc-800/50 relative z-10">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20 mr-2">
                T
              </div>
              <span className="text-lg font-bold text-white">Ting Ting</span>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">Support</a>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-zinc-800/60 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-800/60 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-800/60 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-zinc-800/30 text-center text-sm text-zinc-500">
            © 2024 Ting Ting. All rights reserved. <a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a> · <a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
