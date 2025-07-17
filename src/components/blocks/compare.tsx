"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Check, X, Zap, ArrowRight, Star, DollarSign, Package, AlertTriangle, Lightbulb, AlertCircle, Badge, Sparkles, TrendingUp, CreditCard, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

function CompareSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const comparisonData = [
    {
      feature: "Pricing",
      depl: { value: "Free Forever", highlight: true },
      appsflyer: { value: "Enterprise $$$", highlight: false },
      branch: { value: "Enterprise $$$", highlight: false }
    },
    {
      feature: "Deep Links",
      depl: { value: "Unlimited", highlight: true },
      appsflyer: { value: "Limited", highlight: false },
      branch: { value: "Limited", highlight: false }
    },
    {
      feature: "Custom Domain",
      depl: { value: <Check className="h-5 w-5 text-green-500 mx-auto" />, highlight: false },
      appsflyer: { value: <Check className="h-5 w-5 text-white/70 mx-auto" />, highlight: false },
      branch: { value: <Check className="h-5 w-5 text-white/70 mx-auto" />, highlight: false }
    },
    {
      feature: "Analytics Dashboard",
      depl: { value: <Check className="h-5 w-5 text-green-500 mx-auto" />, highlight: false },
      appsflyer: { value: <Check className="h-5 w-5 text-white/70 mx-auto" />, highlight: false },
      branch: { value: <Check className="h-5 w-5 text-white/70 mx-auto" />, highlight: false }
    },
    {
      feature: "No SDK Required",
      depl: { value: <Check className="h-5 w-5 text-green-500 mx-auto" />, highlight: true },
      appsflyer: { value: <X className="h-5 w-5 text-red-500/70 mx-auto" />, highlight: false },
      branch: { value: <X className="h-5 w-5 text-red-500/70 mx-auto" />, highlight: false }
    },
    {
      feature: "Setup Time",
      depl: { value: "Minutes", highlight: true },
      appsflyer: { value: "Days", highlight: false },
      branch: { value: "Days", highlight: false }
    }
  ];

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 blur-3xl"
        style={{
          transform: `translate(${(mousePosition.x - 0.5) * 20}%, ${
            (mousePosition.y - 0.5) * 20
          }%)`,
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/10 rounded-full animate-[spin_30s_linear_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-white/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 relative z-10 pb-28 pt-14">
        <div className="text-center mb-16">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Firebase Dynamic Links Alternative
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.2]">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">DEPL</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            The free alternative to Firebase Dynamic Links with more features and better performance
          </p>
        </div>

        {/* Comparison table */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 shadow-[0_0_40px_rgba(123,58,180,0.1)]">
          {/* Table header */}
          <div className="grid grid-cols-4 border-b border-white/10">
            <div className="p-6 font-medium text-white/50"></div>
            <div className="p-6 text-center relative">
              <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center gap-2">
                <Star className="h-5 w-5 fill-purple-500 text-transparent" />
                DEPL
              </div>
              <div className="text-xs text-white/50 mt-1">Recommended</div>
            </div>
            <div className="p-6 text-center border-l border-white/10">
              <div className="font-bold text-xl text-white/90">AppsFlyer</div>
              <div className="text-xs text-white/50 mt-1">Enterprise</div>
            </div>
            <div className="p-6 text-center border-l border-white/10">
              <div className="font-bold text-xl text-white/90">Branch</div>
              <div className="text-xs text-white/50 mt-1">Enterprise</div>
            </div>
          </div>

          {/* Table body */}
          {comparisonData.map((row, index) => (
            <div key={index} className={`grid grid-cols-4 ${index !== comparisonData.length - 1 ? 'border-b border-white/10' : ''}`}>
              <div className="p-6 font-medium flex items-center text-white/90">{row.feature}</div>
              <div className={`p-6 text-center flex items-center justify-center ${row.depl.highlight ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10' : ''}`}>
                <span className={row.depl.highlight ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500' : ''}>
                  {row.depl.value}
                </span>
              </div>
              <div className="p-6 text-center flex items-center justify-center border-l border-white/10 text-white/80">
                {row.appsflyer.value}
              </div>
              <div className="p-6 text-center flex items-center justify-center border-l border-white/10 text-white/80">
                {row.branch.value}
              </div>
            </div>
          ))}
        </div>

        {/* Startup Cost Warning - Refined Elegant Design */}
        <div className="text-center mb-16 mt-32">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Not Built for Startups
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.2]">
            Enterprise Solutions <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Drain Startup Budgets</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Third-party attribution platforms are designed for enterprise companies with large budgets, not for early-stage startups with limited resources
          </p>
        </div>
        
        <div className="mt-12 rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-black/40 to-black/60 border border-red-400/20 hover:border-orange-400/30 transition-all duration-300 shadow-[0_10px_30px_rgba(123,58,180,0.07)]">
          {/* Header with elegant gradient accent */}
          <div className="p-5 border-b border-white/5 relative bg-white/[0.03]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-400/80 via-orange-400/80 to-transparent"></div>
            <h3 className="text-base font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <span>Why Enterprise Attribution Tools May Be Draining Your Startup Budget</span>
            </h3>
          </div>
          
          {/* Main content with refined layout */}
          <div className="p-5 space-y-4">
            <p className="text-sm leading-relaxed text-white/80">
              AppsFlyer, Adjust, and Branch are premium attribution platforms that 
              <span className="font-medium text-orange-400"> bundle deep linking with high-cost packages</span>. 
              For early-stage startups with limited resources, these solutions can represent a 
              disproportionate financial burden.
            </p>
            
            <div className="grid md:grid-cols-3 gap-3 mt-1">
              <div className="bg-white/[0.04] rounded-lg p-3.5 border border-white/10 hover:border-orange-500/20 transition-all duration-300 hover:bg-white/[0.06]">
                <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2.5">Financial Impact</h4>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium">$10K-50K+ annually</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Can consume 5-15% of marketing budgets with long-term contracts
                </p>
              </div>
              
              <div className="bg-white/[0.04] rounded-lg p-3.5 border border-white/10 hover:border-red-500/20 transition-all duration-300 hover:bg-white/[0.06]">
                <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2.5">Unnecessary Complexity</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium">Overengineered</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Most startups only need deep linking, not full attribution suites
                </p>
              </div>
              
              <div className="bg-white/[0.04] rounded-lg p-3.5 border border-white/10 hover:border-purple-500/20 transition-all duration-300 hover:bg-white/[0.06]">
                <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2.5">Smarter Alternative</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium">Depl's approach</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Free deep linking with the option to add attribution only when needed
                </p>
              </div>
            </div>
          </div>
          
          {/* Quote with refined styling */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-t border-white/5">
            <div className="flex items-center justify-between">
              <p className="text-xs italic text-white/60">
                "Unless attribution is critical to your current stage, these enterprise solutions are an unnecessary expense."
              </p>
              <Badge className="text-xs bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-white border-0 transition-colors px-2 py-0.5">
                Startup Friendly
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-center mb-16 mt-32">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              Unbelievable Price Difference
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.2]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">1000x Cheaper</span> Than Competitors
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            While enterprise attribution platforms demand thousands of dollars monthly, we deliver the same functionality for just a few dollars. Revolutionary pricing for startups.
          </p>
        </div>

        {/* Pricing Information */}
        <div className="mt-12 bg-gradient-to-br from-indigo-900/30 to-teal-900/30 rounded-xl border border-white/10 overflow-hidden shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">Transparent Pricing</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/[0.04] rounded-lg p-5 border border-teal-500/30 transition-all duration-300 hover:bg-white/[0.06] hover:shadow-teal-500/20 hover:shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 bg-teal-500/20 w-24 h-24 rounded-full blur-xl"></div>
                <div className="absolute right-2 top-2">
                  <span className="bg-teal-500/20 text-teal-400 text-xs font-bold py-1 px-2 rounded-full border border-teal-500/30">FREE</span>
                </div>

                <h4 className="text-sm uppercase tracking-wider text-white/70 mb-3">Free Plan</h4>
                <div className="text-2xl font-bold mb-3 flex items-baseline">
                  <span>100</span>
                  <span className="text-white/60 text-lg ml-1">clicks/month</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Perfect starting point for small projects or testing
                </p>
              </div>
              
              <div className="bg-white/[0.04] rounded-lg p-5 border border-indigo-500/30 transition-all duration-300 hover:bg-white/[0.06] hover:shadow-indigo-500/20 hover:shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 bg-indigo-500/20 w-24 h-24 rounded-full blur-xl"></div>
                <div className="absolute right-2 top-2">
                  <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold py-1 px-2 rounded-full border border-indigo-500/30 animate-pulse">BEST VALUE</span>
                </div>

                <h4 className="text-sm uppercase tracking-wider text-white/70 mb-3">Premium Plan</h4>
                <div className="text-2xl font-bold mb-3 flex items-baseline">
                  <span>20,000</span>
                  <span className="text-white/60 text-lg ml-1">clicks/month</span>
                  <span className="ml-auto text-indigo-400 text-xl font-extrabold">$7</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Sufficient volume for most startups at a fraction of competitor prices
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-lg border border-teal-500/20">
              <p className="text-sm text-white/80 flex items-center">
                <Lightbulb className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                <span>The volume of 20,000 deep links per month is more than enough for most startups, saving you up to 90% compared to enterprise solutions.</span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(123,58,180,0.15)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-white/70">
                Firebase Dynamic Links is shutting down. Switch to the free alternative today.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-6 h-auto text-base font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:scale-105">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { CompareSection }




