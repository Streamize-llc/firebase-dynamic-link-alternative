"use client"

import * as React from "react"
import { ArrowRight, Globe, BarChart2, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"


function FunctionsSection() {
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

  const features = [
    {
      icon: <Globe className="h-10 w-10 text-purple-500" />,
      title: "Custom Deeplink Domain",
      description: "Create deeplinks using your own branded domain. Enhance user experience and boost brand recognition with personalized links.",
      cta: "Set Up Domain"
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-blue-500" />,
      title: "Traffic Analytics",
      description: "Monitor your deeplink performance in real-time with detailed analytics dashboard. Gain insights into click-through rates, conversions, and user behavior.",
      cta: "Explore Analytics"
    },
    {
      icon: <Smartphone className="h-10 w-10 text-green-500" />,
      title: "Mobile Deeplink Pages",
      description: "Create customized mobile landing pages for users without your app installed. Drive app installations and optimize user experience seamlessly.",
      cta: "Create Pages"
    }
  ]

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* 배경 그라데이션 효과 - hero-modern과 일관성 유지 */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 blur-3xl"
        style={{
          transform: `translate(${(mousePosition.x - 0.5) * 20}%, ${
            (mousePosition.y - 0.5) * 20
          }%)`,
        }}
      />
      
      {/* 움직이는 장식 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-white/10 rounded-full animate-[spin_28s_linear_infinite]" />
        <div className="absolute bottom-1/3 left-1/5 w-72 h-72 border border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Firebase Dynamic Links Alternative
            </span>
          </div>
          <h2 className="text-5xl font-bold mb-6 tracking-tight leading-[1.2]">
            Powerful Deeplink <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Features</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            A Firebase alternative with more features and unlimited usage
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:border-purple-500/30 transition-all duration-300 group hover:translate-y-[-8px]"
            >
              {/* 아이콘 배경 */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 inline-block">
                {feature.icon}
              </div>
              
              {/* 텍스트 콘텐츠 */}
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/70 mb-8 leading-relaxed">{feature.description}</p>
              
              {/* 버튼 */}
              <Button 
                variant="ghost" 
                className="group text-white/80 hover:text-white border-t border-white/5 pt-4"
              >
                {feature.cta}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { FunctionsSection }
