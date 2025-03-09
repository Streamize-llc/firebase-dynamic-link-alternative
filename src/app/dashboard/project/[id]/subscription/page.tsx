"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getCurrentLanguage } from "@/utils/action/client"
import { type Environments, initializePaddle, type Paddle } from '@paddle/paddle-js';
import type { CheckoutEventsData } from '@paddle/paddle-js/types/checkout/events';
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/utils/supabase/provider";

export default function SubscriptionPage() {
  const { user, profile } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paddle, setPaddle] = useState<Paddle | null>(null)
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(null);
  const router = useRouter()
  const params = useParams()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const projectId = params.id as string
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setLang(getCurrentLanguage())
  }, [])

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };
  
  useEffect(() => {
    if (!paddle?.Initialized && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
        eventCallback: (event) => {
          if (event.data && event.name) {
            console.log('event_callback', event.data, event.name)
            handleCheckoutEvents(event.data);
          }
        },
        checkout: {
          settings: {
            variant: 'one-page',
            displayMode: 'overlay',
            theme: 'light',
            allowLogout: false,
            successUrl: '/checkout/success',
          },
        }
      }).then(async (paddle) => {
        if (paddle) {
          setPaddle(paddle)
        }
      })
    }
  }, [paddle?.Initialized])

  const onPressSubscribe = (planName: string) => {
    if (!paddle?.Initialized) {
      console.log('paddle_not_initialized')
      return;
    }

    // 요금제 ID 설정
    let priceId = '';
    
    if (planName === 'standard') {
      if (billingCycle === 'monthly') {
        priceId = 'pri_01jnwrgzb9edpezmrfv1wvp8a7';
      } else if (billingCycle === 'yearly') {
        priceId = 'pri_01jnwrj8tapkvcvx07qry11mjf';
      }
    }

    paddle.Checkout.open({
      ...(user?.email && { customer: { 
        email: user?.email 
      }}),
      items: [{ priceId: priceId, quantity: 1 }],
      customData: {
        userId: profile?.id
      }
    })
  }

  const translations = {
    ko: {
      title: "구독 플랜",
      subtitle: "프로젝트에 맞는 최적의 구독 플랜을 선택하세요",
      loading: "구독 정보를 불러오는 중...",
      monthly: "월간",
      yearly: "연간",
      save: "저장",
      free: {
        title: "무료",
        price: "₩0",
        yearlyPrice: "₩0",
        description: "개인 및 소규모 프로젝트를 위한 무료 플랜",
        features: [
          "월 1,000 딥링크 요청",
          "기본 분석 기능",
          "커뮤니티 지원"
        ]
      },
      pro: {
        title: "프로",
        price: "₩29,900",
        yearlyPrice: "₩299,000",
        description: "성장하는 비즈니스를 위한 고급 기능",
        features: [
          "월 50,000 딥링크 요청",
          "고급 분석 및 보고서",
          "우선 지원",
          "API 액세스"
        ]
      },
      enterprise: {
        title: "엔터프라이즈",
        price: "문의 요망",
        yearlyPrice: "문의 요망",
        description: "대규모 비즈니스를 위한 맞춤형 솔루션",
        features: [
          "무제한 딥링크 요청",
          "전용 계정 관리자",
          "SLA 보장",
          "맞춤형 통합 지원"
        ]
      },
      subscribe: "구독하기",
      contact: "문의하기",
      current: "현재 플랜",
      startFree: "무료로 시작하기"
    },
    en: {
      title: "Subscription Plans",
      subtitle: "Choose the best subscription plan for your project",
      loading: "Loading subscription information...",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save",
      free: {
        title: "Free",
        price: "$0",
        yearlyPrice: "$0",
        description: "For individuals and small projects",
        features: [
          "1,000 deeplink requests per month",
          "Basic analytics",
          "Community support"
        ]
      },
      pro: {
        title: "Pro",
        price: "$29.99",
        yearlyPrice: "$299.99",
        description: "Advanced features for growing businesses",
        features: [
          "50,000 deeplink requests per month",
          "Advanced analytics and reporting",
          "Priority support",
          "API access"
        ]
      },
      enterprise: {
        title: "Enterprise",
        price: "Contact us",
        yearlyPrice: "Contact us",
        description: "Custom solutions for large businesses",
        features: [
          "Unlimited deeplink requests",
          "Dedicated account manager",
          "SLA guarantees",
          "Custom integration support"
        ]
      },
      subscribe: "Subscribe",
      contact: "Contact Us",
      current: "Current Plan",
      startFree: "Start for Free"
    },
    ja: {
      title: "サブスクリプションプラン",
      subtitle: "プロジェクトに最適なサブスクリプションプランを選択してください",
      loading: "サブスクリプション情報を読み込み中...",
      monthly: "月額",
      yearly: "年額",
      save: "保存",
      free: {
        title: "無料",
        price: "¥0",
        yearlyPrice: "¥0",
        description: "個人や小規模プロジェクト向け",
        features: [
          "月1,000ディープリンクリクエスト",
          "基本的な分析機能",
          "コミュニティサポート"
        ]
      },
      pro: {
        title: "プロ",
        price: "¥2,990",
        yearlyPrice: "¥29,900",
        description: "成長するビジネス向けの高度な機能",
        features: [
          "月50,000ディープリンクリクエスト",
          "高度な分析とレポート",
          "優先サポート",
          "APIアクセス"
        ]
      },
      enterprise: {
        title: "エンタープライズ",
        price: "お問い合わせください",
        yearlyPrice: "お問い合わせください",
        description: "大規模ビジネス向けのカスタムソリューション",
        features: [
          "無制限のディープリンクリクエスト",
          "専任アカウントマネージャー",
          "SLA保証",
          "カスタム統合サポート"
        ]
      },
      subscribe: "購読する",
      contact: "お問い合わせ",
      current: "現在のプラン",
      startFree: "無料で始める"
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  useEffect(() => {
    // 구독 정보 로드 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      // 무료 플랜 선택 처리
      try {
        // 여기서 무료 플랜 등록 API 호출
        // 예: await registerFreePlan(projectId);
        router.push(`/dashboard/project/${projectId}`);
      } catch (error) {
        console.error('무료 플랜 등록 중 오류:', error);
      }
      return;
    }
    
    if (planId === 'enterprise') {
      // 엔터프라이즈 플랜은 문의 페이지로 이동
      router.push(`/dashboard/project/${projectId}/contact`);
      return;
    }

    try {
      // 실제 구현에서는 서버에서 결제 처리를 해야 함
      // 예시 코드일 뿐, 실제 구현은 다를 수 있음
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          planId,
          billingCycle
        }),
      });
      
      if (response.ok) {
        router.push(`/dashboard/project/${projectId}`);
      }
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-6 py-16">
      {/* <div className={'paddle-checkout-frame flex justify-center items-center bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto'} /> */}

      <div className="w-full max-w-7xl flex flex-col items-center">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{t.title}</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 p-1.5 rounded-full flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === 'monthly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-full text-sm font-medium flex items-center transition-all duration-300 ${
                billingCycle === 'yearly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {t.yearly}
              <span className="ml-2 bg-green-500 text-xs px-2 py-0.5 rounded-full font-bold">
                {t.save} 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          {/* 무료 플랜 */}
          <div className="border border-gray-800 rounded-xl p-8 bg-gray-900 shadow-lg hover:border-emerald-900/50 transition-all duration-300 flex flex-col items-center text-center">
            <div className="mb-8 w-full">
              <h2 className="text-2xl font-bold text-white mb-3">{t.free.title}</h2>
              <div className="flex items-end justify-center mb-3">
                <span className="text-5xl font-bold text-white">
                  {t.free.price}
                </span>
                <span className="text-gray-400 ml-2 mb-1">
                  /{billingCycle === 'monthly' ? t.monthly.toLowerCase() : t.yearly.toLowerCase()}
                </span>
              </div>
              <p className="text-gray-400">{t.free.description}</p>
            </div>
            
            <div className="mb-auto w-full">
              <ul className="space-y-4">
                {t.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start justify-center">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-900/30 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={() => onPressSubscribe('free')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-all duration-300 mt-10"
            >
              {t.startFree}
            </Button>
          </div>

          {/* 프로 플랜 */}
          <div className="border border-blue-600/50 rounded-xl p-8 bg-gray-900 shadow-lg transition-all duration-300 relative flex flex-col items-center text-center">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              {t.current}
            </div>
            
            <div className="mb-8 mt-2 w-full">
              <h2 className="text-2xl font-bold text-white mb-3">{t.pro.title}</h2>
              <div className="flex items-end justify-center mb-3">
                <span className="text-5xl font-bold text-white">
                  {billingCycle === 'monthly' ? t.pro.price : t.pro.yearlyPrice}
                </span>
                <span className="text-gray-400 ml-2 mb-1">
                  /{billingCycle === 'monthly' ? t.monthly.toLowerCase() : t.yearly.toLowerCase()}
                </span>
              </div>
              <p className="text-gray-400">{t.pro.description}</p>
            </div>
            
            <div className="mb-auto w-full">
              <ul className="space-y-4">
                {t.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start justify-center">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={() => onPressSubscribe('standard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 mt-10"
            >
              {t.subscribe}
            </Button>
          </div>

          {/* 엔터프라이즈 플랜 */}
          <div className="border border-gray-800 rounded-xl p-8 bg-gray-900 shadow-lg hover:border-purple-900/50 transition-all duration-300 flex flex-col items-center text-center">
            <div className="mb-8 w-full">
              <h2 className="text-2xl font-bold text-white mb-3">{t.enterprise.title}</h2>
              <div className="flex items-end justify-center mb-3">
                <span className="text-3xl font-bold text-white">
                  {t.enterprise.price}
                </span>
              </div>
              <p className="text-gray-400">{t.enterprise.description}</p>
            </div>
            
            <div className="mb-auto w-full">
              <ul className="space-y-4">
                {t.enterprise.features.map((feature, index) => (
                  <li key={index} className="flex items-start justify-center">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={() => onPressSubscribe('enterprise')}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium transition-all duration-300 mt-10"
            >
              {t.contact}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}




