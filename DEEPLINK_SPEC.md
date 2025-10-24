# Depl 딥링크 시스템 기술 명세서

## 1. 개요

Depl은 Firebase Dynamic Links의 대안으로 설계된 모바일 앱 딥링크 SaaS 플랫폼입니다. 이 문서는 딥링크 시스템의 전체 아키텍처, 동작 방식, 데이터 흐름을 상세히 설명합니다.

### 1.1 핵심 기능
- **URL 단축**: 긴 딥링크를 짧은 URL로 변환
- **플랫폼별 라우팅**: iOS/Android/Web에 따라 적절한 대상으로 리디렉션
- **Universal Links/App Links 지원**: 네이티브 앱 자동 실행
- **소셜 메타데이터**: Open Graph 태그를 통한 소셜 공유 최적화
- **클릭 추적**: 딥링크 사용 통계 수집
- **멀티 테넌트**: 워크스페이스별 독립적인 서브도메인 관리

---

## 2. URL 구조 및 라우팅

### 2.1 URL 패턴

#### 프로덕션 환경
```
https://{subdomain}.depl.link/{shortCode}
```

#### 개발 환경
```
http://{subdomain}.localhost:3000/{shortCode}
```

#### 루트 도메인 단축
```
https://depl.link/{shortCode}
```

### 2.2 URL 리라이팅 프로세스

미들웨어(`src/utils/supabase/middleware.ts:4-72`)에서 다음과 같이 처리됩니다:

```typescript
// 1. 호스트 헤더에서 서브도메인 추출
const host = request.headers.get('host') || '';
const isProd = process.env.NODE_ENV === 'production';
const pathname = request.nextUrl.pathname;

// 2. 제외 경로 확인
const excludedPaths = ['/dashboard', '/dashboard_deprecated', '/api', '/blog', '/callback', '/test', '/landing2', '/docs'];
const isExcludedPath = excludedPaths.some(path => pathname.startsWith(path));

// 3. URL 경로에서 shortCode 추출
const pathSegments = pathname.split('/').filter(Boolean);
const shortCode = pathSegments.length > 0 ? pathSegments[0] : null;
```

#### 리라이팅 규칙

1. **서브도메인 패턴** (프로덕션: `*.depl.link`, 개발: `*.localhost:3000`)
   - `https://myapp.depl.link/abc123` → `/link/abc123` (내부 라우트)

2. **루트 도메인 단축 패턴**
   - `https://depl.link/abc123` → `/link/abc123`
   - 제외 경로가 아니고, 단일 세그먼트일 경우에만 적용

3. **제외 경로**: 다음 경로는 리라이팅 대상에서 제외
   - `/dashboard/*`: 대시보드 UI
   - `/api/*`: API 엔드포인트
   - `/blog/*`: 블로그
   - `/docs/*`: 문서
   - `/callback`, `/test`, `/landing2`

---

## 3. 딥링크 생성 프로세스

### 3.1 API 엔드포인트
**POST** `/api/deeplink`

### 3.2 인증 방식
```http
Authorization: Bearer {api_key}
```
- **api_key**: 워크스페이스의 쓰기 권한 API 키 (workspaces.api_key)

### 3.3 요청 형식

```json
{
  "slug": "product-detail",
  "app_params": {
    "product_id": "12345",
    "category": "electronics",
    "custom_key": "custom_value"
  },
  "social_meta": {
    "title": "Amazing Product",
    "description": "Check out this amazing product!",
    "thumbnail_url": "https://example.com/product.jpg"
  }
}
```

#### 필수 필드
- `slug` (string): 딥링크의 식별자 (사용자 정의 가능)
- `app_params` (object): 앱에 전달할 파라미터 (자유 형식 JSON)

#### 선택 필드
- `social_meta.title` (string): 소셜 공유 제목 (기본값: "Depl.link | App Download")
- `social_meta.description` (string): 소셜 공유 설명 (기본값: "Download the mobile app for a better experience.")
- `social_meta.thumbnail_url` (string): 소셜 공유 이미지 (기본값: "/images/og-image.jpg")

### 3.4 처리 플로우

#### 단계 1: API 키 검증 (`src/app/api/deeplink/route.ts:164-208`)
```typescript
// 1. Authorization 헤더에서 API 키 추출
const authHeader = headersList.get('authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return 401 UNAUTHORIZED
}

const apiKey = authHeader.substring(7);

// 2. 워크스페이스 조회 (앱 정보 포함)
const { data: project, error } = await supabase
  .from('workspaces')
  .select(`
    *,
    apps (
      id,
      name,
      platform,
      platform_data
    )
  `)
  .eq('api_key', apiKey)
  .single();
```

#### 단계 2: 앱 구성 확인 (`src/app/api/deeplink/route.ts:211-221`)
```typescript
// 워크스페이스에 등록된 앱이 있는지 확인
if (!project.apps || project.apps.length === 0) {
  return 400 NO_APPS_CONFIGURED
}
```

#### 단계 3: 플랫폼별 파라미터 생성 (`src/app/api/deeplink/route.ts:224-250`)

**iOS 파라미터 설정**
```typescript
const iosApp = project.apps.find(app => app.platform === 'ios');
const iosParameters: IOSParameters = {};

if (iosApp && iosApp.platform_data) {
  const iosData = iosApp.platform_data as { bundle_id?: string, app_store_id?: string };
  if (iosData.bundle_id) {
    iosParameters.bundle_id = iosData.bundle_id;
  }
  if (iosData.app_store_id) {
    iosParameters.app_store_id = iosData.app_store_id;
  }
}
```

**Android 파라미터 설정**
```typescript
const androidApp = project.apps.find(app => app.platform === 'android');
const androidParameters: AndroidParameters = {};

if (androidApp && androidApp.platform_data) {
  const androidData = androidApp.platform_data as { package_name?: string };
  if (androidData.package_name) {
    androidParameters.package_name = androidData.package_name;
    androidParameters.action = 'android.intent.action.VIEW';
    androidParameters.fallback_url = `https://play.google.com/store/apps/details?id=${androidData.package_name}`;
  }
}
```

#### 단계 4: shortCode 생성 및 딥링크 저장 (`src/app/api/deeplink/route.ts:253-268`)
```typescript
// 4글자 랜덤 문자열 생성 (A-Z, a-z, 0-9)
const shortCode = generateRandomString(4);
const deeplinkUrl = `https://${project.sub_domain || 'app'}.depl.link/${shortCode}`;

// 데이터베이스에 저장
const { data: deeplink, error } = await supabase
  .from('deeplinks')
  .insert({
    android_parameters: androidParameters,
    ios_parameters: iosParameters,
    app_params: body.app_params,
    social_meta: socialMeta,
    workspace_id: project.id,
    short_code: shortCode,
    slug: body.slug,
    source: 'API',  // API를 통해 생성됨을 표시
  });
```

### 3.5 응답 형식

**성공 (200 OK)**
```json
{
  "success": true,
  "deeplink_url": "https://myapp.depl.link/aB3x",
  "created_at": "2025-10-24T12:00:00.000Z"
}
```

**오류 응답**
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key."
  }
}
```

#### 오류 코드
- `INVALID_JSON` (400): 요청 본문이 유효한 JSON이 아님
- `INVALID_REQUEST` (400): 필수 필드 누락 (slug, app_params)
- `NO_APPS_CONFIGURED` (400): 워크스페이스에 등록된 앱이 없음
- `UNAUTHORIZED` (401): Authorization 헤더 누락 또는 형식 오류
- `INVALID_API_KEY` (401): 유효하지 않은 API 키
- `SERVER_ERROR` (500): 서버 내부 오류

---

## 4. 딥링크 조회 프로세스

### 4.1 API 엔드포인트
**GET** `/api/deeplink?short_code={shortCode}`

### 4.2 인증 방식
```http
Authorization: Bearer {client_key}
```
- **client_key**: 워크스페이스의 읽기 전용 클라이언트 키 (workspaces.client_key)

### 4.3 처리 플로우 (`src/app/api/deeplink/route.ts:31-110`)

```typescript
// 1. client_key 검증
const clientKey = authHeader.replace('Bearer ', '');
const { data: projectData } = await supabase
  .from('workspaces')
  .select('id')
  .eq('client_key', clientKey)
  .single();

// 2. short_code로 딥링크 조회
const { data: deeplinkData } = await supabase
  .from('deeplinks')
  .select('*')
  .eq('project_id', projectData.id)
  .eq('short_code', shortCode)
  .single();
```

### 4.4 응답 형식

**성공 (200 OK)**
```json
{
  "workspace_id": "uuid",
  "short_code": "aB3x",
  "slug": "product-detail",
  "app_params": {
    "product_id": "12345",
    "category": "electronics"
  },
  "ios_parameters": {
    "bundle_id": "com.example.app",
    "app_store_id": "123456789"
  },
  "android_parameters": {
    "package_name": "com.example.app",
    "action": "android.intent.action.VIEW",
    "fallback_url": "https://play.google.com/store/apps/details?id=com.example.app"
  },
  "social_meta": {
    "title": "Amazing Product",
    "description": "Check out this amazing product!",
    "thumbnail_url": "https://example.com/product.jpg"
  },
  "click_count": 42,
  "created_at": "2025-10-24T12:00:00.000Z",
  "updated_at": "2025-10-24T12:00:00.000Z",
  "source": "API"
}
```

**오류 응답**
- `UNAUTHORIZED` (401): client_key 누락 또는 형식 오류
- `INVALID_CLIENT_KEY` (401): 유효하지 않은 client_key
- `INVALID_REQUEST` (400): short_code 파라미터 누락
- `NOT_FOUND` (404): 해당 short_code의 딥링크가 없음
- `SERVER_ERROR` (500): 서버 내부 오류

---

## 5. 딥링크 리디렉션 프로세스

### 5.1 라우트
`/link/[id]` → `src/app/link/[id]/page.tsx`

### 5.2 동작 플로우

#### 단계 1: 메타데이터 생성 (`src/app/link/[id]/page.tsx:46-107`)
```typescript
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // shortCode로 딥링크 조회
  const { data: deeplink } = await supabase
    .from('deeplinks')
    .select('social_meta')
    .eq('short_code', id)
    .maybeSingle();

  if (deeplink && deeplink.social_meta) {
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

  // 기본 메타데이터 반환
}
```

#### 단계 2: User-Agent 기반 플랫폼 감지 (`src/app/link/[id]/page.tsx:139-150`)
```typescript
const headersList = await headers();
const userAgent = headersList.get('user-agent') || '';
const host = headersList.get('host') || '';

const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
const isAndroid = /Android/i.test(userAgent);
```

#### 단계 3: 플랫폼별 리디렉션

**Android 디바이스** (`src/app/link/[id]/page.tsx:155-164`)
```typescript
if (isAndroid) {
  const subdomain = host.split('.')[0];
  const normalizedSubdomain = subdomain === 'www' ? '' : subdomain;
  const deepLinkUrl = `${normalizedSubdomain}.depl.link/${id}`;

  const androidParams = deeplink.android_parameters as AndroidParameters;

  // Intent URL 생성
  const androidAppLink = `intent://${deepLinkUrl}#Intent;package=${androidParams.package_name};action=android.intent.action.VIEW;scheme=https;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;

  return redirect(androidAppLink);
}
```

**Android Intent URL 구조**
```
intent://{deepLinkUrl}#Intent;
  package={package_name};
  action=android.intent.action.VIEW;
  scheme=https;
  S.browser_fallback_url={fallbackUrl};
end;
```

**iOS 디바이스** (`src/app/link/[id]/page.tsx:166-170`)
```typescript
if (isIOS) {
  const iosParams = deeplink.ios_parameters as IOSParameters;

  // App Store로 리디렉션 (추후 Universal Link 구현 예정)
  return permanentRedirect(`https://apps.apple.com/KR/app/id${iosParams.app_store_id}?mt=8`);
}
```

**데스크탑/기타** (`src/app/link/[id]/page.tsx:172-175`)
```typescript
return (
  <p>This link requires a mobile device. Please open this link on an iOS or Android device to continue.</p>
);
```

### 5.3 클릭 추적
현재 구현에서는 딥링크 테이블에 `click_count` 필드가 존재하지만, `/link/[id]` 페이지에서 자동으로 증가시키는 로직은 **미구현** 상태입니다.

---

## 6. Universal Links / App Links 설정

### 6.1 iOS Universal Links

#### 엔드포인트
**GET** `https://{subdomain}.depl.link/.well-known/apple-app-site-association`

리라우트: `/api/apple-app-site-association`

#### 구현 (`src/app/api/apple-app-site-association/route.ts:16-99`)

```typescript
export async function GET() {
  // 1. 호스트 헤더에서 서브도메인 추출
  const host = headersList.get('host') || '';
  const subdomain = isProd ? host.split('.')[0] : 'test';

  // 2. 서브도메인으로 워크스페이스 및 iOS 앱 조회
  const { data: project } = await supabase
    .from('workspaces')
    .select(`
      id,
      apps!inner(
        id,
        name,
        platform,
        platform_data
      )
    `)
    .eq('sub_domain', subdomain)
    .eq('apps.platform', 'IOS')
    .single();

  // 3. platform_data에서 team_id, bundle_id 추출
  const platformData = project.apps[0].platform_data as {
    team_id: string;
    bundle_id: string;
  };

  // 4. Apple App Site Association 형식으로 반환
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${platformData.team_id}.${platformData.bundle_id}`,
          paths: ["NOT /_/*", "/*"]
        }
      ]
    }
  };
}
```

#### 응답 예시
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM123.com.example.app",
        "paths": ["NOT /_/*", "/*"]
      }
    ]
  }
}
```

**경로 패턴 설명**
- `"NOT /_/*"`: `/_/`로 시작하는 경로는 제외
- `"/*"`: 모든 경로 포함 (딥링크 대상)

### 6.2 Android App Links

#### 엔드포인트
**GET** `https://{subdomain}.depl.link/.well-known/assetlinks.json`

리라우트: `/api/assetlinks`

#### 구현 (`src/app/api/assetlinks/route.ts:16-88`)

```typescript
export async function GET() {
  // 1. 서브도메인 추출
  const subdomain = isProd ? host.split('.')[0] : 'test';

  // 2. Android 앱 조회
  const { data: project } = await supabase
    .from('workspaces')
    .select(`
      id,
      apps!inner(
        id,
        name,
        platform,
        platform_data
      )
    `)
    .eq('sub_domain', subdomain)
    .eq('apps.platform', 'ANDROID')
    .single();

  // 3. platform_data에서 package_name, sha256_list 추출
  const platformData = project.apps[0].platform_data as {
    sha256_list: string;
    package_name: string;
  };

  // 4. Digital Asset Links 형식으로 반환
  return [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: platformData.package_name,
        sha256_cert_fingerprints: platformData.sha256_list
      }
    }
  ];
}
```

#### 응답 예시
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.app",
      "sha256_cert_fingerprints": "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    }
  }
]
```

---

## 7. 데이터베이스 스키마

### 7.1 workspaces 테이블
워크스페이스(구 projects)는 멀티 테넌트의 기본 단위입니다.

```sql
CREATE TABLE workspaces (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id                      UUID NOT NULL REFERENCES profiles(id),
  name                          VARCHAR NOT NULL,
  description                   TEXT,
  sub_domain                    VARCHAR NOT NULL UNIQUE,  -- 서브도메인 (myapp → myapp.depl.link)
  api_key                       VARCHAR UNIQUE,           -- 쓰기 권한 API 키
  client_key                    VARCHAR UNIQUE,           -- 읽기 권한 클라이언트 키

  -- 구독 관련
  active_subscription_id        UUID REFERENCES subscriptions(id),
  subscription_tier             VARCHAR,                  -- 구독 플랜
  subscription_status           VARCHAR,
  next_subscription_update_at   TIMESTAMP,

  -- 사용량 추적
  current_monthly_click_count   INTEGER DEFAULT 0,        -- 이번 달 클릭 수
  current_monthly_create_count  INTEGER DEFAULT 0,        -- 이번 달 생성 수
  next_quota_update_at          TIMESTAMP,                -- 다음 할당량 리셋 시간

  created_at                    TIMESTAMP DEFAULT NOW()
);
```

#### 주요 필드
- `sub_domain`: 워크스페이스 전용 서브도메인 (예: `myapp` → `myapp.depl.link`)
- `api_key`: POST /api/deeplink에서 사용하는 쓰기 권한 키
- `client_key`: GET /api/deeplink에서 사용하는 읽기 권한 키

### 7.2 apps 테이블
워크스페이스에 등록된 iOS/Android 앱 정보를 저장합니다.

```sql
CREATE TABLE apps (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id   UUID NOT NULL REFERENCES workspaces(id),
  name           VARCHAR NOT NULL,
  platform       VARCHAR NOT NULL,  -- 'IOS' 또는 'ANDROID'
  platform_data  JSONB,             -- 플랫폼별 설정 데이터
  created_at     TIMESTAMP DEFAULT NOW()
);
```

#### platform_data 구조

**iOS**
```json
{
  "team_id": "TEAM123",
  "bundle_id": "com.example.app",
  "app_store_id": "123456789"
}
```

**Android**
```json
{
  "package_name": "com.example.app",
  "sha256_list": "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
}
```

### 7.3 deeplinks 테이블
생성된 딥링크 정보를 저장합니다.

```sql
CREATE TABLE deeplinks (
  workspace_id        UUID NOT NULL REFERENCES workspaces(id),
  short_code          VARCHAR NOT NULL,              -- 4글자 랜덤 코드
  slug                VARCHAR NOT NULL,              -- 사용자 정의 식별자

  -- 플랫폼별 파라미터
  ios_parameters      JSONB NOT NULL,                -- iOS 앱 정보
  android_parameters  JSONB NOT NULL,                -- Android 앱 정보
  app_params          JSONB NOT NULL,                -- 앱에 전달할 커스텀 파라미터

  -- 소셜 메타데이터
  social_meta         JSONB NOT NULL,                -- Open Graph 메타 정보

  -- 추적 정보
  click_count         INTEGER DEFAULT 0,             -- 클릭 수
  source              VARCHAR,                       -- 'API' 또는 'UI'

  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (workspace_id, short_code)
);
```

#### JSON 필드 구조

**ios_parameters**
```json
{
  "bundle_id": "com.example.app",
  "app_store_id": "123456789"
}
```

**android_parameters**
```json
{
  "package_name": "com.example.app",
  "action": "android.intent.action.VIEW",
  "fallback_url": "https://play.google.com/store/apps/details?id=com.example.app"
}
```

**app_params** (자유 형식)
```json
{
  "product_id": "12345",
  "category": "electronics",
  "any_custom_key": "any_value"
}
```

**social_meta**
```json
{
  "title": "Amazing Product",
  "description": "Check out this amazing product!",
  "thumbnail_url": "https://example.com/product.jpg"
}
```

### 7.4 기타 테이블

#### profiles
```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY,
  user_name   VARCHAR NOT NULL,
  email       VARCHAR NOT NULL,
  avatar_url  VARCHAR NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

#### workspace_memberships
```sql
CREATE TABLE workspace_memberships (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id),
  user_id           UUID NOT NULL REFERENCES profiles(id),
  invited_by        UUID NOT NULL REFERENCES profiles(id),
  role              VARCHAR NOT NULL,      -- 'OWNER', 'ADMIN', 'MEMBER'
  status            VARCHAR NOT NULL,      -- 'PENDING', 'ACCEPTED'
  invitation_token  VARCHAR,
  invited_at        TIMESTAMP DEFAULT NOW(),
  accepted_at       TIMESTAMP NOT NULL
);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id          UUID REFERENCES workspaces(id),
  user_id               UUID REFERENCES profiles(id),
  paddle_customer_id    VARCHAR NOT NULL,
  subscription_id       VARCHAR NOT NULL,
  product_id            VARCHAR NOT NULL,
  price_id              VARCHAR NOT NULL,
  subscription_status   VARCHAR NOT NULL,
  scheduled_change      VARCHAR,
  created_at            TIMESTAMP DEFAULT NOW()
);
```

---

## 8. 전체 시스템 플로우 다이어그램

### 8.1 딥링크 생성 플로우

```
[클라이언트]
    |
    | POST /api/deeplink
    | Authorization: Bearer {api_key}
    | Body: { slug, app_params, social_meta }
    |
    v
[API 엔드포인트: /api/deeplink]
    |
    ├─> 1. API 키 검증 (workspaces.api_key)
    |
    ├─> 2. 워크스페이스 및 앱 정보 조회
    |      - iOS 앱 (platform='IOS')
    |      - Android 앱 (platform='ANDROID')
    |
    ├─> 3. 플랫폼별 파라미터 생성
    |      - ios_parameters: { bundle_id, app_store_id }
    |      - android_parameters: { package_name, action, fallback_url }
    |
    ├─> 4. shortCode 생성 (4글자 랜덤)
    |
    ├─> 5. deeplinks 테이블에 저장
    |      INSERT INTO deeplinks (
    |        workspace_id,
    |        short_code,
    |        slug,
    |        ios_parameters,
    |        android_parameters,
    |        app_params,
    |        social_meta,
    |        source='API'
    |      )
    |
    v
[응답]
{
  "success": true,
  "deeplink_url": "https://{subdomain}.depl.link/{shortCode}",
  "created_at": "..."
}
```

### 8.2 딥링크 리디렉션 플로우

```
[사용자가 딥링크 클릭]
https://myapp.depl.link/aB3x
    |
    v
[미들웨어: middleware.ts]
    |
    ├─> 1. 호스트에서 서브도메인 추출 (myapp)
    ├─> 2. 경로에서 shortCode 추출 (aB3x)
    ├─> 3. 내부 리라이팅
    |      https://myapp.depl.link/aB3x
    |         ↓
    |      /link/aB3x (내부 라우트)
    |
    v
[페이지: /link/[id]/page.tsx]
    |
    ├─> 1. generateMetadata() 실행
    |      - shortCode로 딥링크 조회
    |      - social_meta로 Open Graph 태그 생성
    |
    ├─> 2. User-Agent 기반 플랫폼 감지
    |      - isIOS: /iPhone|iPad|iPod/i
    |      - isAndroid: /Android/i
    |
    └─> 3. 플랫폼별 리디렉션
         |
         ├─> [Android]
         |   Intent URL 생성 및 리디렉션
         |   intent://{subdomain}.depl.link/{shortCode}#Intent;
         |     package={package_name};
         |     action=android.intent.action.VIEW;
         |     scheme=https;
         |     S.browser_fallback_url={fallback_url};
         |   end;
         |
         |   → Android 시스템이 앱 실행 시도
         |   → 앱이 없으면 fallback_url (Play Store)로 이동
         |
         ├─> [iOS]
         |   App Store로 리디렉션
         |   https://apps.apple.com/KR/app/id{app_store_id}?mt=8
         |
         |   TODO: Universal Link 구현 필요
         |
         └─> [기타]
             "This link requires a mobile device..." 메시지 표시
```

### 8.3 Universal Link / App Link 검증 플로우

#### iOS (Universal Links)
```
[iOS 디바이스가 앱 설치 시]
    |
    | GET https://myapp.depl.link/.well-known/apple-app-site-association
    |
    v
[API: /api/apple-app-site-association]
    |
    ├─> 1. 서브도메인 추출 (myapp)
    ├─> 2. workspaces 테이블에서 sub_domain='myapp' 조회
    ├─> 3. apps 테이블에서 platform='IOS' 조회
    ├─> 4. platform_data에서 team_id, bundle_id 추출
    |
    v
[응답: AASA 파일]
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "{team_id}.{bundle_id}",
        "paths": ["NOT /_/*", "/*"]
      }
    ]
  }
}
    |
    v
[iOS가 도메인-앱 연결 검증 완료]
- 이후 myapp.depl.link/* 링크 클릭 시 앱이 자동 실행됨
```

#### Android (App Links)
```
[Android 디바이스가 앱 설치 시]
    |
    | GET https://myapp.depl.link/.well-known/assetlinks.json
    |
    v
[API: /api/assetlinks]
    |
    ├─> 1. 서브도메인 추출 (myapp)
    ├─> 2. workspaces 테이블에서 sub_domain='myapp' 조회
    ├─> 3. apps 테이블에서 platform='ANDROID' 조회
    ├─> 4. platform_data에서 package_name, sha256_list 추출
    |
    v
[응답: Digital Asset Links 파일]
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "{package_name}",
      "sha256_cert_fingerprints": "{sha256_list}"
    }
  }
]
    |
    v
[Android가 도메인-앱 연결 검증 완료]
- 이후 myapp.depl.link/* 링크 클릭 시 앱이 자동 실행됨
```

---

## 9. 보안 및 인증

### 9.1 API 키 체계

#### api_key (쓰기 권한)
- **용도**: POST /api/deeplink (딥링크 생성)
- **저장**: workspaces.api_key
- **권한**: 딥링크 생성, 워크스페이스 설정 변경
- **노출 금지**: 백엔드 서버에서만 사용

#### client_key (읽기 권한)
- **용도**: GET /api/deeplink (딥링크 조회)
- **저장**: workspaces.client_key
- **권한**: 딥링크 정보 조회 (읽기 전용)
- **제한적 노출**: 클라이언트 앱에서 사용 가능

### 9.2 Row-Level Security (RLS)
Supabase의 RLS를 통해 데이터베이스 레벨에서 보안을 강화합니다.

**예상 정책** (구현 확인 필요):
- workspaces: 소유자 및 멤버만 접근 가능
- deeplinks: 해당 워크스페이스 멤버만 접근 가능
- apps: 해당 워크스페이스 멤버만 접근 가능

### 9.3 미들웨어 제외 경로
다음 경로는 딥링크 리라이팅에서 제외되어 보안 침해를 방지합니다:
- `/dashboard/*`: 관리자 UI
- `/api/*`: API 엔드포인트
- `/callback`: OAuth 콜백
- `/docs/*`, `/blog/*`: 정적 콘텐츠

---

## 10. 제한사항 및 향후 개선사항

### 10.1 현재 구현의 제한사항

1. **클릭 추적 미구현**
   - `deeplinks.click_count` 필드는 존재하지만 자동 증가 로직 없음
   - 해결: `/link/[id]` 페이지에서 Supabase `rpc()` 또는 서버 액션으로 click_count 증가

2. **iOS Universal Link 미완성**
   - 현재 iOS에서는 App Store로만 리디렉션됨
   - 해결: iOS 앱에서 Associated Domains 설정 완료 후, 딥링크 파라미터를 포함한 URL 스킴 처리 필요

3. **shortCode 중복 가능성**
   - 4글자 랜덤 문자열은 약 14.7M 조합 (62^4)
   - 해결:
     - unique constraint 추가 또는 생성 시 중복 체크
     - shortCode 길이 증가 (5글자 = 916M 조합)

4. **소스 추적 제한**
   - `source` 필드는 'API' 또는 'UI'만 저장
   - 해결: 유입 채널 (utm_source, utm_medium 등) 추적 추가

5. **사용량 제한 미적용**
   - `current_monthly_click_count`, `current_monthly_create_count`는 추적되지만 제한 로직 없음
   - 해결: 구독 플랜별 할당량 체크 미들웨어 추가

### 10.2 향후 개선사항

#### 기능 개선
- [ ] 클릭 추적 자동화
- [ ] iOS Universal Link 완전 구현
- [ ] 지역별 리디렉션 (Geo-targeting)
- [ ] A/B 테스팅 지원
- [ ] 커스텀 도메인 지원 (CNAME)
- [ ] 딥링크 만료 시간 설정
- [ ] QR 코드 자동 생성

#### 보안 강화
- [ ] Rate Limiting (API 호출 제한)
- [ ] IP 화이트리스트
- [ ] 웹훅을 통한 클릭 이벤트 전송
- [ ] API 키 순환 (Rotation)

#### 분석 및 모니터링
- [ ] 실시간 클릭 대시보드
- [ ] 디바이스/OS 버전 통계
- [ ] 지역별 클릭 분포
- [ ] 시간대별 트래픽 분석
- [ ] 전환율 추적 (앱 설치 여부)

#### 성능 최적화
- [ ] 딥링크 조회 캐싱 (Redis)
- [ ] CDN을 통한 정적 리소스 배포
- [ ] 데이터베이스 인덱스 최적화
- [ ] shortCode 생성 시 충돌 방지 메커니즘

---

## 11. 코드 참조

### 11.1 핵심 파일 위치

| 기능 | 파일 경로 | 주요 기능 |
|------|-----------|----------|
| URL 리라이팅 | `src/utils/supabase/middleware.ts:4-72` | 서브도메인 → /link/[id] 변환 |
| 딥링크 생성 API | `src/app/api/deeplink/route.ts:125-310` | POST 요청 처리 |
| 딥링크 조회 API | `src/app/api/deeplink/route.ts:31-123` | GET 요청 처리 |
| 딥링크 리디렉션 | `src/app/link/[id]/page.tsx:139-175` | 플랫폼 감지 및 리디렉션 |
| iOS AASA | `src/app/api/apple-app-site-association/route.ts:16-99` | Universal Link 설정 |
| Android DAL | `src/app/api/assetlinks/route.ts:16-88` | App Link 설정 |
| 데이터베이스 스키마 | `src/utils/supabase/schema.type.ts:9-444` | TypeScript 타입 정의 |
| 서버 액션 | `src/utils/action/server.ts:47-527` | 딥링크 CRUD 로직 |

### 11.2 마이그레이션 파일

| 파일명 | 설명 |
|--------|------|
| `20251024034635_rename_projects_to_workspaces.sql` | projects → workspaces 테이블 명칭 변경, sub_domain 필수화 |
| `20251024045204_add_source_to_deeplinks.sql` | deeplinks 테이블에 source 필드 추가 |

---

## 12. 테스트 시나리오

### 12.1 딥링크 생성 테스트

```bash
# API 키로 딥링크 생성
curl -X POST https://depl.link/api/deeplink \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-product",
    "app_params": {
      "product_id": "123",
      "category": "electronics"
    },
    "social_meta": {
      "title": "Test Product",
      "description": "This is a test product",
      "thumbnail_url": "https://example.com/image.jpg"
    }
  }'

# 예상 응답
{
  "success": true,
  "deeplink_url": "https://myapp.depl.link/aB3x",
  "created_at": "2025-10-24T12:00:00.000Z"
}
```

### 12.2 딥링크 조회 테스트

```bash
# client_key로 딥링크 조회
curl -X GET "https://depl.link/api/deeplink?short_code=aB3x" \
  -H "Authorization: Bearer YOUR_CLIENT_KEY"
```

### 12.3 리디렉션 테스트

**Android 디바이스**
```bash
# User-Agent를 Android로 설정
curl -A "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36" \
  -L https://myapp.depl.link/aB3x

# 예상: intent:// URL로 리디렉션
```

**iOS 디바이스**
```bash
# User-Agent를 iPhone으로 설정
curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
  -L https://myapp.depl.link/aB3x

# 예상: App Store URL로 리디렉션
```

**데스크탑**
```bash
# 일반 브라우저 User-Agent
curl https://myapp.depl.link/aB3x

# 예상: "This link requires a mobile device..." 메시지
```

### 12.4 Universal Link / App Link 검증

**iOS AASA 파일 확인**
```bash
curl https://myapp.depl.link/.well-known/apple-app-site-association
```

**Android DAL 파일 확인**
```bash
curl https://myapp.depl.link/.well-known/assetlinks.json
```

---

## 13. 용어 정리

| 용어 | 설명 |
|------|------|
| **딥링크 (Deep Link)** | 앱의 특정 화면으로 직접 이동하는 링크 |
| **Universal Link** | iOS에서 앱과 웹을 연결하는 Apple의 딥링크 기술 |
| **App Link** | Android에서 앱과 웹을 연결하는 Google의 딥링크 기술 |
| **shortCode** | 딥링크의 고유 식별자 (예: aB3x) |
| **slug** | 사용자가 정의한 딥링크 식별자 (예: product-detail) |
| **서브도메인 (subdomain)** | 워크스페이스 전용 도메인 (예: myapp.depl.link) |
| **Intent URL** | Android에서 앱을 실행하기 위한 특수 URL 형식 |
| **AASA** | Apple App Site Association - iOS Universal Link 설정 파일 |
| **DAL** | Digital Asset Links - Android App Link 설정 파일 |
| **app_params** | 앱에 전달할 커스텀 파라미터 (자유 형식 JSON) |
| **social_meta** | Open Graph 태그를 위한 메타데이터 |
| **workspace** | 멀티 테넌트의 기본 단위 (구 projects) |

---

## 14. 참고 자료

### 14.1 공식 문서
- [iOS Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android App Links](https://developer.android.com/training/app-links)
- [Open Graph Protocol](https://ogp.me/)

### 14.2 관련 기술 스택 문서
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**문서 버전**: 1.0
**최종 수정일**: 2025-10-24
**작성자**: Claude Code Analysis
