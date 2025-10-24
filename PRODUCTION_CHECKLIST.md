# 🚀 프로덕션 배포 체크리스트

**배포 전 필수 확인 사항**

---

## 📋 배포 전 체크리스트

### 1. 환경 변수 설정 ✅

**Vercel 또는 호스팅 플랫폼에서 설정:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mehrqmrtkpvoyjjmvymi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Node 환경
NODE_ENV=production
```

**확인 방법:**
```bash
# Vercel
vercel env ls

# 또는 Vercel 대시보드에서 확인
# Settings > Environment Variables
```

---

### 2. DNS & 도메인 설정 ⚠️

**필수 설정:**

#### A. 메인 도메인 (depl.link)
```
Type: A / CNAME
Name: @
Value: [Vercel IP 또는 CNAME]
```

#### B. 와일드카드 서브도메인 (*.depl.link)
```
Type: A / CNAME
Name: *
Value: [Vercel IP 또는 CNAME]
```

**확인 방법:**
```bash
# 메인 도메인 확인
dig depl.link

# 서브도메인 확인
dig test.depl.link
dig myapp.depl.link
```

**Vercel 설정:**
1. Vercel 대시보드 → Settings → Domains
2. `depl.link` 추가
3. `*.depl.link` 추가 (와일드카드)
4. SSL 인증서 자동 발급 대기 (Let's Encrypt)

---

### 3. 모바일 앱 설정 확인 🔴

#### A. iOS Universal Links

**1) apps 테이블에 데이터 확인:**
```sql
SELECT
  workspace_id,
  platform,
  bundle_id,
  app_store_id
FROM apps
WHERE platform = 'ios';
```

**2) AASA 파일 테스트:**
```bash
# 로컬에서 테스트
curl http://localhost:3000/.well-known/apple-app-site-association

# 프로덕션에서 테스트 (배포 후)
curl https://test.depl.link/.well-known/apple-app-site-association
```

**예상 응답:**
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.yourapp.bundle",
        "paths": ["*"]
      }
    ]
  }
}
```

**3) iOS 앱 코드 확인:**
- Associated Domains 설정: `applinks:test.depl.link`
- AppDelegate에서 Universal Link 처리 구현

---

#### B. Android App Links

**1) apps 테이블에 데이터 확인:**
```sql
SELECT
  workspace_id,
  platform,
  package_name,
  sha256_cert_fingerprints
FROM apps
WHERE platform = 'android';
```

**2) assetlinks.json 테스트:**
```bash
# 로컬에서 테스트
curl http://localhost:3000/.well-known/assetlinks.json

# 프로덕션에서 테스트 (배포 후)
curl https://test.depl.link/.well-known/assetlinks.json
```

**예상 응답:**
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourapp.package",
      "sha256_cert_fingerprints": ["AA:BB:CC:..."]
    }
  }
]
```

**3) Android 앱 코드 확인:**
- AndroidManifest.xml에 intent-filter 추가
- Deep Link 처리 Activity 구현

---

### 4. 데이터베이스 Migration 🟢

**확인:**
```bash
# 원격 DB에 migration 적용 확인
npx supabase db remote exec "
SELECT name
FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 5;
"
```

**필수 확인 사항:**
- ✅ `20251024120000_fix_deeplink_issues.sql` 적용됨
- ✅ `increment_click_count` 함수 존재
- ✅ `increment_workspace_click` 함수 존재
- ✅ `deeplinks_workspace_short_code_unique` constraint 존재

---

### 5. 실제 모바일 디바이스 테스트 🔴

#### A. 테스트 딥링크 생성

**1) API로 실제 딥링크 생성:**
```bash
curl -X POST https://depl.link/api/deeplink \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-product-001",
    "app_params": {
      "product_id": "12345",
      "category": "test"
    },
    "social_meta": {
      "title": "실제 프로덕션 테스트",
      "description": "모바일 디바이스에서 테스트 중",
      "thumbnail_url": "https://your-cdn.com/image.jpg"
    }
  }'
```

**2) 응답에서 딥링크 URL 확인:**
```json
{
  "success": true,
  "deeplink_url": "https://yourworkspace.depl.link/aBc123",
  "created_at": "2025-10-24T..."
}
```

---

#### B. iOS 디바이스 테스트

**테스트 시나리오:**

1. **앱이 설치된 경우:**
   - Safari에서 딥링크 클릭
   - → 앱이 바로 열려야 함
   - → `product_id=12345` 파라미터가 앱에 전달되어야 함

2. **앱이 설치 안 된 경우:**
   - Safari에서 딥링크 클릭
   - → Smart App Banner 표시되어야 함
   - → App Store로 이동해야 함

**디버깅:**
```bash
# iOS 콘솔에서 로그 확인
# Xcode > Devices and Simulators > 디바이스 선택 > Show Console
```

---

#### C. Android 디바이스 테스트

**테스트 시나리오:**

1. **앱이 설치된 경우:**
   - Chrome에서 딥링크 클릭
   - → "앱으로 열기" 다이얼로그 표시
   - → 앱이 열리고 파라미터 전달됨

2. **앱이 설치 안 된 경우:**
   - Chrome에서 딥링크 클릭
   - → Play Store로 리디렉션되어야 함

**디버깅:**
```bash
# Android logcat으로 Intent 확인
adb logcat | grep -i "intent"
```

---

### 6. 소셜 미디어 메타 태그 테스트 🟡

#### A. Facebook Debugger
```
https://developers.facebook.com/tools/debug/
```

**테스트:**
1. 딥링크 URL 입력: `https://yourworkspace.depl.link/aBc123`
2. "Fetch new information" 클릭
3. **확인 사항:**
   - ✅ og:title 표시됨
   - ✅ og:description 표시됨
   - ✅ og:image 썸네일 표시됨
   - ✅ 에러 없음

---

#### B. Twitter Card Validator
```
https://cards-dev.twitter.com/validator
```

**테스트:**
1. 딥링크 URL 입력
2. "Preview card" 클릭
3. **확인 사항:**
   - ✅ Card 타입: summary_large_image
   - ✅ 제목, 설명, 이미지 모두 표시됨

---

#### C. LinkedIn Post Inspector
```
https://www.linkedin.com/post-inspector/
```

**테스트:**
1. 딥링크 URL 입력
2. "Inspect" 클릭
3. 미리보기 확인

---

### 7. 클릭 추적 확인 🟢

**테스트:**
1. 딥링크 클릭 (실제 디바이스 또는 브라우저)
2. 대시보드에서 통계 확인

```sql
-- 딥링크별 클릭 수 확인
SELECT
  short_code,
  slug,
  click_count,
  created_at
FROM deeplinks
WHERE workspace_id = 'YOUR_WORKSPACE_ID'
ORDER BY click_count DESC
LIMIT 10;

-- 워크스페이스 월별 클릭 수 확인
SELECT
  name,
  current_monthly_click_count,
  current_monthly_create_count
FROM workspaces
WHERE id = 'YOUR_WORKSPACE_ID';
```

---

### 8. 에러 모니터링 설정 ⚠️

**권장 도구:**
- Sentry
- LogRocket
- Vercel Analytics

**최소한:**
```bash
# Vercel 로그 확인
vercel logs [deployment-url] --follow
```

---

## 🎯 배포 순서

### 1단계: 준비
- [ ] 환경 변수 설정 (Vercel/호스팅)
- [ ] DNS 설정 (*.depl.link)
- [ ] apps 테이블에 실제 앱 정보 입력

### 2단계: 배포
```bash
# 프로덕션 빌드 테스트
npm run build

# Vercel 배포
vercel --prod

# 또는 GitHub에 push (자동 배포 설정된 경우)
git push origin main
```

### 3단계: 검증
- [ ] AASA 파일 접근 가능 확인
- [ ] assetlinks.json 접근 가능 확인
- [ ] 테스트 딥링크 생성 (API)
- [ ] 로컬에서 딥링크 클릭 테스트

### 4단계: 실제 디바이스 테스트
- [ ] iOS 디바이스에서 테스트 (앱 설치/미설치)
- [ ] Android 디바이스에서 테스트 (앱 설치/미설치)
- [ ] Facebook/Twitter에서 공유 테스트

### 5단계: 모니터링
- [ ] 클릭 통계 확인
- [ ] 에러 로그 확인
- [ ] 응답 시간 모니터링

---

## ⚠️ 알려진 이슈

### 1. 중복 slug 데이터
- `deeplinks_workspace_slug_unique` constraint가 적용 안 됨
- 기존 중복 데이터 정리 필요

**해결 방법:**
```sql
-- 중복 slug 확인
SELECT workspace_id, slug, COUNT(*)
FROM deeplinks
GROUP BY workspace_id, slug
HAVING COUNT(*) > 1;

-- 중복 데이터 정리 후 constraint 추가
-- (수동으로 처리 필요)
```

---

## 🆘 문제 발생 시

### 1. "Invalid API key" 에러
```bash
# API 키 확인
SELECT api_key, client_key
FROM workspaces
WHERE sub_domain = 'yourworkspace';
```

### 2. AASA 파일이 빈 객체로 반환됨
- `apps` 테이블에 iOS 앱 정보가 있는지 확인
- `workspace_id`가 올바른지 확인
- 서브도메인이 올바르게 설정되었는지 확인

### 3. 딥링크가 404 에러
- 미들웨어가 제대로 작동하는지 확인
- Vercel에서 와일드카드 도메인이 추가되었는지 확인

### 4. 소셜 메타 태그가 안 보임
- Facebook Debugger에서 캐시 초기화
- User-Agent 크롤러 감지 로직 확인
- `generateMetadata` 함수에서 데이터를 제대로 가져오는지 확인

---

## ✅ 최종 체크

배포 전 이 모든 항목을 확인하세요:

- [ ] 환경 변수 설정
- [ ] DNS 와일드카드 서브도메인 설정
- [ ] SSL 인증서 발급 확인
- [ ] apps 테이블에 실제 앱 정보 있음
- [ ] AASA 파일 접근 가능
- [ ] assetlinks.json 접근 가능
- [ ] Migration 모두 적용됨
- [ ] 테스트 딥링크 생성 성공
- [ ] iOS 실제 디바이스 테스트 완료
- [ ] Android 실제 디바이스 테스트 완료
- [ ] Facebook/Twitter 메타 태그 검증 완료
- [ ] 클릭 추적 작동 확인

**모든 항목이 체크되면 프로덕션에서 사용 가능합니다! 🚀**
