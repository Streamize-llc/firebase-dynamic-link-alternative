"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Check, X, Loader2, Rocket, Zap, Shield, Globe, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Landing2() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced availability check
  useEffect(() => {
    if (!subdomain) {
      setIsAvailable(null);
      setError("");
      return;
    }

    if (subdomain.length < 3) {
      setIsAvailable(null);
      setError("Minimum 3 characters");
      return;
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain)) {
      setIsAvailable(false);
      setError("Only lowercase letters, numbers, and hyphens allowed");
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      setError("");

      try {
        const response = await fetch(`/api/check-subdomain?subdomain=${subdomain}`);
        const data = await response.json();
        setIsAvailable(data.available);
        if (!data.available) {
          setError("This subdomain is already taken");
        }
      } catch (err) {
        setError("Failed to check availability");
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [subdomain]);

  const handleGetStarted = async () => {
    if (!isAvailable || !subdomain) return;

    // Store subdomain in localStorage for later use
    localStorage.setItem('pending_subdomain', subdomain);

    // Redirect to dashboard (will handle auth there)
    router.push(`/dashboard?subdomain=${subdomain}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Large gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"></div>

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-gray-800/30 bg-gray-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Link2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">DEPL</span>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-gray-200 text-sm"
                onClick={() => router.push('/')}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-gray-200 text-sm"
                onClick={() => router.push('/dashboard')}
              >
                Sign In
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm text-purple-300 font-medium">Firebase Dynamic Links Alternative</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white animate-gradient">
              Your Deep Link
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient">
              Domain
            </span>
            <span className="block text-4xl md:text-5xl font-light text-gray-400 mt-4 flex items-center justify-center gap-3">
              in 30 seconds
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            Choose your custom subdomain and start creating{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">
              smart deep links
            </span>{" "}
            for your mobile app
          </p>

          {/* Subdomain Input Form */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="relative group">
              {/* Enhanced Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-gradient-shift"></div>

              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl rounded-3xl border-2 border-gray-700/50 p-10 shadow-2xl">
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/50 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-500/50 rounded-br-3xl"></div>

                <label className="block text-center mb-6">
                  <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase tracking-widest">
                    Choose Your Subdomain
                  </span>
                </label>

                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                  <div className="relative flex-1 w-full">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                      placeholder="myapp"
                      className="h-16 text-xl px-8 bg-gray-800/70 border-2 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all rounded-2xl font-medium"
                      maxLength={30}
                    />
                    {isChecking && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                      </div>
                    )}
                    {!isChecking && subdomain && isAvailable !== null && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        {isAvailable ? (
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full border-2 border-green-400">
                            <Check className="w-5 h-5 text-green-400" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full border-2 border-red-400">
                            <X className="w-5 h-5 text-red-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-2xl text-gray-300 font-bold">.depl.link</span>
                </div>

                {/* Preview */}
                {subdomain && (
                  <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Your domain will be:</span>
                      </div>
                      <code className="text-sm font-mono text-purple-400">
                        {subdomain}.depl.link
                      </code>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {isAvailable && subdomain && !error && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-400">✓ Available! This subdomain is ready to use</p>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  size="lg"
                  disabled={!isAvailable || isChecking || !subdomain}
                  onClick={handleGetStarted}
                  className="w-full h-14 text-lg group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subdomain && isAvailable ? (
                    <>
                      Start with {subdomain}.depl.link
                      <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    "Choose your subdomain to get started"
                  )}
                </Button>

                <p className="mt-4 text-xs text-gray-500">
                  Free forever • No credit card required • 2 minute setup
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Instant Setup</h3>
              <p className="text-xs text-gray-400">Start creating deep links in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Enterprise Security</h3>
              <p className="text-xs text-gray-400">SSL encryption & API key authentication</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Global CDN</h3>
              <p className="text-xs text-gray-400">Fast redirects worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }

        /* Smooth input transitions */
        input:focus {
          transform: scale(1.01);
        }

        /* Glow pulse effect */
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
