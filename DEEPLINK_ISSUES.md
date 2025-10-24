# Depl 딥링크 시스템 문제점 분석 및 해결 방안

## 🔴 심각 (Critical) - 즉시 수정 필요

### 1. 소셜 메타 태그가 전혀 표시되지 않음 ⚠️⚠️⚠️
**위치**: `src/app/link/[id]/page.tsx:139-175`

**문제**:
```typescript
export default async function AppLinkHandler({ params }: { params: Promise<{ id: string }> }) {
  // ...
  if (isAndroid) {
    return redirect(androidAppLink)  // ❌ HTML 렌더링 전에 즉시 리디렉션
  }

  if (isIOS) {
    return permanentRedirect(`https://apps.apple.com/...`)  // ❌ 즉시 리디렉션
  }
}
```

**영향**:
- `generateMetadata()`로 메타데이터를 생성하지만, **HTML에 렌더링되지 않음**
- Next.js의 `redirect()`는 서버에서 **HTTP 307/308 리디렉션을 즉시 반환**
- 응답 본문에 HTML이 없으므로 메타 태그도 없음
- **소셜 미디어 공유 시 썸네일, 제목, 설명이 전혀 표시되지 않음**
- Facebook, Twitter, KakaoTalk, Slack 등의 크롤러는 메타 태그를 볼 수 없음
- SEO에도 악영향

**테스트 방법**:
```bash
# 실제 HTML 응답 확인
curl -i https://myapp.depl.link/abc123

# 예상 결과: 307 Temporary Redirect (HTML 본문 없음)
HTTP/1.1 307 Temporary Redirect
Location: intent://...
```

**해결 방안**:

**방안 1: 중간 페이지 렌더링 + Client-side 리디렉션 (권장)**
```typescript
"use client";

import { useEffect } from 'react';

export default function AppLinkHandler({
  deeplink,
  userAgent
}: {
  deeplink: any;
  userAgent: string;
}) {
  useEffect(() => {
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    // 1초 후 리디렉션 (메타 태그 크롤링 시간 확보)
    setTimeout(() => {
      if (isAndroid) {
        window.location.href = createAndroidAppLink(...);
      } else if (isIOS) {
        window.location.href = `https://apps.apple.com/...`;
      }
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>{deeplink.social_meta.title}</h1>
      <p>Redirecting to app...</p>
      <div className="animate-spin">Loading...</div>
    </div>
  );
}
```

**방안 2: Meta Refresh 태그 사용**
```typescript
export default async function AppLinkHandler({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deeplink = await getDeepLinkUrl(id);
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  let redirectUrl = '';
  if (isAndroid) {
    redirectUrl = createAndroidAppLink(...);
  } else if (isIOS) {
    redirectUrl = `https://apps.apple.com/...`;
  }

  return (
    <>
      {redirectUrl && (
        <head>
          <meta httpEquiv="refresh" content={`1;url=${redirectUrl}`} />
        </head>
      )}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1>{deeplink.social_meta.title}</h1>
        <p>Redirecting to app...</p>
      </div>
    </>
  );
}
```

**방안 3: User-Agent 기반 분기 처리**
```typescript
export default async function AppLinkHandler({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deeplink = await getDeepLinkUrl(id);
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  // 소셜 크롤러 감지
  const isCrawler = /facebookexternalhit|Twitterbot|WhatsApp|Slackbot|KakaoTalkBot/i.test(userAgent);

  if (isCrawler) {
    // 크롤러에게는 HTML + 메타 태그 반환 (리디렉션 없음)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1>{deeplink.social_meta.title}</h1>
        <p>{deeplink.social_meta.description}</p>
        <img src={deeplink.social_meta.thumbnail_url} alt="Preview" />
      </div>
    );
  }

  // 일반 사용자는 리디렉션
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  if (isAndroid) {
    return redirect(createAndroidAppLink(...));
  }

  if (isIOS) {
    return permanentRedirect(`https://apps.apple.com/...`);
  }

  return <p>This link requires a mobile device...</p>;
}
```

**권장 조합**: 방안 1 (Client-side 리디렉션) + 방안 3 (크롤러 감지)
- 크롤러에게는 메타 태그 포함 HTML 제공
- 일반 사용자는 1초 후 자동 리디렉션
- 최상의 UX + SEO

---

### 2. shortCode 중복 체크 없음 ⚠️
**위치**: `src/app/api/deeplink/route.ts:253-267`

**문제**:
```typescript
const shortCode = generateRandomString(4)  // 중복 체크 없이 바로 INSERT
const { data: deeplink, error: deeplinkError } = await supabase
  .from('deeplinks')
  .insert({
    short_code: shortCode,
    // ...
  })
```

**영향**:
- 4글자 랜덤 문자열은 62^4 = **14,776,336개**의 조합
- 생일 역설(Birthday Paradox)에 따라 약 **4,000개**의 딥링크 생성 시 50% 확률로 충돌 발생
- 충돌 발생 시 데이터베이스 INSERT 실패 → 500 에러 반환
- 사용자는 "SERVER_ERROR" 메시지만 받고 재시도 불가

**해결 방안**:

**방안 1: 중복 체크 루프 (즉시 적용 가능)**
```typescript
// generateRandomString 호출 전
let shortCode: string;
let attempts = 0;
const MAX_ATTEMPTS = 10;

while (attempts < MAX_ATTEMPTS) {
  shortCode = generateRandomString(4);

  // 기존 shortCode 확인
  const { data: existing } = await supabase
    .from('deeplinks')
    .select('short_code')
    .eq('workspace_id', project.id)
    .eq('short_code', shortCode)
    .single();

  if (!existing) {
    break;  // 중복 없음, 사용 가능
  }

  attempts++;
}

if (attempts === MAX_ATTEMPTS) {
  return NextResponse.json(
    {
      error: {
        code: "SHORT_CODE_GENERATION_FAILED",
        message: "Failed to generate unique short code. Please try again."
      }
    },
    { status: 500 }
  );
}
```

**방안 2: shortCode 길이 증가 (권장)**
```typescript
const shortCode = generateRandomString(6);  // 62^6 = 56,800,235,584 조합
```
- 6글자: 약 200만 개 생성 시 50% 충돌 확률
- 충분한 확장성 확보

**방안 3: Unique Constraint + Retry Logic**
```typescript
// 데이터베이스에 UNIQUE constraint 추가
ALTER TABLE deeplinks ADD CONSTRAINT deeplinks_workspace_short_code_unique
  UNIQUE (workspace_id, short_code);

// 코드에서 재시도 로직 구현
for (let i = 0; i < 5; i++) {
  const shortCode = generateRandomString(4);
  const { error } = await supabase.from('deeplinks').insert({...});

  if (!error) break;
  if (error.code !== '23505') throw error;  // 23505 = unique violation
}
```

---

### 2. 클릭 추적 완전 미구현 ⚠️
**위치**: `src/app/link/[id]/page.tsx:139-175`

**문제**:
- `deeplinks.click_count` 필드는 존재하지만, `/link/[id]` 페이지에서 **증가 로직이 전혀 없음**
- 통계 기능(`getWorkspaceStats`)은 click_count를 집계하지만, 실제 값은 항상 0

**증거**:
```bash
$ grep -r "click_count.*increment\|UPDATE.*click" src/
# 결과 없음 → 클릭 수 증가 코드가 전혀 없음
```

**영향**:
- 대시보드의 모든 통계가 부정확함
- "총 클릭 수", "오늘의 클릭 수", "링크당 평균" 모두 0으로 표시
- 비즈니스 인사이트 완전 불가능

**해결 방안**:

**방안 1: Server Action으로 클릭 수 증가**
```typescript
// src/utils/action/server.ts
"use server";

export async function incrementDeeplinkClick(workspaceId: string, shortCode: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc('increment_click_count', {
    p_workspace_id: workspaceId,
    p_short_code: shortCode
  });

  if (error) {
    console.error('Failed to increment click count:', error);
  }
}
```

```sql
-- Supabase에 함수 생성 (migration)
CREATE OR REPLACE FUNCTION increment_click_count(
  p_workspace_id UUID,
  p_short_code VARCHAR
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE deeplinks
  SET
    click_count = click_count + 1,
    updated_at = NOW()
  WHERE workspace_id = p_workspace_id
    AND short_code = p_short_code;
END;
$$;
```

```typescript
// src/app/link/[id]/page.tsx
export default async function AppLinkHandler({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deeplink = await getDeepLinkUrl(id);

  if (!deeplink) {
    return null;
  }

  // 클릭 수 증가 (비동기, 에러 무시)
  incrementDeeplinkClick(deeplink.workspace_id, id).catch(console.error);

  // 기존 리디렉션 로직...
}
```

**방안 2: API Route로 클릭 이벤트 전송 (추천)**
```typescript
// src/app/api/track-click/route.ts
export async function POST(request: Request) {
  const { workspace_id, short_code } = await request.json();

  const supabase = await createClient();
  await supabase.rpc('increment_click_count', {
    p_workspace_id: workspace_id,
    p_short_code: short_code
  });

  return NextResponse.json({ success: true });
}
```

```typescript
// src/app/link/[id]/page.tsx
// Client-side에서 비동기 호출 (페이지 로드 후)
"use client";
useEffect(() => {
  fetch('/api/track-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id, short_code })
  });
}, []);
```

---

### 3. iOS Universal Link 미완성 (TODO 주석 존재) ⚠️
**위치**: `src/app/link/[id]/page.tsx:166-170`

**문제**:
```typescript
if (isIOS) {
  // TODO : 아이폰 앱 정보 가져오기
  const iosParams = deeplink.ios_parameters as unknown as IOSParameters;
  return permanentRedirect(`https://apps.apple.com/KR/app/id${iosParams.app_store_id}?mt=8`)
}
```

**현재 동작**:
- iOS 디바이스에서 딥링크 클릭 → **무조건 App Store로 이동**
- 앱이 설치되어 있어도 앱이 실행되지 않음
- `app_params` (딥링크 파라미터)가 앱에 전달되지 않음

**영향**:
- iOS에서 딥링크 기능이 사실상 작동하지 않음
- "Firebase Dynamic Links 대안"이라는 핵심 가치 제안이 무의미함
- Android만 정상 작동

**해결 방안**:

**1단계: Universal Link URL로 리디렉션 (즉시 적용 가능)**
```typescript
if (isIOS) {
  const iosParams = deeplink.ios_parameters as unknown as IOSParameters;
  const host = headersList.get('host') || '';
  const subdomain = host.split('.')[0];

  // Universal Link URL 구성 (앱이 설치되어 있으면 앱 실행)
  const universalLinkUrl = `https://${subdomain}.depl.link/${id}`;

  // app_params를 쿼리 스트링으로 변환
  const appParams = deeplink.app_params as Record<string, any>;
  const queryString = new URLSearchParams(appParams).toString();
  const finalUrl = queryString ? `${universalLinkUrl}?${queryString}` : universalLinkUrl;

  // 앱이 설치되어 있으면 앱 실행, 없으면 App Store로 fallback (iOS가 자동 처리)
  return permanentRedirect(finalUrl);
}
```

**2단계: iOS 앱에서 Universal Link 처리**
```swift
// iOS 앱의 AppDelegate.swift 또는 SceneDelegate.swift
func application(_ application: UIApplication,
                 continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {

    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
        return false
    }

    // URL에서 short_code 추출
    let shortCode = url.lastPathComponent

    // 쿼리 파라미터 파싱 (app_params)
    let components = URLComponents(url: url, resolvingAgainstBaseURL: true)
    let params = components?.queryItems?.reduce(into: [String: String]()) {
        $0[$1.name] = $1.value
    }

    // 딥링크 처리 로직 (화면 이동)
    handleDeepLink(shortCode: shortCode, params: params)

    return true
}
```

**3단계: Fallback 메타 태그 추가**
```typescript
// src/app/link/[id]/page.tsx - generateMetadata()
return {
  // 기존 메타데이터...
  other: {
    // iOS Smart App Banner (앱 설치 유도)
    'apple-itunes-app': `app-id=${iosParams.app_store_id}`
  }
}
```

**주의**:
- Universal Link가 작동하려면 `.well-known/apple-app-site-association` 파일이 정확해야 함
- 현재 구현(`src/app/api/apple-app-site-association/route.ts`)은 정상적으로 보임
- iOS 앱에서 Associated Domains Entitlement 설정 필요

---

## 🟡 중요 (High) - 빠른 수정 권장

### 4. shortCode 생성 시 workspace_id 검증 누락
**위치**: `src/app/link/[id]/page.tsx:118-131`

**문제**:
```typescript
async function getDeepLinkUrl(id: string) {
  const supabase = await createClient();
  const { data: deeplink, error } = await supabase
    .from('deeplinks')
    .select('*')
    .eq('short_code', id)  // ❌ workspace_id 검증 없음
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return deeplink;
}
```

**영향**:
- 다른 워크스페이스의 shortCode와 충돌 가능
- 예: workspace A의 "aB3x"와 workspace B의 "aB3x"가 동시에 존재 시, `.single()` 호출 실패
- 에러 발생 시 null 반환 → 사용자는 빈 페이지만 보게 됨

**현재 상황 분석**:
- 미들웨어에서 서브도메인을 추출하지만, `/link/[id]` 페이지에 전달하지 않음
- 페이지는 short_code만 받아서 조회
- **Primary Key가 (workspace_id, short_code)라면 정상 작동하지만, schema.type.ts에서는 명시되지 않음**

**해결 방안**:

**방안 1: 서브도메인 기반 workspace 조회 추가**
```typescript
async function getDeepLinkUrl(id: string, host: string) {
  const supabase = await createClient();
  const isProd = process.env.NODE_ENV === 'production';
  const subdomain = isProd ? host.split('.')[0] : 'test';

  // 1. 서브도메인으로 workspace 조회
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('sub_domain', subdomain)
    .single();

  if (!workspace) {
    return null;
  }

  // 2. workspace_id + short_code로 딥링크 조회
  const { data: deeplink } = await supabase
    .from('deeplinks')
    .select('*')
    .eq('workspace_id', workspace.id)
    .eq('short_code', id)
    .single();

  return deeplink;
}

// 호출 시
const host = headersList.get('host') || '';
const deeplink = await getDeepLinkUrl(id, host);
```

**방안 2: Primary Key를 short_code 단일 컬럼으로 변경 (권장)**
```sql
-- Migration: deeplinks 테이블 PK 변경
ALTER TABLE deeplinks DROP CONSTRAINT deeplinks_pkey;
ALTER TABLE deeplinks ADD PRIMARY KEY (short_code);

-- workspace_id는 Foreign Key로 유지
ALTER TABLE deeplinks ADD CONSTRAINT deeplinks_workspace_id_fkey
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id);
```
- short_code는 전역적으로 고유해야 딥링크 URL이 간결해짐
- 현재 generateRandomString(4)로는 부족하므로 6~8글자로 증가 필요

---

### 5. Android Intent URL의 fallback_url 중복 정의
**위치**: `src/app/link/[id]/page.tsx:155-163`

**문제**:
```typescript
if (isAndroid) {
  const deepLinkUrl = `${normalizedSubdomain}.depl.link/${id}`;
  const androidParams = deeplink.android_parameters as unknown as AndroidParameters;
  const androidAppLink = createAndroidAppLink(
    androidParams.package_name,
    `https://play.google.com/store/apps/details?id=${androidParams.package_name}`,  // ✅ 올바름
    deepLinkUrl
  )
  return redirect(androidAppLink)
}
```

**현재 상황**:
- `android_parameters`에 이미 `fallback_url`이 저장되어 있음 (API 생성 시)
- 하지만 리디렉션 시 하드코딩된 Play Store URL 사용

**잠재적 문제**:
- 향후 커스텀 fallback URL 지원 시 불일치 발생 가능
- 예: 프로모션 랜딩 페이지로 fallback하고 싶은 경우

**해결 방안**:
```typescript
if (isAndroid) {
  const deepLinkUrl = `${normalizedSubdomain}.depl.link/${id}`;
  const androidParams = deeplink.android_parameters as unknown as AndroidParameters;

  // android_parameters에서 fallback_url 사용
  const fallbackUrl = androidParams.fallback_url ||
    `https://play.google.com/store/apps/details?id=${androidParams.package_name}`;

  const androidAppLink = createAndroidAppLink(
    androidParams.package_name,
    fallbackUrl,
    deepLinkUrl
  );

  return redirect(androidAppLink);
}
```

---

### 6. 딥링크 생성 시 중복 slug 허용
**위치**: `src/app/api/deeplink/route.ts:256-267`

**문제**:
```typescript
const { data: deeplink, error: deeplinkError } = await supabase
  .from('deeplinks')
  .insert({
    slug: body.slug,  // ❌ 중복 체크 없음
    short_code: shortCode,
    // ...
  })
```

**영향**:
- 같은 workspace에서 동일한 `slug`로 여러 딥링크 생성 가능
- 예: "product-detail" slug가 10개 존재 → 어떤 것이 최신인지 불명확
- API 사용자가 slug로 딥링크를 조회하려 할 때 혼란

**해결 방안**:

**방안 1: Unique Constraint 추가 (권장)**
```sql
ALTER TABLE deeplinks
  ADD CONSTRAINT deeplinks_workspace_slug_unique
  UNIQUE (workspace_id, slug);
```

**방안 2: 중복 시 업데이트 (Upsert)**
```typescript
// 기존 slug가 있으면 업데이트, 없으면 생성
const { data: existing } = await supabase
  .from('deeplinks')
  .select('short_code')
  .eq('workspace_id', project.id)
  .eq('slug', body.slug)
  .single();

if (existing) {
  // 기존 딥링크 업데이트
  await supabase
    .from('deeplinks')
    .update({
      app_params: body.app_params,
      social_meta: socialMeta,
      updated_at: new Date().toISOString()
    })
    .eq('workspace_id', project.id)
    .eq('slug', body.slug);

  return NextResponse.json({
    success: true,
    deeplink_url: `https://${project.sub_domain}.depl.link/${existing.short_code}`,
    updated: true
  });
} else {
  // 새로운 딥링크 생성
  // 기존 로직...
}
```

---

### 7. AASA/DAL 파일의 에러 처리 부족
**위치**:
- `src/app/api/apple-app-site-association/route.ts:52-57`
- `src/app/api/assetlinks/route.ts:51-56`

**문제 (AASA)**:
```typescript
if (projectError) {
  return NextResponse.json(
    { error: 'Subdomain not found.' },
    { status: 404 }
  );
}
```

**문제 (DAL)**:
```typescript
if (projectError) {
  return NextResponse.json(
    { error: 'Subdomain not found.' },
    { status: 404 }
  );
}

// ...

} catch (error) {
  return NextResponse.json([], {  // ❌ 빈 배열 반환
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

**영향**:
- iOS/Android 시스템은 404 또는 빈 응답을 받으면 Universal Link/App Link 검증 실패
- 앱 설치 후에도 딥링크가 작동하지 않음
- 디버깅 어려움 (iOS는 에러 메시지를 보여주지 않음)

**Apple/Google 요구사항**:
- AASA 파일: HTTP 200 OK, `Content-Type: application/json`, 유효한 JSON
- DAL 파일: HTTP 200 OK, `Content-Type: application/json`, 유효한 JSON 배열

**해결 방안**:

**AASA 파일**:
```typescript
// 에러 발생 시에도 빈 AASA 반환 (200 OK)
if (projectError || !project) {
  return NextResponse.json({
    applinks: {
      apps: [],
      details: []
    }
  }, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

**DAL 파일** (이미 부분적으로 구현됨):
```typescript
// catch 블록에서 빈 배열 반환은 올바름
} catch (error) {
  console.error('Error generating assetlinks.json:', error);
  return NextResponse.json([], {
    status: 200,  // 명시적으로 200
    headers: { 'Content-Type': 'application/json' }
  });
}
```

**추가 개선**: 로깅 및 모니터링
```typescript
// Sentry 또는 로깅 서비스에 에러 전송
if (projectError) {
  console.error(`AASA generation failed for subdomain: ${subdomain}`, projectError);
  // Sentry.captureException(projectError);
}
```

---

## 🟢 낮음 (Medium) - 개선 권장

### 8. 환경별 서브도메인 처리 하드코딩
**위치**:
- `src/app/api/apple-app-site-association/route.ts:34`
- `src/app/api/assetlinks/route.ts:34`

**문제**:
```typescript
const subdomain = isProd ? host.split('.')[0] : 'test';  // ❌ 'test' 하드코딩
```

**영향**:
- 로컬 개발 시 모든 요청이 'test' 서브도메인으로 처리됨
- 여러 워크스페이스를 동시에 테스트할 수 없음

**해결 방안**:
```typescript
// 개발 환경에서도 서브도메인 추출
const subdomain = isProd
  ? host.split('.')[0]
  : (host.includes('.localhost') ? host.split('.')[0] : process.env.DEV_SUBDOMAIN || 'test');
```

---

### 9. API 에러 메시지 일관성 부족
**위치**: `src/app/api/deeplink/route.ts` 전체

**문제**:
- 일부 에러는 상세한 메시지 ("Valid client_key is required.")
- 일부 에러는 일반적인 메시지 ("server error")

**예시**:
```typescript
// 269-278: 불명확한 에러
if (deeplinkError) {
  return NextResponse.json(
    {
      error: {
        code: "SERVER_ERROR",
        message: "server error"  // ❌ 너무 일반적
      }
    },
    { status: 500 }
  );
}
```

**해결 방안**:
```typescript
if (deeplinkError) {
  console.error('Deeplink creation error:', deeplinkError);

  return NextResponse.json(
    {
      error: {
        code: deeplinkError.code || "DEEPLINK_CREATION_FAILED",
        message: deeplinkError.message || "Failed to create deeplink in database",
        details: process.env.NODE_ENV === 'development' ? deeplinkError : undefined
      }
    },
    { status: 500 }
  );
}
```

---

### 10. workspace 사용량 추적 미작동
**위치**: `src/utils/supabase/schema.type.ts:244-251`

**문제**:
- `current_monthly_create_count`: 딥링크 생성 시 증가하지 않음
- `current_monthly_click_count`: 클릭 시 증가하지 않음 (문제 #2와 연관)
- `next_quota_update_at`: 리셋 로직 없음

**영향**:
- 구독 플랜별 할당량 제한 불가능
- 남용 방지 불가능
- 비즈니스 모델 구현 불가

**해결 방안**:

**1. 딥링크 생성 시 카운트 증가**
```typescript
// src/app/api/deeplink/route.ts
const { data: deeplink, error: deeplinkError } = await supabase
  .from('deeplinks')
  .insert({...});

if (!deeplinkError) {
  // 워크스페이스 생성 카운트 증가
  await supabase
    .from('workspaces')
    .update({
      current_monthly_create_count: project.current_monthly_create_count + 1
    })
    .eq('id', project.id);
}
```

**2. 클릭 시 카운트 증가**
```typescript
// src/utils/action/server.ts - incrementDeeplinkClick 함수 수정
export async function incrementDeeplinkClick(workspaceId: string, shortCode: string) {
  const supabase = await createClient();

  // 딥링크 클릭 수 증가
  await supabase.rpc('increment_click_count', {
    p_workspace_id: workspaceId,
    p_short_code: shortCode
  });

  // 워크스페이스 클릭 수 증가
  await supabase.rpc('increment_workspace_click', {
    p_workspace_id: workspaceId
  });
}
```

```sql
-- Migration
CREATE OR REPLACE FUNCTION increment_workspace_click(p_workspace_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE workspaces
  SET current_monthly_click_count = current_monthly_click_count + 1
  WHERE id = p_workspace_id;
END;
$$;
```

**3. 월별 리셋 크론 작업**
```typescript
// src/app/api/cron/reset-quotas/route.ts
export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await createClient();

  // next_quota_update_at이 지난 워크스페이스 리셋
  const now = new Date().toISOString();

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id')
    .lte('next_quota_update_at', now);

  if (workspaces) {
    for (const workspace of workspaces) {
      await supabase
        .from('workspaces')
        .update({
          current_monthly_click_count: 0,
          current_monthly_create_count: 0,
          next_quota_update_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', workspace.id);
    }
  }

  return Response.json({ success: true, reset_count: workspaces?.length || 0 });
}
```

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/reset-quotas",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

---

### 11. 메타데이터 생성 시 에러 처리 불완전
**위치**: `src/app/link/[id]/page.tsx:46-107`

**문제**:
```typescript
try {
  const { data: deeplink, error } = await supabase
    .from('deeplinks')
    .select('social_meta')
    .eq('short_code', id)
    .maybeSingle();

  if (error) {
      console.error("딥링크 메타데이터 조회 오류:", error);
      // 요구사항에 따라 대체(fallback) 메타데이터 반환 또는 에러 다시 던지기
  }
  // ...
} catch (e) {
    console.error("메타데이터 조회 중 예외 발생:", e);
    // 예외 발생 시 대체 메타데이터 반환
}
```

**현재 상황**:
- 에러 발생 시 콘솔에 로그만 출력
- 기본 메타데이터로 fallback은 작동하지만, 사용자에게 에러 표시 없음

**개선 방안**:
```typescript
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const { data: deeplink, error } = await supabase
      .from('deeplinks')
      .select('social_meta, workspace_id')
      .eq('short_code', id)
      .maybeSingle();

    if (error) {
      // Sentry 또는 로깅 서비스로 전송
      console.error("딥링크 메타데이터 조회 오류:", { short_code: id, error });
    }

    if (deeplink?.social_meta) {
      const socialMeta = deeplink.social_meta as { title?: string; description?: string; thumbnail_url?: string };

      return {
        title: socialMeta.title || '앱 다운로드 - DeepLink',
        description: socialMeta.description || '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
        openGraph: {
          title: socialMeta.title || '앱 다운로드 - DeepLink',
          description: socialMeta.description || '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
          images: [socialMeta.thumbnail_url || '/images/og-image.jpg'],
        },
        twitter: {
          card: 'summary_large_image',
          title: socialMeta.title || '앱 다운로드 - DeepLink',
          description: socialMeta.description || '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
          images: [socialMeta.thumbnail_url || '/images/og-image.jpg'],
        }
      };
    }
  } catch (e) {
    console.error("메타데이터 조회 중 예외 발생:", { short_code: id, error: e });
  }

  // 기본 메타데이터
  return {
    title: '앱 다운로드 - DeepLink',
    description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
    openGraph: {
      title: '앱 다운로드 - DeepLink',
      description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
      images: ['/images/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: '앱 다운로드 - DeepLink',
      description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
      images: ['/images/og-image.jpg'],
    }
  };
}
```

---

### 12. TypeScript 타입 안전성 부족
**위치**: 여러 곳

**문제**:
```typescript
// src/app/link/[id]/page.tsx:157, 168
const androidParams = deeplink.android_parameters as unknown as AndroidParameters;
const iosParams = deeplink.ios_parameters as unknown as IOSParameters;
```

**영향**:
- `as unknown as` 패턴은 타입 안전성을 완전히 우회
- 런타임 에러 발생 가능 (필드가 없을 경우)

**해결 방안**:

**방안 1: Type Guard 함수 사용**
```typescript
// src/types/deeplink.ts
export interface AndroidParameters {
  package_name: string;
  action: string;
  fallback_url: string;
}

export interface IOSParameters {
  app_store_id: string;
  bundle_id: string;
}

export function isAndroidParameters(obj: any): obj is AndroidParameters {
  return (
    typeof obj === 'object' &&
    typeof obj.package_name === 'string' &&
    typeof obj.action === 'string' &&
    typeof obj.fallback_url === 'string'
  );
}

export function isIOSParameters(obj: any): obj is IOSParameters {
  return (
    typeof obj === 'object' &&
    typeof obj.app_store_id === 'string' &&
    typeof obj.bundle_id === 'string'
  );
}
```

```typescript
// src/app/link/[id]/page.tsx
if (isAndroid) {
  if (!isAndroidParameters(deeplink.android_parameters)) {
    console.error('Invalid android_parameters:', deeplink.android_parameters);
    return <p>Invalid deeplink configuration</p>;
  }

  const androidParams = deeplink.android_parameters;
  // 이제 타입 안전하게 사용 가능
}
```

**방안 2: Zod를 사용한 런타임 검증**
```typescript
import { z } from 'zod';

const AndroidParametersSchema = z.object({
  package_name: z.string(),
  action: z.string(),
  fallback_url: z.string()
});

const IOSParametersSchema = z.object({
  app_store_id: z.string(),
  bundle_id: z.string()
});

// 사용
if (isAndroid) {
  const result = AndroidParametersSchema.safeParse(deeplink.android_parameters);

  if (!result.success) {
    console.error('Invalid android_parameters:', result.error);
    return <p>Invalid deeplink configuration</p>;
  }

  const androidParams = result.data;  // 타입 안전
}
```

---

## 📊 우선순위 요약

### 즉시 수정 (이번 주)
1. ✅ **shortCode 중복 체크** - 프로덕션 장애 가능성 높음
2. ✅ **클릭 추적 구현** - 핵심 기능 완전 미작동
3. ✅ **iOS Universal Link 완성** - iOS 사용자 경험 저하

### 빠른 수정 (다음 주)
4. ⚠️ workspace_id 검증 추가
5. ⚠️ Android fallback URL 일관성
6. ⚠️ slug 중복 처리
7. ⚠️ AASA/DAL 에러 처리

### 개선 (2주 내)
8. 🔧 환경별 서브도메인 처리
9. 🔧 API 에러 메시지 일관성
10. 🔧 사용량 추적 활성화
11. 🔧 메타데이터 에러 처리
12. 🔧 TypeScript 타입 안전성

---

## 🛠️ 테스트 체크리스트

수정 후 다음 항목을 테스트해야 합니다:

### 딥링크 생성
- [ ] 동일한 shortCode 재생성 시도 시 정상 처리
- [ ] 동일한 slug 재생성 시 적절한 동작 (중복 또는 업데이트)
- [ ] API 키 없이 요청 시 401 반환
- [ ] 앱이 등록되지 않은 워크스페이스에서 요청 시 400 반환

### 딥링크 리디렉션
- [ ] Android 디바이스에서 앱 실행 확인
- [ ] Android에서 앱 미설치 시 Play Store 이동 확인
- [ ] iOS 디바이스에서 앱 실행 확인 (Universal Link)
- [ ] iOS에서 앱 미설치 시 App Store 이동 확인
- [ ] 데스크탑에서 안내 메시지 표시 확인

### 클릭 추적
- [ ] 딥링크 클릭 시 click_count 증가 확인
- [ ] 대시보드 통계에 정확한 클릭 수 표시 확인
- [ ] current_monthly_click_count 증가 확인

### Universal Link / App Link
- [ ] iOS에서 `.well-known/apple-app-site-association` 정상 반환
- [ ] Android에서 `.well-known/assetlinks.json` 정상 반환
- [ ] 존재하지 않는 서브도메인 요청 시 빈 응답 (200 OK) 확인

### 사용량 제한
- [ ] 딥링크 생성 시 current_monthly_create_count 증가
- [ ] 월별 리셋 크론 작업 정상 실행
- [ ] 할당량 초과 시 적절한 에러 메시지 반환 (구현 후)

---

**문서 버전**: 1.0
**작성일**: 2025-10-24
**분석자**: Claude Code Analysis
