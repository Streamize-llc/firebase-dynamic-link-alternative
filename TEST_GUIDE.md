# Deeplink API 테스트 가이드

## 1. 사전 준비

### 1-1. 개발 서버 실행
```bash
npm run dev
```

### 1-2. Supabase에서 테스트용 API 키 가져오기

**방법 1: 대시보드에서 확인**
1. 브라우저에서 `http://localhost:3000/dashboard` 접속
2. 워크스페이스 선택
3. 설정 또는 API 키 페이지에서 복사

**방법 2: Supabase 대시보드에서 직접 조회**
```sql
SELECT
  name,
  sub_domain,
  api_key,
  client_key
FROM workspaces
LIMIT 1;
```

## 2. 테스트 실행 방법

### 방법 1: 환경 변수로 실행 (권장)
```bash
TEST_API_KEY="your_api_key_here" \
TEST_CLIENT_KEY="your_client_key_here" \
TEST_SUBDOMAIN="your_subdomain_here" \
node test-deeplink-api.js
```

### 방법 2: .env.local 파일 생성
```bash
# .env.local 파일 생성
cat > .env.local << EOF
TEST_API_KEY=your_api_key_here
TEST_CLIENT_KEY=your_client_key_here
TEST_SUBDOMAIN=your_subdomain_here
TEST_BASE_URL=http://localhost:3000
EOF

# 테스트 실행
node test-deeplink-api.js
```

### 방법 3: 스크립트 직접 수정
`test-deeplink-api.js` 파일을 열어서 다음 부분을 수정:
```javascript
const config = {
  apiKey: 'YOUR_API_KEY_HERE',           // ← 여기에 API 키 입력
  clientKey: 'YOUR_CLIENT_KEY_HERE',     // ← 여기에 Client 키 입력
  baseUrl: 'http://localhost:3000',
  subdomain: 'test'                       // ← 여기에 서브도메인 입력
};
```

## 3. 테스트 시나리오

스크립트는 다음 5가지 테스트를 자동으로 실행합니다:

### ✅ Test 1: 딥링크 생성 (POST /api/deeplink)
- API 키로 인증
- 테스트 딥링크 생성
- shortCode 반환 확인

### ✅ Test 2: 딥링크 조회 (GET /api/deeplink)
- Client 키로 인증
- 생성된 딥링크 정보 조회

### ✅ Test 3: 소셜 메타 태그 확인
- Facebook 크롤러 User-Agent로 요청
- Open Graph 메타 태그 파싱
- og:title, og:description, og:image 확인

### ✅ Test 4: Android 리디렉션
- Android User-Agent로 요청
- Intent URL 생성 확인
- 로딩 UI 표시 확인

### ✅ Test 5: iOS 리디렉션
- iOS User-Agent로 요청
- Universal Link URL 확인
- Smart App Banner 메타 태그 확인

## 4. 예상 출력

```
🚀 Deeplink API 테스트 시작

설정:
  - Base URL: http://localhost:3000
  - Subdomain: test
  - API Key: sk_test_ab...
  - Client Key: pk_test_cd...

========================================
TEST 1: 딥링크 생성 (POST /api/deeplink)
========================================
📤 요청 데이터: {...}
✅ 응답 상태: 200
📥 응답 데이터: {...}
🔗 생성된 딥링크: https://test.depl.link/aBc123

========================================
TEST 2: 딥링크 조회 (GET /api/deeplink)
========================================
...

========================================
✅ 모든 테스트 완료!
========================================

🔗 테스트 링크: http://test.localhost:3000/aBc123

💡 브라우저에서 위 링크를 열어보세요!
💡 모바일 디바이스에서도 테스트해보세요!
```

## 5. 수동 테스트 (브라우저)

### 5-1. 데스크탑에서 테스트
```
http://test.localhost:3000/aBc123
```
→ "This link requires a mobile device..." 메시지 표시되어야 함

### 5-2. Chrome DevTools로 모바일 시뮬레이션
1. F12 → 모바일 아이콘 클릭
2. iPhone 또는 Galaxy 선택
3. 링크 접속
4. 1초 후 자동 리디렉션 확인

### 5-3. 소셜 공유 시뮬레이션
**Facebook Debugger**
```
https://developers.facebook.com/tools/debug/
```
→ 딥링크 URL 입력 → 썸네일, 제목, 설명 확인

**Twitter Card Validator**
```
https://cards-dev.twitter.com/validator
```
→ 딥링크 URL 입력 → Card 프리뷰 확인

## 6. 문제 해결

### ❌ "Invalid API key" 에러
- API 키가 올바른지 확인
- workspaces 테이블의 api_key 컬럼 확인

### ❌ "Subdomain not found" 에러
- TEST_SUBDOMAIN이 workspaces.sub_domain과 일치하는지 확인

### ❌ "Failed to generate unique short code" 에러
- Migration이 정상적으로 적용되었는지 확인
- deeplinks 테이블 확인

### ❌ 클릭 수가 증가하지 않음
- increment_click_count 함수가 생성되었는지 확인
- 브라우저 콘솔에서 에러 확인

## 7. 실제 모바일 디바이스 테스트

### Android
1. 프로덕션 URL로 딥링크 생성
2. Android 디바이스에서 링크 클릭
3. 앱이 설치되어 있으면 앱 실행
4. 앱이 없으면 Play Store로 이동

### iOS
1. 프로덕션 URL로 딥링크 생성
2. iPhone에서 링크 클릭
3. Universal Link가 설정되어 있으면 앱 실행
4. 앱이 없으면 Smart Banner 표시

---

**TIP**: 테스트 후 생성된 딥링크는 대시보드에서 클릭 수를 확인할 수 있습니다!
