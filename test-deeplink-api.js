#!/usr/bin/env node

/**
 * Deeplink API 테스트 스크립트
 *
 * 사용법:
 * 1. .env.local 파일에 TEST_API_KEY와 TEST_CLIENT_KEY 추가
 * 2. node test-deeplink-api.js
 */

const https = require('https');
const http = require('http');

// ========================================
// 설정
// ========================================
const config = {
  // 환경 변수에서 읽기 (또는 직접 입력)
  apiKey: process.env.TEST_API_KEY || 'YOUR_API_KEY_HERE',
  clientKey: process.env.TEST_CLIENT_KEY || 'YOUR_CLIENT_KEY_HERE',
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  subdomain: process.env.TEST_SUBDOMAIN || 'test'
};

// ========================================
// HTTP 요청 헬퍼
// ========================================
function makeRequest(url, options, postData = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = lib.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// ========================================
// 테스트 함수들
// ========================================

async function test1_createDeeplink() {
  console.log('\n========================================');
  console.log('TEST 1: Create Deeplink (POST /api/deeplink)');
  console.log('========================================');

  const payload = {
    slug: `test-product-${Date.now()}`,
    app_params: {
      product_id: '12345',
      category: 'electronics',
      ref: 'test'
    },
    social_meta: {
      title: '🎉 테스트 상품',
      description: '이것은 API 테스트용 딥링크입니다.',
      thumbnail_url: 'https://via.placeholder.com/1200x630.png?text=Test+Product'
    }
  };

  console.log('📤 Request data:', JSON.stringify(payload, null, 2));

  try {
    const response = await makeRequest(
      `${config.baseUrl}/api/deeplink`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      },
      JSON.stringify(payload)
    );

    console.log(`\n✅ Response status: ${response.status}`);
    console.log('📥 Response data:', JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.deeplink_url) {
      console.log(`\n🔗 Created deeplink: ${response.data.deeplink_url}`);

      // shortCode 추출
      const shortCode = response.data.deeplink_url.split('/').pop();
      return shortCode;
    } else {
      console.error('❌ 딥링크 생성 실패');
      return null;
    }
  } catch (error) {
    console.error('❌ 에러:', error.message);
    return null;
  }
}

async function test2_getDeeplink(shortCode) {
  console.log('\n========================================');
  console.log('TEST 2: Get Deeplink (GET /api/deeplink)');
  console.log('========================================');

  console.log(`📤 ShortCode to retrieve: ${shortCode}`);

  try {
    const response = await makeRequest(
      `${config.baseUrl}/api/deeplink?short_code=${shortCode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.clientKey}`
        }
      }
    );

    console.log(`\n✅ Response status: ${response.status}`);
    console.log('📥 Response data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('❌ 에러:', error.message);
    return null;
  }
}

async function test3_checkMetaTags(shortCode) {
  console.log('\n========================================');
  console.log('TEST 3: Check Social Meta Tags (Crawler Simulation)');
  console.log('========================================');

  const deeplinkUrl = `${config.baseUrl.replace('http://', `http://${config.subdomain}.`).replace('https://', `https://${config.subdomain}.`)}/${shortCode}`;
  console.log(`📤 Request URL: ${deeplinkUrl}`);
  console.log('🤖 User-Agent: facebookexternalhit/1.1');

  try {
    const urlObj = new URL(deeplinkUrl);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    const response = await new Promise((resolve, reject) => {
      const req = lib.request({
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'facebookexternalhit/1.1'
        }
      }, (res) => {
        let html = '';
        res.on('data', (chunk) => { html += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode, html });
        });
      });

      req.on('error', reject);
      req.end();
    });

    console.log(`\n✅ Response status: ${response.status}`);

    // 메타 태그 추출
    const metaTags = {
      'og:title': (response.html.match(/<meta property="og:title" content="([^"]+)"/) || [])[1],
      'og:description': (response.html.match(/<meta property="og:description" content="([^"]+)"/) || [])[1],
      'og:image': (response.html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1],
      'twitter:card': (response.html.match(/<meta name="twitter:card" content="([^"]+)"/) || [])[1],
    };

    console.log('\n📋 Found Meta Tags:');
    Object.entries(metaTags).forEach(([key, value]) => {
      if (value) {
        console.log(`  ✅ ${key}: ${value}`);
      } else {
        console.log(`  ❌ ${key}: (none)`);
      }
    });

    return metaTags;
  } catch (error) {
    console.error('❌ 에러:', error.message);
    return null;
  }
}

async function test4_androidUserAgent(shortCode) {
  console.log('\n========================================');
  console.log('TEST 4: Android User-Agent Test');
  console.log('========================================');

  const deeplinkUrl = `${config.baseUrl.replace('http://', `http://${config.subdomain}.`).replace('https://', `https://${config.subdomain}.`)}/${shortCode}`;
  console.log(`📤 Request URL: ${deeplinkUrl}`);
  console.log('📱 User-Agent: Android');

  try {
    const urlObj = new URL(deeplinkUrl);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    const response = await new Promise((resolve, reject) => {
      const req = lib.request({
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36'
        }
      }, (res) => {
        let html = '';
        res.on('data', (chunk) => { html += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode, html, headers: res.headers });
        });
      });

      req.on('error', reject);
      req.end();
    });

    console.log(`\n✅ Response status: ${response.status}`);

    // Check for client-side redirection
    if (response.html.includes('window.location.href')) {
      console.log('✅ Client-side redirection detected');
      const intentMatch = response.html.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
      if (intentMatch) {
        console.log(`🔗 Redirect URL: ${intentMatch[1].substring(0, 100)}...`);
      }
    }

    // Check for loading UI
    if (response.html.includes('앱으로 이동 중')) {
      console.log('✅ Loading UI displayed');
    }

    return response;
  } catch (error) {
    console.error('❌ 에러:', error.message);
    return null;
  }
}

async function test5_iOSUserAgent(shortCode) {
  console.log('\n========================================');
  console.log('TEST 5: iOS User-Agent Test');
  console.log('========================================');

  const deeplinkUrl = `${config.baseUrl.replace('http://', `http://${config.subdomain}.`).replace('https://', `https://${config.subdomain}.`)}/${shortCode}`;
  console.log(`📤 Request URL: ${deeplinkUrl}`);
  console.log('📱 User-Agent: iPhone');

  try {
    const urlObj = new URL(deeplinkUrl);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    const response = await new Promise((resolve, reject) => {
      const req = lib.request({
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
        }
      }, (res) => {
        let html = '';
        res.on('data', (chunk) => { html += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode, html, headers: res.headers });
        });
      });

      req.on('error', reject);
      req.end();
    });

    console.log(`\n✅ Response status: ${response.status}`);

    // Check for Smart App Banner
    if (response.html.includes('apple-itunes-app')) {
      console.log('✅ iOS Smart App Banner meta tag found');
      const appIdMatch = response.html.match(/app-id=(\d+)/);
      if (appIdMatch) {
        console.log(`📱 App Store ID: ${appIdMatch[1]}`);
      }
    }

    // Check for Universal Link redirection
    if (response.html.includes('window.location.href')) {
      console.log('✅ Client-side redirection detected');
      const urlMatch = response.html.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
      if (urlMatch) {
        console.log(`🔗 Universal Link URL: ${urlMatch[1]}`);
      }
    }

    return response;
  } catch (error) {
    console.error('❌ 에러:', error.message);
    return null;
  }
}

// ========================================
// 메인 테스트 실행
// ========================================
async function runAllTests() {
  console.log('🚀 Starting Deeplink API Test\n');
  console.log('Configuration:');
  console.log(`  - Base URL: ${config.baseUrl}`);
  console.log(`  - Subdomain: ${config.subdomain}`);
  console.log(`  - API Key: ${config.apiKey.substring(0, 10)}...`);
  console.log(`  - Client Key: ${config.clientKey.substring(0, 10)}...`);

  try {
    // Test 1: 딥링크 생성
    const shortCode = await test1_createDeeplink();

    if (!shortCode) {
      console.error('\n❌ 딥링크 생성 실패. 테스트 중단.');
      process.exit(1);
    }

    // 잠시 대기 (DB 반영 시간)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: 딥링크 조회
    await test2_getDeeplink(shortCode);

    // Test 3: 메타 태그 확인
    await test3_checkMetaTags(shortCode);

    // Test 4: Android
    await test4_androidUserAgent(shortCode);

    // Test 5: iOS
    await test5_iOSUserAgent(shortCode);

    console.log('\n========================================');
    console.log('✅ All tests completed!');
    console.log('========================================\n');
    console.log(`🔗 Test link: ${config.baseUrl.replace('http://', `http://${config.subdomain}.`).replace('https://', `https://${config.subdomain}.`)}/${shortCode}`);
    console.log('\n💡 Open the link above in your browser!');
    console.log('💡 Test on mobile devices too!');

  } catch (error) {
    console.error('\n❌ 테스트 실패:', error);
    process.exit(1);
  }
}

// 실행
runAllTests();
