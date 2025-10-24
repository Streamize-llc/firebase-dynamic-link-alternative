"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase/provider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [subdomain, setSubdomain] = useState("");
  const [mounted, setMounted] = useState(false);
  const { supabase, user } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = async () => {
    if (!user) {
      if (!supabase) return;

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/callback`,
            scopes: 'profile email'
          },
        });

        if (error) {
          console.error('Login error:', error);
        }
      } catch (err) {
        console.error('Unexpected error during login:', err);
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Header */}
      <header className={`relative z-50 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-tight font-space-grotesk">
              DEPL
            </Link>

            <div className="flex items-center gap-8">
              <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Documentation
              </Link>
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:bg-white hover:text-black"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className={`text-6xl md:text-7xl font-medium tracking-tight text-white mb-4 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Deep linking for
              <br />
              modern apps
            </h1>

            <p className={`text-sm text-gray-500 uppercase tracking-wider mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Firebase • AppsFlyer • Adjust Alternative
            </p>

            <p className={`text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Create custom deep link domains in seconds. No infrastructure, no hassle.
            </p>

            {/* Input Section */}
            <div className={`max-w-2xl mx-auto mb-16 transition-all duration-700 delay-[400ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      if (value.length <= 12) setSubdomain(value);
                    }}
                    placeholder="yourapp"
                    className="bg-transparent text-white text-2xl font-mono outline-none placeholder:text-gray-600 text-center min-w-[140px]"
                    style={{ width: `${Math.max(subdomain.length || 7, 7)}ch` }}
                  />
                  <span className="text-2xl text-gray-500 font-mono">.depl.link</span>
                </div>

                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-medium h-12 px-8"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-sm text-gray-500 mt-4">
                  Free to start • No credit card required
                </p>
              </div>
            </div>

            {/* Features */}
            <div className={`grid grid-cols-3 gap-8 max-w-3xl mx-auto transition-all duration-700 delay-[500ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div key="feature-universal" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-gray-400">Universal Links</div>
              </div>
              <div key="feature-app" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-gray-400">App Links</div>
              </div>
              <div key="feature-analytics" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-gray-400">Analytics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Platforms Section */}
        <div className={`max-w-7xl mx-auto px-6 py-24 border-t border-white/5 transition-all duration-700 delay-[600ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wider">Supported Platforms</p>
          </div>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <div key="platform-ios" className="flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm font-medium">iOS</span>
            </div>
            <div key="platform-android" className="flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.5 11.5 0 0 0-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C2.92 10.76 1 13.68 1 17h22c0-3.32-1.92-6.24-5.4-7.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
              </svg>
              <span className="text-sm font-medium">Android</span>
            </div>
            <div key="platform-react-native" className="flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046z"/>
              </svg>
              <span className="text-sm font-medium">React Native</span>
            </div>
            <div key="platform-flutter" className="flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z"/>
              </svg>
              <span className="text-sm font-medium">Flutter</span>
            </div>
          </div>
        </div>

        {/* Why DEPL Section */}
        <div className={`max-w-7xl mx-auto px-6 py-32 border-t border-white/5 transition-all duration-700 delay-[700ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-space-grotesk">
                Why DEPL?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Enterprise-grade deep linking without the enterprise price tag
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* DEPL Card */}
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative bg-black border border-white/20 rounded-3xl p-10 backdrop-blur-sm h-full flex flex-col">
                  <div className="mb-8">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-3">DEPL</div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-7xl font-bold text-white tracking-tight">$0</span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>
                    <div className="text-gray-400">Forever free</div>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Unlimited deep links</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Universal Links & App Links</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Analytics & click tracking</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Custom domain support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitors Card */}
              <div className="relative h-full">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm h-full flex flex-col">
                  <div className="mb-8">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-3">Competitors</div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-7xl font-bold text-white/40 tracking-tight">$299</span>
                      <span className="text-gray-600 text-lg">+/month</span>
                    </div>
                    <div className="text-gray-500">Starting price</div>
                  </div>

                  <div className="space-y-6 flex-grow">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-400">AppsFlyer</span>
                      <span className="text-gray-500 text-sm">$499+/mo</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-400">Adjust</span>
                      <span className="text-gray-500 text-sm">$750+/mo</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-400">Branch</span>
                      <span className="text-gray-500 text-sm">$299+/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Video Grid */}
        <div className={`max-w-full mx-auto py-32 border-t border-white/5 overflow-hidden transition-all duration-700 delay-[800ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16 px-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-space-grotesk">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what developers are building with DEPL
            </p>
          </div>

          <div className="relative">
            {/* Gradient fade on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            {/* Scrolling container */}
            <div className="flex animate-scroll">
              {/* First set of videos */}
              <div className="flex gap-6 pr-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={`video-1-${i}`}
                    className="flex-shrink-0 w-80 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group cursor-pointer"
                    style={{ height: '30rem' }}
                  >
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* Placeholder for video */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                      <div className="relative z-10 text-center p-6">
                        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm">Video {i}</p>
                        <p className="text-white font-medium mt-1">Developer Testimonial</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex gap-6 pr-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={`video-2-${i}`}
                    className="flex-shrink-0 w-80 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group cursor-pointer"
                    style={{ height: '30rem' }}
                  >
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* Placeholder for video */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                      <div className="relative z-10 text-center p-6">
                        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm">Video {i}</p>
                        <p className="text-white font-medium mt-1">Developer Testimonial</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Integration Section */}
        <div className={`max-w-7xl mx-auto px-6 py-32 border-t border-white/5 transition-all duration-700 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-space-grotesk">
                Simple Integration
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                No SDK. No complex setup. Just deep links that work.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-red-400 text-4xl mb-4">✗</div>
                <h3 className="text-2xl font-bold text-white mb-4">Traditional MMPs</h3>
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Complex SDK integration across platforms</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Weeks of development time</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Expensive attribution features you don't need</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Bloated app size and dependencies</span>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative bg-black border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="text-green-400 text-4xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-white mb-4">DEPL</h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Simple REST API - no SDK required</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Start in minutes, not weeks</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Focus on deep links, not attribution noise</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Zero impact on your app bundle</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border-l-4 border-white/20 rounded-r-2xl p-8 backdrop-blur-sm">
              <p className="text-2xl text-white font-medium mb-4">
                99% of startups don't need a full MMP
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Most teams just need reliable deep links that work across platforms.
                You don't need complex attribution models, fraud detection, or multi-touch analytics
                when you're just trying to get users from a link into your app.
                DEPL focuses on doing one thing exceptionally well: deep linking.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className={`max-w-7xl mx-auto px-6 py-32 border-t border-white/5 transition-all duration-700 delay-[1000ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-space-grotesk">
                Our Story
              </h2>
            </div>

            <div className="space-y-8 text-lg leading-relaxed">
              <p className="text-gray-300">
                We were shocked by the absurd pricing of tools like AppsFlyer, Adjust, and Branch.
                These platforms charge premium prices for features that don't justify the cost.
              </p>

              <div className="bg-white/5 border-l-4 border-white/20 rounded-r-2xl p-8 backdrop-blur-sm">
                <p className="text-xl text-white font-medium mb-4">
                  "After using their free tier, we were suddenly forced into a $2,500/month contract."
                </p>
                <p className="text-gray-400">
                  As a startup, we couldn't justify spending that much on what should be a basic feature.
                </p>
              </div>

              <p className="text-gray-300">
                So we built our own solution. And we realized we weren't alone – countless developers
                face the same frustration with overpriced MMP (Mobile Measurement Partner) tools.
              </p>

              <p className="text-gray-300">
                DEPL was created to give developers and startups a powerful, reliable deep linking
                solution without the enterprise price tag. We believe essential tools shouldn't
                break your budget.
              </p>

              <div className="pt-8 text-center">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-medium h-12 px-8"
                  onClick={handleGetStarted}
                >
                  Start Building for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
