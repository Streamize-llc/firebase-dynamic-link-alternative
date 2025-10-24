#!/bin/bash

# Deeplink API 간단 테스트 (cURL 사용)
# 사용법: ./test-curl.sh

echo "🚀 Deeplink API 테스트 (cURL)"
echo ""

# ========================================
# 설정 (여기에 실제 값을 입력하세요)
# ========================================
API_KEY="${TEST_API_KEY:-YOUR_API_KEY_HERE}"
CLIENT_KEY="${TEST_CLIENT_KEY:-YOUR_CLIENT_KEY_HERE}"
BASE_URL="${TEST_BASE_URL:-http://localhost:3000}"
SUBDOMAIN="${TEST_SUBDOMAIN:-test}"

echo "📋 설정:"
echo "  - Base URL: $BASE_URL"
echo "  - Subdomain: $SUBDOMAIN"
echo "  - API Key: ${API_KEY:0:10}..."
echo ""

# ========================================
# Test 1: 딥링크 생성
# ========================================
echo "========================================="
echo "TEST 1: 딥링크 생성"
echo "========================================="

TIMESTAMP=$(date +%s)
PAYLOAD=$(cat <<EOF
{
  "slug": "test-product-$TIMESTAMP",
  "app_params": {
    "product_id": "12345",
    "category": "electronics",
    "ref": "curl-test"
  },
  "social_meta": {
    "title": "🎉 cURL 테스트 상품",
    "description": "이것은 cURL을 사용한 API 테스트입니다.",
    "thumbnail_url": "https://via.placeholder.com/1200x630.png?text=cURL+Test"
  }
}
EOF
)

echo "📤 요청 데이터:"
echo "$PAYLOAD" | jq '.'
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/deeplink" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "✅ HTTP 상태: $HTTP_CODE"
echo "📥 응답 데이터:"
echo "$BODY" | jq '.'
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  DEEPLINK_URL=$(echo "$BODY" | jq -r '.deeplink_url')
  SHORT_CODE=$(echo "$DEEPLINK_URL" | awk -F'/' '{print $NF}')

  echo "🔗 생성된 딥링크: $DEEPLINK_URL"
  echo "🔑 Short Code: $SHORT_CODE"
  echo ""

  # ========================================
  # Test 2: 딥링크 조회
  # ========================================
  echo "========================================="
  echo "TEST 2: 딥링크 조회"
  echo "========================================="

  sleep 1

  RESPONSE2=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/deeplink?short_code=$SHORT_CODE" \
    -H "Authorization: Bearer $CLIENT_KEY")

  HTTP_CODE2=$(echo "$RESPONSE2" | tail -n1)
  BODY2=$(echo "$RESPONSE2" | sed '$d')

  echo "✅ HTTP 상태: $HTTP_CODE2"
  echo "📥 응답 데이터:"
  echo "$BODY2" | jq '.'
  echo ""

  # ========================================
  # Test 3: 메타 태그 확인 (크롤러)
  # ========================================
  echo "========================================="
  echo "TEST 3: 소셜 메타 태그 확인"
  echo "========================================="

  TEST_URL="$BASE_URL/$SHORT_CODE"
  # localhost를 서브도메인으로 변환
  if [[ "$BASE_URL" == *"localhost"* ]]; then
    TEST_URL="${BASE_URL/localhost/${SUBDOMAIN}.localhost}/$SHORT_CODE"
  fi

  echo "📤 요청 URL: $TEST_URL"
  echo "🤖 User-Agent: facebookexternalhit/1.1"
  echo ""

  HTML=$(curl -s -A "facebookexternalhit/1.1" "$TEST_URL")

  echo "📋 메타 태그:"
  echo "$HTML" | grep -o '<meta property="og:[^"]*" content="[^"]*"' | head -n 5
  echo ""

  # ========================================
  # Test 4: Android 시뮬레이션
  # ========================================
  echo "========================================="
  echo "TEST 4: Android User-Agent"
  echo "========================================="

  echo "📤 요청 URL: $TEST_URL"
  echo "📱 User-Agent: Android"
  echo ""

  ANDROID_HTML=$(curl -s -A "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36" "$TEST_URL")

  if echo "$ANDROID_HTML" | grep -q "window.location.href"; then
    echo "✅ Client-side 리디렉션 감지됨"
    INTENT_URL=$(echo "$ANDROID_HTML" | grep -o 'window.location.href\s*=\s*[^;]*' | head -n1)
    echo "🔗 리디렉션: $INTENT_URL"
  fi

  if echo "$ANDROID_HTML" | grep -q "앱으로 이동 중"; then
    echo "✅ 로딩 UI 표시됨"
  fi
  echo ""

  # ========================================
  # Test 5: iOS 시뮬레이션
  # ========================================
  echo "========================================="
  echo "TEST 5: iOS User-Agent"
  echo "========================================="

  echo "📤 요청 URL: $TEST_URL"
  echo "📱 User-Agent: iPhone"
  echo ""

  IOS_HTML=$(curl -s -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15" "$TEST_URL")

  if echo "$IOS_HTML" | grep -q "apple-itunes-app"; then
    echo "✅ iOS Smart App Banner 감지됨"
    APP_ID=$(echo "$IOS_HTML" | grep -o 'app-id=[0-9]*' | head -n1)
    echo "📱 $APP_ID"
  fi

  if echo "$IOS_HTML" | grep -q "window.location.href"; then
    echo "✅ Client-side 리디렉션 감지됨"
  fi
  echo ""

  # ========================================
  # 최종 결과
  # ========================================
  echo "========================================="
  echo "✅ 모든 테스트 완료!"
  echo "========================================="
  echo ""
  echo "🔗 테스트 링크: $TEST_URL"
  echo ""
  echo "💡 다음 단계:"
  echo "  1. 브라우저에서 위 링크를 열어보세요"
  echo "  2. Chrome DevTools로 모바일 시뮬레이션 해보세요"
  echo "  3. 실제 모바일 디바이스에서 테스트해보세요"
  echo ""

else
  echo "❌ 딥링크 생성 실패"
  echo "에러: $BODY"
  exit 1
fi
