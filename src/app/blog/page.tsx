import * as React from "react"
import Link from "next/link"
import { ArrowRight, Command, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "딥링크 기술의 최신 트렌드와 모바일 앱 성장 전략",
      excerpt: "모바일 앱 개발자들을 위한 최신 딥링크 기술 트렌드와 이를 활용한 사용자 경험 향상 방법에 대해 알아봅니다.",
      date: "2023년 12월 15일",
      category: "기술 트렌드",
      image: "https://gcp-cdn.shineai.app/temp/ee/2025-02-14/e5d89715-3a29-4fc7-93f2-16e50af63552.jpg"
    },
    {
      id: 2,
      title: "Firebase Dynamic Links 대안으로서의 Depl 활용 사례",
      excerpt: "Firebase Dynamic Links의 한계를 극복하고 더 나은 딥링크 솔루션을 찾는 기업들의 Depl 도입 사례를 소개합니다.",
      date: "2024년 1월 22일",
      category: "사례 연구",
      image: "https://gcp-cdn.shineai.app/temp/ee/2025-02-14/e5d89715-3a29-4fc7-93f2-16e50af63552.jpg"
    },
    {
      id: 3,
      title: "모바일 앱 마케팅: 딥링크를 활용한 전환율 최적화",
      excerpt: "효과적인 딥링크 전략을 통해 모바일 앱 마케팅 캠페인의 전환율을 높이는 방법에 대해 알아봅니다.",
      date: "2024년 2월 8일",
      category: "마케팅",
      image: "https://gcp-cdn.shineai.app/temp/ee/2025-02-14/e5d89715-3a29-4fc7-93f2-16e50af63552.jpg"
    },
    {
      id: 4,
      title: "커스텀 도메인으로 브랜드 인지도 높이기",
      excerpt: "딥링크에 커스텀 도메인을 사용하여 브랜드 인지도를 높이고 사용자 신뢰를 구축하는 전략을 소개합니다.",
      date: "2024년 2월 28일",
      category: "브랜딩",
      image: "https://gcp-cdn.shineai.app/temp/ee/2025-02-14/e5d89715-3a29-4fc7-93f2-16e50af63552.jpg"
    },
  ]

  return (
    <div className="relative bg-black text-white min-h-screen">
      {/* 배경 그라데이션 효과 */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 blur-3xl"
      />
      
      {/* 움직이는 장식 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-white/10 rounded-full animate-[spin_28s_linear_infinite]" />
        <div className="absolute bottom-1/3 left-1/5 w-72 h-72 border border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
      </div>
      
      {/* 헤더 */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            <a
              href="/"
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
                    href={item === "Blog" ? "/blog" : `/${item.toLowerCase()}`}
                    className={`text-sm ${item === "Blog" ? "text-white" : "text-white/70 hover:text-white"} transition-colors relative group`}
                  >
                    {item}
                    <span
                      className={`absolute -bottom-1 left-0 ${item === "Blog" ? "w-full" : "w-2"} h-px bg-purple-500/50 
                      transition-all group-hover:w-full`}
                    />
                  </a>
                )
              )}
              <Button
                className="h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white 
                transition-colors"
              >
                로그인
              </Button>
            </div>

            <div className="md:hidden">
              <Menu className="h-5 w-5" />
            </div>
          </div>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-10 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Depl 블로그
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight leading-[1.2]">
            딥링크와 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">모바일 앱 성장</span>에 대한 인사이트
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            모바일 앱 개발, 마케팅, 그리고 사용자 경험 향상을 위한 최신 정보와 전략을 공유합니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group hover:translate-y-[-8px]">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-white/70">
                      {post.category}
                    </span>
                    <span className="text-xs text-white/50">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                    {post.title}
                  </h3>
                  <p className="text-white/70 mb-4 line-clamp-2 text-sm">{post.excerpt}</p>
                  <Button 
                    variant="ghost" 
                    className="group text-white/80 hover:text-white border-t border-white/5 pt-3 px-0 text-sm"
                  >
                    더 읽기
                    <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            variant="outline" 
            className="border-white/10 text-white hover:bg-white/5 hover:text-white"
          >
            더 많은 글 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
