// Deeplink 관련 타입 정의 및 Type Guard

export interface AndroidParameters {
  package_name: string;
  action?: string;
  fallback_url?: string;
}

export interface IOSParameters {
  app_store_id: string;
  bundle_id: string;
}

export interface SocialMeta {
  title?: string;
  description?: string;
  thumbnail_url?: string;
}

export interface AppParams {
  [key: string]: any;
}

export interface Deeplink {
  workspace_id: string;
  slug: string;
  is_random_slug: boolean;
  app_params: AppParams | null;

  /**
   * @deprecated 더 이상 사용되지 않음. apps 테이블의 platform_data에서 실시간으로 조회.
   * DB 스키마 호환성을 위해 빈 객체로 저장됨.
   */
  ios_parameters: IOSParameters | null;

  /**
   * @deprecated 더 이상 사용되지 않음. apps 테이블의 platform_data에서 실시간으로 조회.
   * DB 스키마 호환성을 위해 빈 객체로 저장됨.
   */
  android_parameters: AndroidParameters | null;

  social_meta: SocialMeta | null;
  click_count: number;
  created_at: string;
  updated_at: string;
  source?: string | null;
}

// ========================================
// Type Guard 함수들
// ========================================

/**
 * Android 파라미터 타입 검증
 */
export function isAndroidParameters(obj: any): obj is AndroidParameters {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.package_name === 'string' &&
    obj.package_name.length > 0 &&
    (obj.action === undefined || typeof obj.action === 'string') &&
    (obj.fallback_url === undefined || typeof obj.fallback_url === 'string')
  );
}

/**
 * iOS 파라미터 타입 검증
 */
export function isIOSParameters(obj: any): obj is IOSParameters {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.app_store_id === 'string' &&
    obj.app_store_id.length > 0 &&
    typeof obj.bundle_id === 'string' &&
    obj.bundle_id.length > 0
  );
}

/**
 * 소셜 메타 타입 검증
 */
export function isSocialMeta(obj: any): obj is SocialMeta {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj.title === undefined || typeof obj.title === 'string') &&
    (obj.description === undefined || typeof obj.description === 'string') &&
    (obj.thumbnail_url === undefined || typeof obj.thumbnail_url === 'string')
  );
}

/**
 * 딥링크 객체 전체 검증
 */
export function isDeeplink(obj: any): obj is Deeplink {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.workspace_id === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.is_random_slug === 'boolean' &&
    typeof obj.app_params === 'object' &&
    isIOSParameters(obj.ios_parameters) &&
    isAndroidParameters(obj.android_parameters) &&
    isSocialMeta(obj.social_meta)
  );
}
