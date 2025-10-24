# 🧪 Deeplink API 테스트

API가 정상적으로 작동하는지 확인하기 위한 테스트 도구들입니다.

## 📋 테스트 파일

1. **`test-deeplink-api.js`** - Node.js 테스트 스크립트 (상세한 출력)
2. **`test-curl.sh`** - Bash + cURL 테스트 스크립트 (빠른 테스트)
3. **`TEST_GUIDE.md`** - 상세한 테스트 가이드

## 🚀 빠른 시작

### 1단계: API 키 확인

먼저 워크스페이스의 API 키를 확인하세요:

```bash
# Supabase CLI로 조회
npx supabase db remote exec "SELECT name, sub_domain, api_key, client_key FROM workspaces LIMIT 1;"
```

또는 대시보드에서:
```
http://localhost:3000/dashboard → 워크스페이스 선택 → 설정
```

### 2단계: 테스트 실행

**방법 A: cURL 스크립트 (가장 간단)**
```bash
# 환경 변수로 API 키 설정
export TEST_API_KEY="your_api_key_here"
export TEST_CLIENT_KEY="your_client_key_here"
export TEST_SUBDOMAIN="test"

# 테스트 실행
./test-curl.sh
```

**방법 B: Node.js 스크립트 (상세한 출력)**
```bash
# 환경 변수 설정
export TEST_API_KEY="your_api_key_here"
export TEST_CLIENT_KEY="your_client_key_here"
export TEST_SUBDOMAIN="test"

# 테스트 실행
node test-deeplink-api.js
```

**방법 C: 수동 테스트 (cURL)**
```bash
# 1. 딥링크 생성
curl -X POST http://localhost:3000/api/deeplink \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-product",
    "app_params": {
      "product_id": "12345"
    },
    "social_meta": {
      "title": "테스트 상품",
      "description": "테스트 설명",
      "thumbnail_url": "https://via.placeholder.com/1200x630"
    }
  }'

# 2. 생성된 shortCode로 조회
curl -X GET "http://localhost:3000/api/deeplink?short_code=aBc123" \
  -H "Authorization: Bearer YOUR_CLIENT_KEY"

# 3. 브라우저에서 접속
# http://test.localhost:3000/aBc123
```

## ✅ 테스트 체크리스트

### API 테스트
- [ ] 딥링크 생성 API (POST /api/deeplink)
- [ ] 딥링크 조회 API (GET /api/deeplink)
- [ ] API 키 인증 확인
- [ ] 에러 응답 확인

### 메타 태그 테스트
- [ ] Open Graph 태그 (og:title, og:description, og:image)
- [ ] Twitter Card 태그
- [ ] iOS Smart App Banner

### 리디렉션 테스트
- [ ] Android → Intent URL 생성
- [ ] iOS → Universal Link URL 생성
- [ ] Desktop → 안내 메시지 표시
- [ ] 크롤러 → HTML + 메타 태그 반환 (리디렉션 없음)

### 클릭 추적 테스트
- [ ] 딥링크 클릭 시 click_count 증가
- [ ] 워크스페이스 current_monthly_click_count 증가
- [ ] 대시보드에서 통계 확인

### 데이터베이스 테스트
- [ ] shortCode 중복 체크 작동
- [ ] unique constraint 확인
- [ ] RPC 함수 실행 확인

## 🔍 문제 해결

### "Invalid API key"
```bash
# API 키 확인
npx supabase db remote exec "SELECT api_key FROM workspaces WHERE sub_domain = 'test';"
```

### "Migration not applied"
```bash
# Migration 상태 확인
npx supabase db remote exec "SELECT name FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 5;"

# Migration 재적용
npm run db:push
```

### "Click count not increasing"
```bash
# RPC 함수 확인
npx supabase db remote exec "SELECT routine_name FROM information_schema.routines WHERE routine_name LIKE 'increment%';"
```

## 📱 실제 디바이스 테스트

### Android 디바이스
1. 프로덕션 환경에 배포
2. Android 폰에서 딥링크 클릭
3. 앱 실행 확인 또는 Play Store 이동 확인

### iOS 디바이스
1. 프로덕션 환경에 배포
2. iPhone에서 딥링크 클릭
3. Universal Link 작동 확인
4. Smart App Banner 표시 확인

## 🌐 소셜 공유 테스트

### Facebook
```
https://developers.facebook.com/tools/debug/
```
→ 딥링크 URL 입력 → 썸네일 확인

### Twitter
```
https://cards-dev.twitter.com/validator
```
→ 딥링크 URL 입력 → Card 프리뷰 확인

### LinkedIn
```
https://www.linkedin.com/post-inspector/
```
→ 딥링크 URL 입력 → 미리보기 확인

## 📊 예상 결과

성공적인 테스트 결과:

```
✅ TEST 1: 딥링크 생성 - 200 OK
✅ TEST 2: 딥링크 조회 - 200 OK
✅ TEST 3: 메타 태그 확인 - og:title, og:image 발견
✅ TEST 4: Android - Intent URL 생성됨
✅ TEST 5: iOS - Universal Link URL 생성됨

🔗 테스트 링크: http://test.localhost:3000/aBc123
```

## 💡 팁

1. **개발 서버 실행 확인**
   ```bash
   npm run dev
   ```

2. **로그 확인**
   - 브라우저 개발자 도구 콘솔
   - Next.js 서버 로그
   - Supabase 로그

3. **데이터 확인**
   ```bash
   npx supabase db remote exec "SELECT * FROM deeplinks ORDER BY created_at DESC LIMIT 5;"
   ```

---

**문제가 있나요?** [DEEPLINK_ISSUES.md](./DEEPLINK_ISSUES.md)를 확인하세요!
