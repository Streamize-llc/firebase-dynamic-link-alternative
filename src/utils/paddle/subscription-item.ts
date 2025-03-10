import { type Environments } from '@paddle/paddle-js';

// 플랜 타입과 결제 주기 타입 정의
export type PlanType = 'standard' | 'premium';
export type BillingCycle = 'monthly' | 'yearly';

// 프로덕션 환경의 가격 ID
const PRODUCTION_PRICE_IDS = {
  standard: {
    monthly: 'pri_01jnwrgzb9edpezmrfv1wvp8a7',
    yearly: 'pri_01jnwrj8tapkvcvx07qry11mjf'
  },
  premium: {
    monthly: 'pri_01jnwrjkd7fy8xvz9qmr6h3qnp',
    yearly: 'pri_01jnwrjxkpj7aqt5d8qnm3z4vr'
  }
} as const;

// 샌드박스 환경의 가격 ID
const SANDBOX_PRICE_IDS = {
  standard: {
    monthly: 'pri_01jnwrgzb9edpezmrfv1wvp8a7',
    yearly: 'pri_01jnwrj8tapkvcvx07qry11mjf'
  },
  premium: {
    monthly: 'pri_sandbox_monthly_premium',
    yearly: 'pri_sandbox_yearly_premium'
  }
} as const;

/**
 * 구독 플랜의 가격 ID를 반환하는 함수
 * @param billingCycle 결제 주기 ('monthly' | 'yearly')
 * @param planType 플랜 유형 ('standard' | 'premium')
 * @returns 해당 플랜과 결제 주기에 맞는 Paddle 가격 ID
 */
export function getSubscriptionPriceId(
  billingCycle: BillingCycle,
  planType: PlanType
): string {
  // 현재 환경 확인
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENV as Environments;
  const isSandbox = environment === 'sandbox';

  // 환경에 따라 적절한 가격 ID 반환
  return isSandbox 
    ? SANDBOX_PRICE_IDS[planType][billingCycle]
    : PRODUCTION_PRICE_IDS[planType][billingCycle];
}

/**
 * 가격 ID를 기반으로 구독 정보를 반환하는 함수
 * @param priceId Paddle 가격 ID
 * @returns 구독 정보 객체 (환경, 플랜 유형, 결제 주기)
 */
export function getSubscriptionInfoFromPriceId(priceId: string): {
  environment: 'production' | 'sandbox';
  planType: PlanType | 'unknown';
  billingCycle: BillingCycle | 'unknown';
} {
  // 모든 가격 ID를 순회하며 일치하는 정보 찾기
  for (const planType in PRODUCTION_PRICE_IDS) {
    for (const cycle in PRODUCTION_PRICE_IDS[planType as PlanType]) {
      if (PRODUCTION_PRICE_IDS[planType as PlanType][cycle as BillingCycle] === priceId) {
        return {
          environment: 'production',
          planType: planType as PlanType,
          billingCycle: cycle as BillingCycle
        };
      }
    }
  }

  for (const planType in SANDBOX_PRICE_IDS) {
    for (const cycle in SANDBOX_PRICE_IDS[planType as PlanType]) {
      if (SANDBOX_PRICE_IDS[planType as PlanType][cycle as BillingCycle] === priceId) {
        return {
          environment: 'sandbox',
          planType: planType as PlanType,
          billingCycle: cycle as BillingCycle
        };
      }
    }
  }

  // 일치하는 가격 ID가 없는 경우
  return {
    environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox' ? 'sandbox' : 'production',
    planType: 'unknown',
    billingCycle: 'unknown'
  };
}
