"use client" 

import * as React from "react"

import { Button } from "@/components/ui/button";
import { Menu, ArrowRight, X, Command, Circle, Zap, Link2, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase/provider";

function HeroModern() {
    const { supabase, user } = useSupabase();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const targetDate = new Date('2025-08-01T00:00:00');
    
        const updateCountdown = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
    
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
            setTimeLeft({ days, hours, minutes, seconds });
        };
    
        const timer = setInterval(updateCountdown, 1000);
        updateCountdown();
    
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async () => {
        await supabase?.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard/project`,
                scopes: 'profile email'
            },
        });
    };

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <div
                className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 blur-3xl"
                style={{
                    transform: `translate(${(mousePosition.x - 0.5) * 20}%, ${
                        (mousePosition.y - 0.5) * 20
                    }%)`,
                }}
            />

            <div className="absolute inset-0">
                <div
                    className="absolute top-1/4 left-1/4 w-72 h-72 border border-white/10 
                    rounded-full animate-[spin_25s_linear_infinite]"
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-white/10 
                    rounded-full animate-[spin_18s_linear_infinite_reverse]"
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] 
                    border border-white/10 rounded-full animate-[spin_30s_linear_infinite]"
                />
            </div>

            <nav className="relative z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-24">
                        <a
                            href="https://kokonutui.com/"
                            className="flex items-center gap-3"
                        >
                            <Command
                                className="h-6 w-6 text-purple-500"
                                strokeWidth={1.5}
                            />
                            <span className="text-xl font-medium tracking-wide">
                                DEPL
                            </span>
                        </a>

                        <div className="hidden md:flex items-center gap-12">
                            {["Products", "Pricing", "Docs", "Blog"].map(
                                (item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-sm text-white/70 hover:text-white transition-colors relative group"
                                    >
                                        {item}
                                        <span
                                            className="absolute -bottom-1 left-0 w-2 h-px bg-purple-500/50 
                                            transition-all group-hover:w-full"
                                        />
                                    </a>
                                )
                            )}
                            {user ? (
                                <Button
                                    className="h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white 
                                    transition-colors"
                                    onClick={() => window.location.href = '/dashboard/project'}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <Button
                                    className="h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white 
                                    transition-colors"
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 pt-20 lg:pt-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                                        bg-orange-500/10 border border-orange-500/20"
                                    >
                                        <Circle className="h-2 w-2 fill-orange-500 animate-pulse" />
                                        <span className="text-sm font-medium tracking-wide">
                                            Firebase Dynamic Links Alternative
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h1 className="text-5xl font-bold tracking-tight leading-[1.2]">
                                        Firebase Dynamic Links
                                        <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                                          shutting down soon
                                        </span>
                                    </h1>

                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:border-orange-500/20 transition-colors">
                                            <div className="text-3xl font-bold tracking-wider">{String(timeLeft.days).padStart(2, '0')}</div>
                                            <div className="text-sm text-white/70 mt-1">days</div>
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:border-orange-500/20 transition-colors">
                                            <div className="text-3xl font-bold tracking-wider">{String(timeLeft.hours).padStart(2, '0')}</div>
                                            <div className="text-sm text-white/70 mt-1">hours</div>
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:border-orange-500/20 transition-colors">
                                            <div className="text-3xl font-bold tracking-wider">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                            <div className="text-sm text-white/70 mt-1">minutes</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-lg text-white/80 leading-relaxed max-w-lg font-medium">
                                    Time is running out. Switch to our alternative
                                    <br />
                                    with unlimited deep links and comprehensive analytics.
                                    <br />
                                    No SDK required and completely free, forever.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    {user ? (
                                        <Button 
                                            className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white group"
                                            onClick={() => window.location.href = '/dashboard'}
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    ) : (
                                        <Button 
                                            className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white group"
                                            onClick={handleLogin}
                                        >
                                            Start with Google
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                    {/* <Button
                                        variant="outline"
                                        className="h-12 px-8 border-white/10 hover:bg-white/5"
                                    >
                                        View Documentation
                                    </Button> */}
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px]">
                            <div className="absolute inset-0">
                                <div className="relative h-full w-full">
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden group">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/50 
                                            to-transparent z-10"
                                        />

                                        <img
                                            src="https://images.unsplash.com/photo-1633613286991-611fe299c4be?auto=format&fit=crop&q=80"
                                            alt="Deep Link Dashboard Image"
                                            className="object-cover w-full h-full transform scale-105 
                                            group-hover:scale-100 transition-transform duration-700"
                                        />

                                        <div className="absolute top-8 right-8 z-20">
                                            <div
                                                className="w-24 h-24 border border-purple-500/20 
                                                rounded-full animate-[spin_20s_linear_infinite]"
                                            />
                                        </div>
                                        <div className="absolute bottom-8 left-8 z-20">
                                            <div
                                                className="w-16 h-16 border border-blue-500/20 rounded-full 
                                                animate-[spin_15s_linear_infinite_reverse]"
                                            />
                                        </div>

                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
                                            <div className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3">
                                                <Zap className="h-5 w-5 text-yellow-400" />
                                                <p className="text-sm font-medium">Quick setup, instant use</p>
                                            </div>
                                            <div className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3">
                                                <Link2 className="h-5 w-5 text-purple-400" />
                                                <p className="text-sm font-medium">Unlimited deep links</p>
                                            </div>
                                            <div className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3">
                                                <BarChart3 className="h-5 w-5 text-blue-400" />
                                                <p className="text-sm font-medium">Detailed analytics dashboard</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </main>
        </div>
    );
}

export { HeroModern }