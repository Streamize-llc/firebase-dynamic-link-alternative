"use client"

import { Button } from "@/components/ui/button";
import { Database, Shield, Link2, Smartphone, Code2, Clock, Zap, CheckCircle2, Rocket } from "lucide-react";
import { useSupabase } from "@/utils/supabase/provider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { supabase, user } = useSupabase();
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Login button clicked');
    console.log('Supabase instance:', supabase);
    console.log('Current origin:', window.location.origin);
    console.log('Redirect URL:', `${window.location.origin}/callback`);
    
    if (!supabase) {
      console.error('Supabase client is not initialized');
      alert('Supabase client is not initialized. Please check console for details.');
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback`,
          scopes: 'profile email'
        },
      });
      
      if (error) {
        console.error('Login error:', error);
        alert(`Login error: ${error.message}`);
      } else {
        console.log('Login successful, redirecting...', data);
        console.log('OAuth URL:', data?.url);
        // If no redirect happens, manually open the URL
        if (data?.url) {
          window.location.href = data.url;
        }
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      alert(`Unexpected error: ${err}`);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard/project');
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-gray-800/30 bg-gray-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <Link2 className="h-4 w-4 text-gray-300" />
              </div>
              <span className="text-xl font-semibold text-gray-100">DEPL</span>
              <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs font-medium rounded border border-gray-700/50">
                LINK
              </span>
            </div>
            <div className="flex space-x-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-gray-200 text-sm"
                    onClick={() => router.push('/dashboard/project')}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm border border-gray-600"
                    onClick={async () => {
                      await supabase?.auth.signOut();
                      router.refresh();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-gray-200 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Login button clicked');
                      handleLogin();
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm border border-gray-600"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Free trial button clicked');
                      handleGetStarted();
                    }}
                  >
                    Start Free
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Full Height */}
      <section className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center">
        {/* Professional background animations */}
        <div className="absolute inset-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" 
               style={{
                 backgroundImage: `linear-gradient(rgba(156,163,175,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156,163,175,0.1) 1px, transparent 1px)`,
                 backgroundSize: '60px 60px'
               }}>
          </div>
          
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-8xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <div>
                <h1 className="text-6xl font-light text-gray-100 mb-8 leading-tight">
                  <span className="text-gray-400 font-normal">
                    Firebase Dynamic Links
                  </span>
                  <br />
                  Alternative
                </h1>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
                  Create smart deep links for iOS and Android apps with
                  real-time analytics to optimize mobile user experience
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button 
                    size="lg" 
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-normal px-8 border border-gray-700"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Start analysis button clicked');
                      handleGetStarted();
                    }}
                  >
                    Create Deep Links
                    <Link2 className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="ghost" 
                    className="text-gray-400 hover:text-gray-200 border border-gray-700/50 hover:border-gray-600"
                    onClick={() => router.push('/dashboard/project/docs')}
                  >
                    <Code2 className="mr-2 h-4 w-4" />
                    API Docs
                  </Button>
                </div>
                
                {/* Minimal stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800/50">
                  <div>
                    <div className="text-2xl font-light text-gray-200">50ms</div>
                    <div className="text-sm text-gray-500 mt-1">Redirect Speed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-200">99.9%</div>
                    <div className="text-sm text-gray-500 mt-1">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-200">Unlimited</div>
                    <div className="text-sm text-gray-500 mt-1">Links</div>
                  </div>
                </div>
              </div>

              {/* Right - Firebase to Depl Transformation */}
              <div className="relativeb">
                <div className="relative h-[500px] flex items-center justify-center overflow-visible bg-gray-950 rounded-xl">
                  {/* Subtle glow effects */}
                  <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 w-40 h-40 bg-purple-500/10 blur-3xl"></div>
                  <div className="absolute bottom-[30%] left-[20%] w-32 h-32 bg-gray-400/5 blur-3xl"></div>
                  <div className="absolute bottom-[30%] right-[20%] w-32 h-32 bg-blue-500/5 blur-3xl"></div>

                  {/* SVG for connection lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 450" style={{ zIndex: 10 }}>
                    {/* Fancy gradients */}
                    <defs>
                      <linearGradient id="fancy-gradient-ios" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(156, 163, 175, 0)">
                          <animate attributeName="stop-color" values="rgba(156, 163, 175, 0);rgba(219, 234, 254, 0.5);rgba(156, 163, 175, 0)" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="rgba(219, 234, 254, 0.8)">
                          <animate attributeName="stop-color" values="rgba(219, 234, 254, 0.8);rgba(156, 163, 175, 1);rgba(219, 234, 254, 0.8)" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="rgba(156, 163, 175, 0)">
                          <animate attributeName="stop-color" values="rgba(156, 163, 175, 0);rgba(219, 234, 254, 0.5);rgba(156, 163, 175, 0)" dur="3s" repeatCount="indefinite" />
                        </stop>
                      </linearGradient>
                      <linearGradient id="fancy-gradient-android" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34, 197, 94, 0)">
                          <animate attributeName="stop-color" values="rgba(34, 197, 94, 0);rgba(134, 239, 172, 0.5);rgba(34, 197, 94, 0)" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="rgba(134, 239, 172, 0.8)">
                          <animate attributeName="stop-color" values="rgba(134, 239, 172, 0.8);rgba(34, 197, 94, 1);rgba(134, 239, 172, 0.8)" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="rgba(34, 197, 94, 0)">
                          <animate attributeName="stop-color" values="rgba(34, 197, 94, 0);rgba(134, 239, 172, 0.5);rgba(34, 197, 94, 0)" dur="3s" repeatCount="indefinite" />
                        </stop>
                      </linearGradient>
                      <linearGradient id="fancy-gradient-web" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0)">
                          <animate attributeName="stop-color" values="rgba(59, 130, 246, 0);rgba(147, 197, 253, 0.5);rgba(59, 130, 246, 0)" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="rgba(147, 197, 253, 0.8)">
                          <animate attributeName="stop-color" values="rgba(147, 197, 253, 0.8);rgba(59, 130, 246, 1);rgba(147, 197, 253, 0.8)" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)">
                          <animate attributeName="stop-color" values="rgba(59, 130, 246, 0);rgba(147, 197, 253, 0.5);rgba(59, 130, 246, 0)" dur="3s" repeatCount="indefinite" />
                        </stop>
                      </linearGradient>

                      {/* Glow filters */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background paths with right angles - all equal length */}
                    <path d="M 200 100 L 200 260 L 60 260 L 60 380" fill="none" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="4" />
                    <path d="M 200 100 L 200 380" fill="none" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="4" />
                    <path d="M 200 100 L 200 260 L 340 260 L 340 380" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="4" />

                    {/* Animated paths with right angles - all equal length */}
                    <path d="M 200 100 L 200 260 L 60 260 L 60 380" 
                          fill="none"
                          stroke="url(#fancy-gradient-ios)" 
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          filter="url(#glow)">
                      <animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite" />
                    </path>
                    
                    <path d="M 200 100 L 200 380" 
                          fill="none"
                          stroke="url(#fancy-gradient-android)" 
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          filter="url(#glow)">
                      <animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite" />
                    </path>
                    
                    <path d="M 200 100 L 200 260 L 340 260 L 340 380" 
                          fill="none"
                          stroke="url(#fancy-gradient-web)" 
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          filter="url(#glow)">
                      <animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite" />
                    </path>

                    {/* Refined moving particles - single elegant dot per path */}
                    <circle r="2" fill="rgba(156, 163, 175, 0.8)">
                      <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath href="#path-ios" />
                      </animateMotion>
                      <animate attributeName="opacity" values="0;0.8;0.8;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    
                    <circle r="2" fill="rgba(34, 197, 94, 0.8)">
                      <animateMotion dur="2s" repeatCount="indefinite" begin="0.7s">
                        <mpath href="#path-android" />
                      </animateMotion>
                      <animate attributeName="opacity" values="0;0.8;0.8;0" dur="2s" repeatCount="indefinite" begin="0.7s" />
                    </circle>
                    
                    <circle r="2" fill="rgba(59, 130, 246, 0.8)">
                      <animateMotion dur="2s" repeatCount="indefinite" begin="1.4s">
                        <mpath href="#path-web" />
                      </animateMotion>
                      <animate attributeName="opacity" values="0;0.8;0.8;0" dur="2s" repeatCount="indefinite" begin="1.4s" />
                    </circle>

                    {/* Hidden paths for animation with right angles - all equal length */}
                    <path id="path-ios" d="M 200 100 L 200 260 L 60 260 L 60 380" fill="none" />
                    <path id="path-android" d="M 200 100 L 200 380" fill="none" />
                    <path id="path-web" d="M 200 100 L 200 260 L 340 260 L 340 380" fill="none" />


                    {/* Platform icons positioned at line endpoints within SVG */}
                    {/* iOS at x=60, y=380 */}
                    <foreignObject x="28" y="348" width="64" height="100">
                      <div className="text-center group">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gray-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-900/90 backdrop-blur rounded-lg border border-gray-600/50 group-hover:border-gray-400/50 transition-all">
                            <Smartphone className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mb-1 font-medium">iOS</div>
                        <div className="text-xs text-gray-600">App Store</div>
                      </div>
                    </foreignObject>

                    {/* Android at x=200, y=380 */}
                    <foreignObject x="168" y="348" width="64" height="100">
                      <div className="text-center group">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-900/90 backdrop-blur rounded-lg border border-green-600/50 group-hover:border-green-400/50 transition-all">
                            <Smartphone className="w-8 h-8 text-green-500 group-hover:text-green-400 transition-colors" />
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mb-1 font-medium">Android</div>
                        <div className="text-xs text-gray-600">Play Store</div>
                      </div>
                    </foreignObject>

                    {/* Web at x=340, y=380 */}
                    <foreignObject x="308" y="348" width="64" height="100">
                      <div className="text-center group">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-900/90 backdrop-blur rounded-lg border border-blue-600/50 group-hover:border-blue-400/50 transition-all">
                            <Code2 className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mb-1 font-medium">Web</div>
                        <div className="text-xs text-gray-600">Website</div>
                      </div>
                    </foreignObject>
                  </svg>

                  {/* Firebase to Depl transformation animation */}
                  <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 z-10">
                    <div className="relative flex items-center justify-center">
                      {/* Firebase with warning - fades out */}
                      <div className="absolute animate-firebase-out flex items-center justify-center">
                        <div className="relative inline-flex items-center space-x-2 px-6 py-3 bg-gray-900/90 backdrop-blur border-2 border-red-500/70 rounded-lg shadow-2xl">
                          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z"/>
                          </svg>
                          <span className="font-mono text-sm text-gray-400">firebase.app/campaign</span>
                          {/* Red X warning */}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Depl link - fades in */}
                      <div className="relative animate-depl-in flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-xl opacity-70"></div>
                        <div className="relative inline-flex items-center space-x-2 px-6 py-3 bg-gray-900/90 backdrop-blur border-2 border-purple-500/70 rounded-lg shadow-2xl">
                          <Link2 className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">depl.link/promo</span>
                          {/* Green checkmark for safety */}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <style jsx>{`
                    @keyframes firebase-out {
                      0%, 40% { opacity: 1; transform: scale(1); }
                      50%, 100% { opacity: 0; transform: scale(0.9); }
                    }
                    @keyframes depl-in {
                      0%, 45% { opacity: 0; transform: scale(1.1); }
                      55%, 100% { opacity: 1; transform: scale(1); }
                    }
                    .animate-firebase-out {
                      animation: firebase-out 4s ease-in-out infinite;
                    }
                    .animate-depl-in {
                      animation: depl-in 4s ease-in-out infinite;
                    }
                  `}</style>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Support Ticker */}
      <section className="py-8 bg-gray-950 border-y border-gray-800/30 overflow-hidden">
        <div className="relative flex justify-center">
          <div className="flex animate-pulse whitespace-nowrap">
            <div className="flex items-center justify-center space-x-12 px-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">React Native</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">Flutter</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">iOS Native</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">Android Native</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">Unity</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">Ionic</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">Xamarin</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">Capacitor</span>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - Premium Design */}
      <section className="relative overflow-hidden">
        <div className="py-24 bg-gray-950">
          {/* Background gradient that flows into next section */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block">
                <h2 className="text-4xl font-light text-gray-100 mb-2 tracking-tight">
                  Key Features
                </h2>
                <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>
              <p className="text-gray-400 font-light mt-6 text-lg">
                Enterprise-grade infrastructure for modern apps
              </p>
            </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Smart Deep Links */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 p-8 hover:border-gray-700/60 transition-all duration-500 hover:transform hover:-translate-y-1">
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl blur-xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700/50">
                    <Link2 className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <h3 className="text-xl font-normal text-gray-100 mb-3">Smart Deep Links</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Intelligent routing that detects platforms instantly. Seamless redirection to app stores with graceful web fallbacks.
                </p>
                
                {/* Feature highlights */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    <span>Auto-detect iOS & Android</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    <span>Response time &lt; 50ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Real-time Analytics */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 p-8 hover:border-gray-700/60 transition-all duration-500 hover:transform hover:-translate-y-1">
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl blur-xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700/50">
                    <Database className="w-7 h-7 text-green-400" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-normal text-gray-100 mb-3">Real-time Analytics</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Live dashboard with instant metrics. Track user behavior, conversion rates, and geographic insights.
                </p>
                
                {/* Feature highlights */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                    <span>Zero-latency updates</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                    <span>Advanced filtering</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Enterprise API */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 p-8 hover:border-gray-700/60 transition-all duration-500 hover:transform hover:-translate-y-1">
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700/50">
                    <Shield className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
                
                <h3 className="text-xl font-normal text-gray-100 mb-3">Enterprise API</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Powerful RESTful API with comprehensive documentation. Built for scale with rate limiting and webhooks.
                </p>
                
                {/* Feature highlights */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    <span>99.99% uptime SLA</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    <span>OAuth 2.0 secure</span>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start - Premium Design - Seamlessly connected */}
      <section className="relative overflow-hidden -mt-24">
        <div className="py-24 pt-48 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
          {/* Animated background elements - flowing from previous section */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-green-500/3 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl font-light text-gray-100 mb-2 tracking-tight">
                Quick Start
              </h2>
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
            <p className="text-gray-400 font-light mt-6 text-lg max-w-2xl mx-auto">
              From zero to production in record time
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Time display with enhanced design */}
            <div className="text-center mb-20">
              <div className="relative inline-block">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
                
                <div className="relative bg-gray-900/60 backdrop-blur-sm px-12 py-8 rounded-3xl border border-gray-800/50 shadow-2xl">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"></div>
                      <Clock className="w-14 h-14 text-purple-400 relative z-10" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-6xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        10
                      </div>
                      <div className="text-sm text-gray-500 font-light tracking-wider">MINUTES</div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                      <Zap className="w-14 h-14 text-yellow-400 relative z-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps with connecting line */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-6 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent hidden md:block"></div>
              
              <div className="grid md:grid-cols-3 gap-12">
                {/* Step 1 */}
                <div className="relative group">
                  <div className="text-center">
                    {/* Step number with gradient */}
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-700/50 group-hover:border-purple-500/50 transition-all">
                        <span className="text-gray-300 font-mono text-lg group-hover:text-purple-400 transition-colors">1</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-normal text-gray-100 mb-3 group-hover:text-purple-400 transition-colors">
                      Create Project
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Sign up and create your first project with a single click
                    </p>
                    
                    {/* Icon */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative group">
                  <div className="text-center">
                    {/* Step number with gradient */}
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-700/50 group-hover:border-green-500/50 transition-all">
                        <span className="text-gray-300 font-mono text-lg group-hover:text-green-400 transition-colors">2</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-normal text-gray-100 mb-3 group-hover:text-green-400 transition-colors">
                      Configure Apps
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Add your iOS and Android app identifiers
                    </p>
                    
                    {/* Icon */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative group">
                  <div className="text-center">
                    {/* Step number with gradient */}
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-2xl blur-xl animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl flex items-center justify-center border border-blue-700/50 shadow-lg shadow-blue-900/50">
                        <Rocket className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-normal text-gray-100 mb-3 group-hover:text-blue-400 transition-colors">
                      Launch
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Start creating deep links with our API instantly
                    </p>
                    
                    {/* Icon */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800/50 to-indigo-800/50 flex items-center justify-center animate-pulse">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-200 mb-4">
              Honest Pricing
            </h2>
            <p className="text-gray-400 font-light">
              Deep linking is a basic feature. Stop paying outrageous prices
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Competitors */}
            <div className="bg-gray-900/40 border border-gray-800/40 rounded-xl p-6 opacity-60">
              <h3 className="text-lg text-gray-400 mb-2">AppsFlyer</h3>
              <div className="text-2xl font-mono text-red-400 mb-4">$$$$$</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Complex pricing tiers</li>
                <li>Hidden costs</li>
                <li>Forced bundles</li>
              </ul>
            </div>
            <div className="bg-gray-900/40 border border-gray-800/40 rounded-xl p-6 opacity-60">
              <h3 className="text-lg text-gray-400 mb-2">Branch</h3>
              <div className="text-2xl font-mono text-orange-400 mb-4">$$$$</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Enterprise only</li>
                <li>Usage limits</li>
                <li>Vendor lock-in</li>
              </ul>
            </div>
            <div className="bg-gray-900/40 border border-gray-800/40 rounded-xl p-6 opacity-60">
              <h3 className="text-lg text-gray-400 mb-2">Firebase</h3>
              <div className="text-2xl font-mono text-yellow-400 mb-4">$$$</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Complex setup</li>
                <li>Limited features</li>
                <li>Deprecating soon</li>
              </ul>
            </div>
            
            {/* DEPL */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-xl p-6 transform scale-105 shadow-xl">
              <h3 className="text-lg text-gray-200 mb-2">DEPL</h3>
              <div className="text-2xl font-mono text-green-400 mb-4">FREE</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" />
                  Transparent pricing
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" />
                  Unlimited links
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" />
                  All features included
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-gray-200 mb-4">
            Get Started Today
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto font-light">
            Build your deep link system for free and improve mobile user experience
          </p>
          <Button 
            size="lg" 
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-normal px-8 border border-gray-700"
            onClick={(e) => {
              e.preventDefault();
              console.log('CTA button clicked');
              handleGetStarted();
            }}
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 border-t border-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center border border-gray-700/50">
                <Link2 className="h-3 w-3 text-gray-400" />
              </div>
              <span className="text-lg font-normal text-gray-300">DEPL</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                © 2024 DEPL. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Firebase Dynamic Links Alternative
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}