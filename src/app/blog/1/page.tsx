import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Command, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPostPage() {
  const post = {
    id: 1,
    title: "Firebase DynamicLink Alternative",
    excerpt: "Exploring how to migrate from Firebase DynamicLinks for free before they expire on August 25, 2025. This guide provides step-by-step instructions and best practices for a seamless transition.",
    date: "2023년 12월 15일",
    category: "기술 트렌드",
    image: "https://gcp-cdn.shineai.app/temp/ee/2025-02-14/e5d89715-3a29-4fc7-93f2-16e50af63552.jpg",
    content: [
      {
        type: "paragraph",
        text: "모바일 앱 시장이 계속해서 성장함에 따라, 사용자 경험을 향상시키고 앱 내 전환율을 높이는 기술에 대한 관심이 높아지고 있습니다. 그 중에서도 딥링크(Deeplink) 기술은 모바일 앱 개발자와 마케터에게 필수적인 도구로 자리 잡았습니다."
      },
      {
        type: "heading",
        text: "딥링크란 무엇인가?"
      },
      {
        type: "paragraph",
        text: "딥링크는 모바일 앱의 특정 화면이나 콘텐츠로 직접 연결되는 URL입니다. 웹사이트의 특정 페이지로 연결되는 하이퍼링크와 유사하게, 딥링크는 사용자를 앱 내의 특정 위치로 안내합니다. 이는 사용자 경험을 크게 향상시키고, 마케팅 캠페인의 효과를 높이는 데 중요한 역할을 합니다."
      },
      {
        type: "heading",
        text: "2024년 딥링크 기술 트렌드"
      },
      {
        type: "paragraph",
        text: "최근 딥링크 기술은 다음과 같은 방향으로 발전하고 있습니다:"
      },
      {
        type: "list",
        items: [
          "앱 클립과의 통합: iOS의 앱 클립과 안드로이드의 인스턴트 앱과 같은 기술과 딥링크를 결합하여 앱을 설치하지 않고도 핵심 기능을 경험할 수 있게 합니다.",
          "개인화된 사용자 경험: 사용자의 행동 데이터와 딥링크를 결합하여 더욱 맞춤화된 경험을 제공합니다.",
          "크로스 플랫폼 지원 강화: 다양한 플랫폼과 기기에서 일관된 딥링크 경험을 제공하는 솔루션이 중요해지고 있습니다.",
          "프라이버시 중심 접근: 개인정보 보호 규제가 강화됨에 따라, 사용자 데이터를 존중하면서도 효과적인 딥링크 전략을 구현하는 방법이 중요해졌습니다."
        ]
      },
      {
        type: "heading",
        text: "딥링크를 활용한 모바일 앱 성장 전략"
      },
      {
        type: "paragraph",
        text: "딥링크는 단순한 기술적 도구를 넘어 전략적인 성장 도구로 활용될 수 있습니다:"
      },
      {
        type: "list",
        items: [
          "사용자 온보딩 최적화: 새로운 사용자가 앱을 처음 열었을 때 관련성 높은 콘텐츠로 바로 안내하여 이탈률을 줄입니다.",
          "리인게이지먼트 캠페인: 비활성 사용자를 다시 앱으로 유도하는 맞춤형 메시지와 딥링크를 결합합니다.",
          "소셜 미디어 마케팅: 소셜 미디어 포스트에 딥링크를 포함시켜 사용자가 관련 콘텐츠로 바로 이동할 수 있게 합니다.",
          "QR 코드 활용: 오프라인 마케팅 자료에 QR 코드와 딥링크를 결합하여 온-오프라인 경험을 연결합니다."
        ]
      },
      {
        type: "heading",
        text: "Firebase Dynamic Links의 한계와 대안"
      },
      {
        type: "paragraph",
        text: "많은 개발자들이 Firebase Dynamic Links를 딥링크 솔루션으로 사용해왔지만, 최근에는 몇 가지 한계점이 드러나고 있습니다. 특히 커스텀 도메인 설정의 복잡성, 분석 기능의 제한, 그리고 대규모 사용 시 비용 문제가 주요 한계로 지적됩니다. 이러한 한계를 극복하기 위해 Depl과 같은 대안 솔루션이 주목받고 있으며, 더 유연한 커스터마이징과 확장성을 제공합니다."
      },
      {
        type: "heading",
        text: "결론"
      },
      {
        type: "paragraph",
        text: "딥링크 기술은 모바일 앱 생태계에서 계속해서 중요한 역할을 할 것입니다. 개발자와 마케터는 최신 트렌드를 파악하고, 사용자 경험과 프라이버시를 모두 고려한 전략을 수립해야 합니다. 적절한 딥링크 솔루션을 선택하고 효과적으로 구현함으로써, 앱의 사용자 경험을 향상시키고 비즈니스 목표를 달성할 수 있을 것입니다."
      }
    ],
    relatedPosts: [
      {
        id: 2,
        title: "Firebase Dynamic Links 대안으로서의 Depl 활용 사례",
        category: "사례 연구"
      },
      {
        id: 3,
        title: "모바일 앱 마케팅: 딥링크를 활용한 전환율 최적화",
        category: "마케팅"
      }
    ]
  }

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
          </div>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-24 relative z-10">
        {/* 뒤로 가기 버튼 */}
        <Link href="/blog">
          <Button 
            variant="ghost" 
            className="mb-8 text-white/70 hover:text-white group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            블로그로 돌아가기
          </Button>
        </Link>
        
        {/* 블로그 포스트 헤더 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/10 text-white/70 flex items-center gap-2">
              <Tag className="h-3.5 w-3.5" />
              {post.category}
            </span>
            <span className="text-sm text-white/50 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.2]">
            {post.title}
          </h1>
          
          <p className="text-xl text-white/70 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        
        {/* 메인 이미지 */}
        <div className="mb-12 rounded-xl overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto"
          />
        </div>
        
        {/* 블로그 콘텐츠 */}
        <div className="prose prose-invert prose-lg max-w-none">
          {post.content.map((block, index) => {
            if (block.type === 'paragraph') {
              return <p key={index} className="text-white/80 mb-6 leading-relaxed">{block.text}</p>
            } else if (block.type === 'heading') {
              return <h2 key={index} className="text-2xl font-bold mt-10 mb-6">{block.text}</h2>
            } else if (block.type === 'list') {
              return (
                <ul key={index} className="mb-8 space-y-2">
                  {/* {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-white/80 pl-2 leading-relaxed">
                      • {item}
                    </li>
                  ))} */}
                </ul>
              )
            }
            return null
          })}
        </div>
        
        {/* 관련 글 */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <h3 className="text-2xl font-bold mb-8">관련 글</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {post.relatedPosts.map((relatedPost) => (
              <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 group hover:translate-y-[-4px]">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/70 mb-4 inline-block">
                    {relatedPost.category}
                  </span>
                  <h4 className="text-lg font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                    {relatedPost.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


