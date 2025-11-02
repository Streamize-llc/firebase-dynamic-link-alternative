# DEPL User Guideline

**Complete Guide for DEPL Deep Linking Platform**

Version 1.0 | Last Updated: 2025-11-02

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [What is DEPL?](#2-what-is-depl)
3. [Getting Started](#3-getting-started)
4. [Dashboard Overview](#4-dashboard-overview)
5. [Mobile App Configuration](#5-mobile-app-configuration)
6. [Creating Deep Links](#6-creating-deep-links)
7. [API Integration Guide](#7-api-integration-guide)
8. [Mobile App Integration](#8-mobile-app-integration)
9. [URL Routing & Redirection](#9-url-routing--redirection)
10. [Testing Your Deep Links](#10-testing-your-deep-links)
11. [Analytics & Monitoring](#11-analytics--monitoring)
12. [Troubleshooting](#12-troubleshooting)
13. [Best Practices](#13-best-practices)
14. [API Reference](#14-api-reference)
15. [FAQs](#15-faqs)

---

## 1. Introduction

Welcome to **DEPL** - your comprehensive deep linking solution for mobile applications. This guideline provides everything you need to successfully integrate and use DEPL for your iOS and Android apps.

### Who Should Read This Guide?

- Mobile app developers (iOS/Android)
- Backend developers integrating deep linking APIs
- Product managers planning deep link campaigns
- Marketing teams creating promotional deep links

---

## 2. What is DEPL?

### Overview

DEPL is a **Firebase Dynamic Links alternative** that provides:

- **Universal Deep Linking**: One link works across iOS, Android, and web
- **No SDK Required**: Pure REST API integration
- **Platform-Specific Routing**: Automatically detects user's device and redirects appropriately
- **Social Media Optimization**: Rich previews on Facebook, Twitter, WhatsApp, etc.
- **Analytics**: Real-time click tracking and statistics
- **Custom Subdomains**: Brand your links with your own subdomain

### How DEPL Works

```
User clicks link: https://yourapp.depl.link/summer-sale
                           ↓
            DEPL Platform Detection
                           ↓
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
   iOS Device        Android Device      Desktop/Web
        ↓                  ↓                  ↓
  Universal Link      Intent URL         App Store/Play Store
        ↓                  ↓                  ↓
   Opens Your App    Opens Your App    Redirects to Store
```

### Key Concepts

- **Workspace**: Your organizational container for apps and deep links
- **Subdomain**: Your unique identifier (e.g., `yourapp.depl.link`)
- **Slug**: The unique identifier for each deep link (e.g., `/summer-sale`)
- **App Params**: Custom JSON data passed to your app when deep link opens
- **API Key**: Server-side key for creating deep links (write access)
- **Client Key**: Mobile app key for reading deep link data (read access)

---

## 3. Getting Started

### Step 1: Sign Up

1. Visit [https://depl.link](https://depl.link)
2. Click **"Get Started"** or **"Sign In"**
3. Authenticate with your **Google account**
4. You'll be automatically redirected to your dashboard

### Step 2: Create Your First Workspace

A workspace is a container for your app's deep links.

1. On the dashboard, click **"Create Workspace"**
2. Enter the following information:
   - **Workspace Name**: (e.g., "MyApp Production")
   - **Subdomain**: Your unique identifier (e.g., "myapp")
     - Your deep links will use: `https://myapp.depl.link/`
     - Must be unique across all DEPL users
     - Can only contain: lowercase letters, numbers, hyphens
3. Click **"Create"**

**Important**: Your subdomain is permanent and cannot be changed later. Choose wisely!

### Step 3: Configure Your Mobile Apps

You need to register at least one platform (iOS or Android) before creating deep links.

See [Section 5: Mobile App Configuration](#5-mobile-app-configuration) for detailed instructions.

---

## 4. Dashboard Overview

### Main Dashboard (`/dashboard`)

Your dashboard shows all workspaces you own or have access to.

**Workspace Card Information:**
- Workspace name and description
- Subdomain (e.g., `myapp.depl.link`)
- Owner information
- Connected platforms (iOS/Android badges)
- Last activity timestamp

### Workspace Detail Page (`/dashboard/[workspace-id]`)

Click on any workspace to access its management interface:

#### Statistics Panel
- **Total Links**: Number of deep links created
- **Total Clicks**: Cumulative clicks across all links
- **Clicks Today**: Today's click count
- **Avg Clicks/Link**: Average engagement per deep link

#### Tabs

1. **Deep Links** - View and manage your links
   - Filter by source: UI Created vs API Created
   - Click to copy link
   - Delete links
   - View click counts

2. **Apps** - Manage iOS/Android app configurations
   - Connect iOS app (Bundle ID, Team ID, App Store ID)
   - Connect Android app (Package Name, SHA-256 fingerprints)
   - Update existing configurations

3. **API Keys** - Access your authentication keys
   - **API Key**: For creating deep links (keep secret!)
   - **Client Key**: For reading deep link data (safe for mobile apps)
   - Copy buttons for easy access

4. **Settings** - Workspace configuration
   - Workspace name and description
   - Subdomain display
   - Subscription tier information

---

## 5. Mobile App Configuration

Before creating deep links, you must configure your mobile apps. DEPL uses this information to:
- Generate platform-specific verification files
- Route users to the correct app/store
- Enable Universal Links (iOS) and App Links (Android)

### 5.1 iOS App Setup

#### Required Information

You'll need to gather three pieces of information from Apple:

1. **Bundle ID** (e.g., `com.mycompany.myapp`)
   - Found in Xcode → Target → General → Identity → Bundle Identifier
   - Or in App Store Connect → Your App → App Information

2. **Team ID** (e.g., `ABCD123456`)
   - Found in Apple Developer Portal → Membership → Team ID
   - Or Xcode → Preferences → Accounts → Manage Certificates

3. **App Store ID** (e.g., `1234567890`)
   - Found in App Store Connect → Your App → App Information → Apple ID
   - Or from your App Store URL: `https://apps.apple.com/app/id1234567890`

#### Configure in Dashboard

1. Go to your workspace → **Apps** tab
2. Click **"Connect iOS App"**
3. Enter the three values above
4. Click **"Save"**

#### Verify Apple App Site Association (AASA)

After saving, verify that DEPL is serving your AASA file correctly:

```bash
# Production
curl https://yourapp.depl.link/.well-known/apple-app-site-association

# Expected response:
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABCD123456.com.mycompany.myapp",
        "paths": ["NOT /_/*", "/*"]
      }
    ]
  }
}
```

#### Configure iOS App (Xcode)

1. **Enable Associated Domains capability**:
   - Xcode → Target → Signing & Capabilities
   - Click **"+ Capability"** → Add **"Associated Domains"**

2. **Add your DEPL domain**:
   ```
   applinks:yourapp.depl.link
   ```

3. **Handle Universal Links in your app**:

```swift
// AppDelegate.swift or SceneDelegate.swift

func application(_ application: UIApplication,
                 continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {

    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
        return false
    }

    // URL format: https://yourapp.depl.link/summer-sale
    handleDeepLink(url: url)
    return true
}

func handleDeepLink(url: URL) {
    // Extract slug from URL
    let slug = url.lastPathComponent

    // Fetch deep link data from DEPL API
    fetchDeepLinkData(slug: slug)
}
```

### 5.2 Android App Setup

#### Required Information

You'll need:

1. **Package Name** (e.g., `com.mycompany.myapp`)
   - Found in `app/build.gradle` → `applicationId`
   - Or in Google Play Console → Your App → Setup → App Details

2. **SHA-256 Certificate Fingerprints** (one or more)
   - These verify your app's authenticity
   - You need fingerprints for:
     - **Debug keystore** (for local testing)
     - **Release keystore** (for production)
     - **Google Play signing key** (if using App Signing by Google Play)

#### Get SHA-256 Fingerprints

**For Debug Keystore:**
```bash
cd ~/.android
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android

# Look for: SHA256: AA:BB:CC:DD:...
```

**For Release Keystore:**
```bash
keytool -list -v -keystore /path/to/your-release.keystore -alias your-key-alias

# Enter your keystore password
# Look for: SHA256: AA:BB:CC:DD:...
```

**For Google Play Signing:**
- Google Play Console → Your App → Setup → App Integrity → App Signing
- Copy the **SHA-256 certificate fingerprint**

#### Configure in Dashboard

1. Go to your workspace → **Apps** tab
2. Click **"Connect Android App"**
3. Enter **Package Name**
4. Add **SHA-256 Fingerprints**:
   - Click **"+ Add Fingerprint"** for each certificate
   - Paste the fingerprint (format: `AA:BB:CC:DD:...`)
   - Add at least one, but typically you'll add 2-3 (debug + release + Google Play)
5. Click **"Save"**

#### Verify Digital Asset Links

After saving, verify the assetlinks.json file:

```bash
# Production
curl https://yourapp.depl.link/.well-known/assetlinks.json

# Expected response:
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.mycompany.myapp",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:...",
        "EE:FF:00:11:..."
      ]
    }
  }
]
```

#### Configure Android App (AndroidManifest.xml)

1. **Add intent filter** to the Activity that should handle deep links:

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask">

    <!-- Deep Link Intent Filter -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <!-- Your DEPL subdomain -->
        <data
            android:scheme="https"
            android:host="yourapp.depl.link" />
    </intent-filter>
</activity>
```

**Important**: Set `android:autoVerify="true"` to enable Android App Links.

2. **Handle deep links in your Activity**:

```kotlin
// MainActivity.kt

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Handle deep link
    handleIntent(intent)
}

override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    intent?.let { handleIntent(it) }
}

private fun handleIntent(intent: Intent) {
    val uri = intent.data ?: return

    // URI format: https://yourapp.depl.link/summer-sale
    val slug = uri.lastPathSegment

    if (slug != null) {
        fetchDeepLinkData(slug)
    }
}
```

---

## 6. Creating Deep Links

You can create deep links in two ways:

### 6.1 Via Dashboard (UI)

**Best for**: Manual link creation, testing, small campaigns

1. Go to your workspace dashboard
2. Click **"Create Deep Link"** button
3. Fill in the form:

   **Slug** (Optional):
   - Custom identifier for your link (e.g., `summer-sale`)
   - If empty, a random 6-character slug is auto-generated
   - Must be unique within your workspace
   - Allowed characters: letters, numbers, hyphens, underscores

   **App Params** (Required):
   - JSON object containing custom data for your app
   - Example:
     ```json
     {
       "screen": "promo",
       "promo_id": "summer2024",
       "discount": "50",
       "utm_source": "instagram"
     }
     ```

   **Social Meta** (Optional):
   - **Title**: Appears in social media previews
   - **Description**: Subtitle in social previews
   - **Thumbnail URL**: Image shown in previews (1200x630px recommended)

4. Click **"Create"**
5. Your deep link is generated: `https://yourapp.depl.link/summer-sale`
6. Click the copy button to copy the link

**Source Tag**: Links created via UI are tagged with `source: "UI"` in the database.

### 6.2 Via REST API

**Best for**: Programmatic creation, automation, high volume

See [Section 7: API Integration Guide](#7-api-integration-guide) for detailed API documentation.

---

## 7. API Integration Guide

### 7.1 Authentication

All API requests require authentication using Bearer tokens.

**Get Your Keys**:
1. Dashboard → Your Workspace → **API Keys** tab
2. Copy **API Key** (for creating links)
3. Copy **Client Key** (for reading links)

**Key Usage**:
- **API Key**: Server-side only, create deep links (POST)
- **Client Key**: Mobile apps, read deep link data (GET)

### 7.2 Create Deep Link API

#### Endpoint

```
POST https://depl.link/api/deeplink
```

#### Headers

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

#### Request Body (Full Example)

```json
{
  "slug": "summer-sale",
  "app_params": {
    "screen": "promo",
    "promo_id": "summer2024",
    "discount": "50",
    "utm_source": "facebook",
    "utm_campaign": "summer_campaign"
  },
  "social_meta": {
    "title": "Summer Sale - 50% Off Everything!",
    "description": "Don't miss our biggest sale of the year. Ends July 31st.",
    "thumbnail_url": "https://cdn.myapp.com/summer-sale-banner.jpg"
  }
}
```

#### Request Body (Minimal Example)

```json
{
  "app_params": {
    "screen": "home"
  }
}
```

**Note**:
- `slug` is **optional** - if not provided, a random slug is generated
- `app_params` is **required** - must be a valid JSON object
- `social_meta` is **optional** - defaults are provided

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "deeplink_url": "https://yourapp.depl.link/summer-sale",
  "created_at": "2025-11-02T10:30:00Z"
}
```

#### cURL Example

```bash
curl https://depl.link/api/deeplink \
  -X POST \
  -H "Authorization: Bearer api_550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "welcome-bonus",
    "app_params": {
      "screen": "rewards",
      "bonus_code": "WELCOME100"
    },
    "social_meta": {
      "title": "Get Your Welcome Bonus!",
      "description": "Claim 100 points when you sign up",
      "thumbnail_url": "https://cdn.myapp.com/welcome-bonus.png"
    }
  }'
```

#### Node.js Example

```javascript
const axios = require('axios');

async function createDeepLink() {
  try {
    const response = await axios.post('https://depl.link/api/deeplink', {
      slug: 'product-123',
      app_params: {
        screen: 'product_detail',
        product_id: '123',
        category: 'electronics'
      },
      social_meta: {
        title: 'Check out this amazing product!',
        description: 'Available now with free shipping',
        thumbnail_url: 'https://cdn.myapp.com/product-123.jpg'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEPL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Deep link created:', response.data.deeplink_url);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}
```

#### Python Example

```python
import requests
import os

def create_deep_link():
    url = "https://depl.link/api/deeplink"

    headers = {
        "Authorization": f"Bearer {os.getenv('DEPL_API_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "slug": "refer-friend",
        "app_params": {
            "screen": "referral",
            "referrer_id": "user123",
            "campaign": "friend_referral"
        },
        "social_meta": {
            "title": "Join me on MyApp!",
            "description": "Get $10 when you sign up with my link",
            "thumbnail_url": "https://cdn.myapp.com/referral.png"
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        print(f"Deep link created: {data['deeplink_url']}")
        return data
    else:
        print(f"Error: {response.json()}")
        raise Exception("Failed to create deep link")
```

### 7.3 Get Deep Link API

#### Endpoint

```
GET https://depl.link/api/deeplink?slug={slug}
```

#### Headers

```
Authorization: Bearer YOUR_CLIENT_KEY
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | The slug from the deep link URL |

#### Response (Success - 200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "workspace_id": "workspace-uuid",
  "slug": "summer-sale",
  "app_params": {
    "screen": "promo",
    "promo_id": "summer2024",
    "discount": "50"
  },
  "ios_parameters": {},
  "android_parameters": {},
  "social_meta": {
    "title": "Summer Sale - 50% Off!",
    "description": "Don't miss our biggest sale",
    "thumbnail_url": "https://cdn.myapp.com/summer-sale.jpg"
  },
  "click_count": 1234,
  "is_random_slug": false,
  "source": "API",
  "created_at": "2025-11-02T10:30:00Z",
  "updated_at": "2025-11-02T15:45:00Z"
}
```

**Note**: `ios_parameters` and `android_parameters` are deprecated and will be empty objects. Platform data is now configured at the workspace level.

#### cURL Example

```bash
curl "https://depl.link/api/deeplink?slug=summer-sale" \
  -H "Authorization: Bearer client_650e8400-e29b-41d4-a716-446655440001"
```

#### iOS (Swift) Example

```swift
func fetchDeepLinkData(slug: String) {
    let urlString = "https://depl.link/api/deeplink?slug=\(slug)"
    guard let url = URL(string: urlString) else { return }

    var request = URLRequest(url: url)
    request.setValue("Bearer YOUR_CLIENT_KEY", forHTTPHeaderField: "Authorization")

    URLSession.shared.dataTask(with: request) { data, response, error in
        guard let data = data, error == nil else {
            print("Error fetching deep link: \(error?.localizedDescription ?? "Unknown error")")
            return
        }

        do {
            let deepLink = try JSONDecoder().decode(DeepLinkResponse.self, from: data)

            // Navigate app based on app_params
            DispatchQueue.main.async {
                self.navigateToScreen(params: deepLink.app_params)
            }
        } catch {
            print("Error decoding response: \(error)")
        }
    }.resume()
}

// Define response model
struct DeepLinkResponse: Codable {
    let id: String
    let slug: String
    let app_params: [String: AnyCodable]
    let social_meta: SocialMeta?
    let click_count: Int
}

struct SocialMeta: Codable {
    let title: String?
    let description: String?
    let thumbnail_url: String?
}
```

#### Android (Kotlin) Example

```kotlin
import okhttp3.*
import com.google.gson.Gson
import java.io.IOException

fun fetchDeepLinkData(slug: String) {
    val url = "https://depl.link/api/deeplink?slug=$slug"

    val request = Request.Builder()
        .url(url)
        .addHeader("Authorization", "Bearer YOUR_CLIENT_KEY")
        .build()

    val client = OkHttpClient()

    client.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) {
            Log.e("DeepLink", "Error fetching deep link: ${e.message}")
        }

        override fun onResponse(call: Call, response: Response) {
            response.body?.string()?.let { json ->
                val deepLink = Gson().fromJson(json, DeepLinkResponse::class.java)

                // Navigate app based on app_params
                runOnUiThread {
                    navigateToScreen(deepLink.app_params)
                }
            }
        }
    })
}

// Data classes
data class DeepLinkResponse(
    val id: String,
    val slug: String,
    val app_params: Map<String, Any>,
    val social_meta: SocialMeta?,
    val click_count: Int
)

data class SocialMeta(
    val title: String?,
    val description: String?,
    val thumbnail_url: String?
)
```

### 7.4 Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

#### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_JSON` | Request body is not valid JSON |
| 400 | `INVALID_REQUEST` | Missing required field (app_params) |
| 400 | `NO_APPS_CONFIGURED` | No iOS/Android apps registered in workspace |
| 401 | `UNAUTHORIZED` | Missing Authorization header |
| 401 | `INVALID_API_KEY` | Invalid API key (POST) |
| 401 | `INVALID_CLIENT_KEY` | Invalid client key (GET) |
| 404 | `NOT_FOUND` | Deep link with specified slug not found |
| 409 | `SLUG_ALREADY_EXISTS` | Duplicate slug in workspace |
| 500 | `SLUG_GENERATION_FAILED` | Failed to generate unique random slug |
| 500 | `SERVER_ERROR` | Internal server error |

---

## 8. Mobile App Integration

### 8.1 iOS Integration (Swift)

#### Complete Implementation

```swift
import UIKit

class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication,
                     continue userActivity: NSUserActivity,
                     restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {

        // Handle Universal Links
        guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
              let url = userActivity.webpageURL else {
            return false
        }

        // URL format: https://yourapp.depl.link/summer-sale
        print("Received deep link: \(url)")
        handleDeepLink(url: url)

        return true
    }

    private func handleDeepLink(url: URL) {
        // Extract slug from URL
        let slug = url.lastPathSegment ?? ""

        // Fetch deep link data from DEPL API
        DeepLinkService.shared.fetchDeepLink(slug: slug) { result in
            switch result {
            case .success(let deepLink):
                // Navigate based on app_params
                self.navigate(with: deepLink.app_params)

            case .failure(let error):
                print("Failed to fetch deep link: \(error)")
                // Handle error (show error screen or default screen)
            }
        }
    }

    private func navigate(with params: [String: Any]) {
        guard let screen = params["screen"] as? String else {
            return
        }

        // Navigate to specific screen based on parameters
        DispatchQueue.main.async {
            switch screen {
            case "promo":
                if let promoId = params["promo_id"] as? String {
                    self.showPromoScreen(promoId: promoId)
                }

            case "product_detail":
                if let productId = params["product_id"] as? String {
                    self.showProductDetail(productId: productId)
                }

            case "rewards":
                if let bonusCode = params["bonus_code"] as? String {
                    self.showRewards(bonusCode: bonusCode)
                }

            default:
                self.showHome()
            }
        }
    }
}

// Deep Link Service
class DeepLinkService {
    static let shared = DeepLinkService()

    private let clientKey = "YOUR_CLIENT_KEY" // Store securely in keychain

    func fetchDeepLink(slug: String, completion: @escaping (Result<DeepLinkResponse, Error>) -> Void) {
        let urlString = "https://depl.link/api/deeplink?slug=\(slug)"
        guard let url = URL(string: urlString) else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }

        var request = URLRequest(url: url)
        request.setValue("Bearer \(clientKey)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: -1)))
                return
            }

            do {
                let deepLink = try JSONDecoder().decode(DeepLinkResponse.self, from: data)
                completion(.success(deepLink))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

// Models
struct DeepLinkResponse: Codable {
    let id: String
    let slug: String
    let app_params: [String: AnyCodable]
    let social_meta: SocialMeta?
    let click_count: Int
    let created_at: String
}

struct SocialMeta: Codable {
    let title: String?
    let description: String?
    let thumbnail_url: String?
}

// Helper for decoding Any type in JSON
struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let string = try? container.decode(String.self) {
            value = string
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let bool = try? container.decode(Bool.self) {
            value = bool
        } else {
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Unsupported type")
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let string = value as? String {
            try container.encode(string)
        } else if let int = value as? Int {
            try container.encode(int)
        } else if let double = value as? Double {
            try container.encode(double)
        } else if let bool = value as? Bool {
            try container.encode(bool)
        }
    }
}
```

### 8.2 Android Integration (Kotlin)

#### Complete Implementation

```kotlin
// MainActivity.kt
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Handle deep link
        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleIntent(it) }
    }

    private fun handleIntent(intent: Intent) {
        val uri: Uri? = intent.data

        if (uri != null) {
            // URL format: https://yourapp.depl.link/summer-sale
            Log.d("DeepLink", "Received deep link: $uri")

            val slug = uri.lastPathSegment
            if (slug != null) {
                fetchDeepLinkData(slug)
            }
        }
    }

    private fun fetchDeepLinkData(slug: String) {
        DeepLinkService.fetchDeepLink(slug) { deepLink ->
            if (deepLink != null) {
                // Navigate based on app_params
                navigate(deepLink.app_params)
            } else {
                Log.e("DeepLink", "Failed to fetch deep link data")
                // Show error or default screen
            }
        }
    }

    private fun navigate(params: Map<String, Any>) {
        val screen = params["screen"] as? String ?: return

        runOnUiThread {
            when (screen) {
                "promo" -> {
                    val promoId = params["promo_id"] as? String
                    showPromoScreen(promoId)
                }

                "product_detail" -> {
                    val productId = params["product_id"] as? String
                    showProductDetail(productId)
                }

                "rewards" -> {
                    val bonusCode = params["bonus_code"] as? String
                    showRewards(bonusCode)
                }

                else -> showHome()
            }
        }
    }

    private fun showPromoScreen(promoId: String?) {
        // Navigate to promo screen
    }

    private fun showProductDetail(productId: String?) {
        // Navigate to product detail
    }

    private fun showRewards(bonusCode: String?) {
        // Navigate to rewards screen
    }

    private fun showHome() {
        // Navigate to home
    }
}

// DeepLinkService.kt
import com.google.gson.Gson
import okhttp3.*
import java.io.IOException

object DeepLinkService {

    private const val CLIENT_KEY = "YOUR_CLIENT_KEY" // Store in BuildConfig or encrypted storage
    private val client = OkHttpClient()
    private val gson = Gson()

    fun fetchDeepLink(slug: String, callback: (DeepLinkResponse?) -> Unit) {
        val url = "https://depl.link/api/deeplink?slug=$slug"

        val request = Request.Builder()
            .url(url)
            .addHeader("Authorization", "Bearer $CLIENT_KEY")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("DeepLink", "Network error: ${e.message}")
                callback(null)
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.string()?.let { json ->
                    try {
                        val deepLink = gson.fromJson(json, DeepLinkResponse::class.java)
                        callback(deepLink)
                    } catch (e: Exception) {
                        Log.e("DeepLink", "Parse error: ${e.message}")
                        callback(null)
                    }
                } ?: callback(null)
            }
        })
    }
}

// Models.kt
data class DeepLinkResponse(
    val id: String,
    val workspace_id: String,
    val slug: String,
    val app_params: Map<String, Any>,
    val social_meta: SocialMeta?,
    val click_count: Int,
    val is_random_slug: Boolean,
    val source: String,
    val created_at: String,
    val updated_at: String
)

data class SocialMeta(
    val title: String?,
    val description: String?,
    val thumbnail_url: String?
)
```

#### Dependencies (build.gradle)

```gradle
dependencies {
    // For networking
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'

    // For JSON parsing
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

---

## 9. URL Routing & Redirection

### How DEPL Routes Users

When a user clicks a deep link (e.g., `https://yourapp.depl.link/summer-sale`), DEPL performs the following steps:

#### Step 1: URL Resolution

The middleware extracts:
- **Subdomain**: `yourapp`
- **Slug**: `summer-sale`

#### Step 2: Workspace & Deep Link Lookup

1. Query workspace by subdomain
2. Query deep link by workspace ID + slug
3. Retrieve workspace's iOS/Android app configurations

#### Step 3: Platform Detection

DEPL detects the user's platform using User-Agent:

```
iOS:      /iPhone|iPad|iPod/i
Android:  /Android/i
Desktop:  Everything else
```

#### Step 4: Social Crawler Detection

If the request is from a social media crawler (Facebook, Twitter, WhatsApp, etc.):
- **No redirection** occurs
- Static HTML with meta tags is returned
- Social platforms can preview the link properly

Detected crawlers:
- Facebook External Hit
- Twitterbot
- WhatsApp
- Slackbot
- KakaoTalkBot
- LinkedInBot
- Pinterest
- Discordbot

#### Step 5: Platform-Specific Redirection

**For iOS Users:**
```
Universal Link: https://yourapp.depl.link/summer-sale?screen=promo&discount=50

→ If app installed: Opens your app directly
→ If app not installed: Redirects to App Store
```

**For Android Users:**
```
Intent URL: intent://yourapp.depl.link/summer-sale#Intent;
            package=com.yourapp.android;
            action=android.intent.action.VIEW;
            scheme=https;
            S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.yourapp.android;
            end;

→ If app installed: Opens your app directly
→ If app not installed: Redirects to Play Store
```

**For Desktop/PC Users:**
```
Priority: Android Play Store
Fallback: iOS App Store

→ Redirects to web store (not mobile-only intent URLs)
```

#### Step 6: Click Tracking

After platform detection, DEPL asynchronously:
1. Increments `deeplinks.click_count`
2. Increments `workspaces.current_monthly_click_count`
3. Updates `deeplinks.updated_at` timestamp

**Note**: Click tracking is fire-and-forget (errors are logged but don't affect user experience).

### Redirect Timing

- **Social crawlers**: Immediate HTML response (no delay)
- **Regular users**: 1-second delay before redirect
  - Allows meta tags to be crawled
  - Provides better social media preview experience

---

## 10. Testing Your Deep Links

### 10.1 Testing on iOS

#### Option 1: Physical Device (Recommended)

1. **Build and install** your app on a real iPhone/iPad
2. **Send yourself the deep link** via:
   - iMessage
   - Email
   - Notes app
   - Safari (type the URL in address bar)
3. **Tap the link** - your app should open

**Important**:
- Simulators cannot test Universal Links properly
- You must use a physical device
- The link must come from outside your app (not embedded)

#### Option 2: Test via Safari

1. Open **Safari** on your iPhone
2. Type the full deep link URL: `https://yourapp.depl.link/test-slug`
3. Tap the address bar result (not autocomplete)
4. Safari should show a banner: "Open in [Your App]"
5. Tap the banner to open your app

#### Debugging iOS Universal Links

If links don't open your app:

1. **Verify AASA file**:
   ```bash
   curl https://yourapp.depl.link/.well-known/apple-app-site-association
   ```

2. **Check Associated Domains** in Xcode:
   - Target → Signing & Capabilities → Associated Domains
   - Should have: `applinks:yourapp.depl.link`

3. **Reset iOS Associated Domains cache**:
   - Settings → Safari → Clear History and Website Data
   - Or use Apple's AASA validator: https://search.developer.apple.com/appsearch-validation-tool/

4. **Check your code**:
   - Implement `application(_:continue:restorationHandler:)`
   - Return `true` if URL is handled

5. **Enable debug logging**:
   ```swift
   func application(_ application: UIApplication,
                    continue userActivity: NSUserActivity,
                    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {

       print("🔗 Received activity type: \(userActivity.activityType)")
       print("🔗 Webpage URL: \(userActivity.webpageURL?.absoluteString ?? "nil")")

       // Your handling code
   }
   ```

### 10.2 Testing on Android

#### Option 1: Physical Device or Emulator

1. **Build and install** your app on device/emulator
2. **Open a terminal/command prompt** and run:
   ```bash
   adb shell am start -W -a android.intent.action.VIEW \
     -d "https://yourapp.depl.link/test-slug" \
     com.yourapp.android
   ```
3. Your app should open

#### Option 2: Test via Chrome/Browser

1. Open **Chrome** on your Android device
2. Type the full deep link URL
3. Chrome should prompt: "Open with [Your App]"
4. Tap to open

#### Option 3: Send via Messaging App

1. Send yourself the link via:
   - WhatsApp
   - Telegram
   - SMS
   - Gmail
2. Tap the link - your app should open

#### Debugging Android App Links

If links don't open your app:

1. **Verify assetlinks.json**:
   ```bash
   curl https://yourapp.depl.link/.well-known/assetlinks.json
   ```

2. **Check intent filter** in AndroidManifest.xml:
   - `android:autoVerify="true"` is set
   - Scheme: `https`
   - Host: `yourapp.depl.link`

3. **Verify SHA-256 fingerprints** match:
   ```bash
   # Get your app's signature
   adb shell pm dump com.yourapp.android | grep -A1 "signatures"

   # Compare with assetlinks.json
   ```

4. **Clear Android app defaults**:
   - Settings → Apps → Your App → Open by default → Clear defaults
   - Try opening the link again

5. **Check Digital Asset Links**:
   - Use Google's validator: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourapp.depl.link&relation=delegate_permission/common.handle_all_urls

6. **Enable debug logging**:
   ```kotlin
   override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(savedInstanceState)

       Log.d("DeepLink", "Intent action: ${intent.action}")
       Log.d("DeepLink", "Intent data: ${intent.data}")
       Log.d("DeepLink", "Intent extras: ${intent.extras}")
   }
   ```

### 10.3 Testing Desktop Redirection

1. Open your deep link in a desktop browser: `https://yourapp.depl.link/test-slug`
2. You should be redirected to:
   - **Android Play Store** (if Android app is configured)
   - **iOS App Store** (if iOS app is configured, or as fallback)

### 10.4 Testing Social Media Previews

#### Facebook/LinkedIn

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your deep link: `https://yourapp.depl.link/test-slug`
3. Click **"Debug"**
4. Verify:
   - Title appears correctly
   - Description appears correctly
   - Thumbnail image loads

#### Twitter

1. Go to: https://cards-dev.twitter.com/validator
2. Enter your deep link
3. Click **"Preview card"**
4. Verify meta tags

#### WhatsApp/iMessage

1. Send the link to yourself
2. Check the preview before sending
3. Verify title, description, and thumbnail appear

---

## 11. Analytics & Monitoring

### 11.1 Dashboard Analytics

Navigate to: **Dashboard → Your Workspace**

#### Statistics Overview

- **Total Links**: Cumulative count of all deep links created
- **Total Clicks**: Sum of all clicks across all links
- **Clicks Today**: Clicks received today (resets at midnight UTC)
- **Avg Clicks/Link**: `Total Clicks ÷ Total Links`

#### Per-Link Analytics

In the **Deep Links** tab, each link displays:
- Slug
- Click count
- Creation date
- Source (UI or API)

**Actions**:
- Click copy button to copy full URL
- Click on link to view details (coming soon)
- Delete link (irreversible)

### 11.2 Click Tracking Mechanism

When a user clicks a deep link:

1. User clicks `https://yourapp.depl.link/summer-sale`
2. DEPL platform detects user and loads deep link page
3. **Client-side component** calls `incrementDeeplinkClick()` function
4. **Database updates** (async, non-blocking):
   ```sql
   UPDATE deeplinks
   SET click_count = click_count + 1,
       updated_at = NOW()
   WHERE workspace_id = ? AND slug = ?;

   UPDATE workspaces
   SET current_monthly_click_count = current_monthly_click_count + 1
   WHERE id = ?;
   ```
5. User is redirected to their platform

**Notes**:
- Click tracking is **fire-and-forget** (errors don't affect user experience)
- Clicks are counted even if tracking fails
- No user data is stored (privacy-focused)
- Bot traffic (social crawlers) is excluded from click counts

### 11.3 Subscription Quotas

DEPL tracks usage per workspace for billing purposes:

| Plan | Monthly Link Creation | Monthly Clicks | Rate Limit |
|------|----------------------|----------------|------------|
| **Free** | 100 links | 1,000 clicks | 100 req/min |
| **Pro** | 1,000 links | 50,000 clicks | 1,000 req/min |
| **Enterprise** | Unlimited | Unlimited | Custom |

**Quota Fields** (in `workspaces` table):
- `current_monthly_create_count`: Links created this month
- `current_monthly_click_count`: Clicks received this month
- `next_quota_update_at`: Timestamp when quotas reset (monthly)

**What happens when quota exceeded?**
- Free plan: API returns error, no new links can be created
- Automatic upgrade prompts in dashboard
- Existing links continue to work (redirects are not blocked)

---

## 12. Troubleshooting

### 12.1 Common Issues

#### Issue 1: "No apps configured" error

**Error**:
```json
{
  "error": {
    "code": "NO_APPS_CONFIGURED",
    "message": "프로젝트에 등록된 앱이 없습니다."
  }
}
```

**Solution**:
- You must configure at least one platform (iOS or Android) before creating deep links
- Go to: Dashboard → Your Workspace → **Apps** tab
- Click **"Connect iOS App"** or **"Connect Android App"**
- Fill in the required fields and save

---

#### Issue 2: Deep link doesn't open app (iOS)

**Symptoms**:
- Link opens Safari instead of app
- No "Open in [App]" banner appears

**Troubleshooting Steps**:

1. **Verify AASA is served correctly**:
   ```bash
   curl https://yourapp.depl.link/.well-known/apple-app-site-association
   ```
   Should return valid JSON with your Bundle ID.

2. **Check Associated Domains in Xcode**:
   - Target → Signing & Capabilities → Associated Domains
   - Add: `applinks:yourapp.depl.link`
   - No `https://` prefix
   - No wildcards

3. **Verify Bundle ID and Team ID match**:
   - Dashboard settings must match Xcode exactly
   - Case-sensitive

4. **Clear iOS cache**:
   - Settings → Safari → Clear History and Website Data
   - Reinstall your app

5. **Test on physical device only**:
   - Simulators don't support Universal Links properly

6. **Check Apple's AASA validator**:
   - https://search.developer.apple.com/appsearch-validation-tool/

7. **Verify code implementation**:
   ```swift
   func application(_ application: UIApplication,
                    continue userActivity: NSUserActivity,
                    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {

       guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
             let url = userActivity.webpageURL else {
           return false
       }

       // Handle deep link
       handleDeepLink(url: url)
       return true  // ← Must return true!
   }
   ```

---

#### Issue 3: Deep link doesn't open app (Android)

**Symptoms**:
- Link opens browser instead of app
- Chrome asks "Open with [App]" every time (not automatic)

**Troubleshooting Steps**:

1. **Verify assetlinks.json**:
   ```bash
   curl https://yourapp.depl.link/.well-known/assetlinks.json
   ```
   Should return valid JSON with your package name and SHA-256 fingerprints.

2. **Verify SHA-256 fingerprints match**:

   Get fingerprints from:
   - Debug keystore
   - Release keystore
   - Google Play signing key (if using App Signing)

   All active fingerprints must be in assetlinks.json.

3. **Check intent filter**:
   ```xml
   <intent-filter android:autoVerify="true">
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
       <category android:name="android.intent.category.BROWSABLE" />

       <data
           android:scheme="https"
           android:host="yourapp.depl.link" />
   </intent-filter>
   ```

   **Must have**:
   - `android:autoVerify="true"`
   - Scheme: `https` (not `http`)
   - Host matches exactly

4. **Clear app defaults**:
   - Settings → Apps → Your App → Open by default → Clear defaults
   - Test link again

5. **Verify with adb**:
   ```bash
   adb shell am start -W -a android.intent.action.VIEW \
     -d "https://yourapp.depl.link/test-slug" \
     com.yourapp.android
   ```

6. **Check Google's Digital Asset Links API**:
   ```
   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourapp.depl.link&relation=delegate_permission/common.handle_all_urls
   ```
   Should return your package name and fingerprints.

---

#### Issue 4: Slug already exists

**Error**:
```json
{
  "error": {
    "code": "SLUG_ALREADY_EXISTS",
    "message": "A deeplink with this slug already exists in your workspace."
  }
}
```

**Solution**:
- Slugs must be unique within each workspace
- Either:
  - Choose a different slug
  - Delete the existing link first
  - Don't provide a slug (auto-generates random slug)

---

#### Issue 5: Invalid API key / Unauthorized

**Error**:
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key."
  }
}
```

**Solution**:
1. Verify you're using the correct key:
   - **API Key** for POST /api/deeplink
   - **Client Key** for GET /api/deeplink
2. Check Authorization header format:
   ```
   Authorization: Bearer YOUR_API_KEY
   ```
   (Note: `Bearer` with capital B, followed by space)
3. Copy key again from Dashboard → Workspace → API Keys
4. Ensure no extra spaces or newlines

---

#### Issue 6: Social media doesn't show preview

**Symptoms**:
- Link shows generic preview (no custom title/image)
- Facebook shows blank preview

**Troubleshooting**:

1. **Verify social_meta was provided**:
   - When creating deep link, include `social_meta` object
   - All fields are optional but recommended

2. **Test with Facebook Debugger**:
   - https://developers.facebook.com/tools/debug/
   - Enter your deep link URL
   - Click "Scrape Again" to refresh cache

3. **Check image requirements**:
   - **Minimum size**: 200x200px
   - **Recommended size**: 1200x630px (Facebook/LinkedIn)
   - **Format**: JPG or PNG
   - **Must be publicly accessible** (not behind authentication)
   - **Use HTTPS** (not HTTP)

4. **Verify meta tags in HTML**:
   - Open deep link in browser
   - View page source
   - Look for Open Graph tags:
     ```html
     <meta property="og:title" content="..." />
     <meta property="og:description" content="..." />
     <meta property="og:image" content="..." />
     ```

---

#### Issue 7: Desktop users aren't redirected

**Symptoms**:
- Desktop users see loading screen but nothing happens

**Troubleshooting**:

1. **Verify at least one app is configured**:
   - iOS or Android app must be registered
   - Desktop users are redirected to app stores

2. **Check browser console** for JavaScript errors:
   - Open Developer Tools (F12)
   - Look for errors in Console tab

3. **Verify App Store IDs**:
   - iOS: `app_store_id` must be valid
   - Android: Package name must match published app

---

### 12.2 Debugging Tools

#### cURL Examples

**Test API authentication**:
```bash
# Test API Key (POST)
curl https://depl.link/api/deeplink \
  -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"app_params":{"test":"value"}}'

# Test Client Key (GET)
curl "https://depl.link/api/deeplink?slug=test-slug" \
  -H "Authorization: Bearer YOUR_CLIENT_KEY"
```

**Verify platform files**:
```bash
# iOS AASA
curl https://yourapp.depl.link/.well-known/apple-app-site-association

# Android assetlinks
curl https://yourapp.depl.link/.well-known/assetlinks.json
```

#### Browser Developer Tools

**Check redirect logic**:
1. Open deep link in browser
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Look for DEPL debug logs:
   ```
   === DEPL Debug Start ===
   1. Deeplink data: {...}
   2. Apps data: {...}
   3. User Agent: ...
   6. Platform detection - isAndroid: false, isIOS: true
   8. Processing iOS user
   ```

#### ADB for Android

**View app logs**:
```bash
# Filter by your package name
adb logcat | grep "com.yourapp.android"

# Filter by DeepLink tag
adb logcat | grep "DeepLink"
```

**Manually trigger deep link**:
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://yourapp.depl.link/test-slug" \
  com.yourapp.android
```

---

### 12.3 Getting Help

If you're still experiencing issues:

1. **Check existing documentation**:
   - Dashboard → Docs
   - This guideline (GUIDELINE.md)

2. **Contact support**:
   - Email: support@depl.link
   - Include:
     - Workspace ID or subdomain
     - Deep link slug
     - Platform (iOS/Android/Desktop)
     - Error message (if any)
     - Steps to reproduce

3. **Community**:
   - GitHub Discussions (coming soon)
   - Discord server (coming soon)

---

## 13. Best Practices

### 13.1 Security Best Practices

#### Protect Your API Key

**❌ Never do this**:
```javascript
// Frontend code - WRONG!
const response = await fetch('https://depl.link/api/deeplink', {
  headers: {
    'Authorization': 'Bearer api_550e8400-...' // ← Exposed to users!
  }
});
```

**✅ Always do this**:
```javascript
// Backend code - CORRECT
// Node.js Express server
app.post('/create-link', async (req, res) => {
  const response = await fetch('https://depl.link/api/deeplink', {
    headers: {
      'Authorization': `Bearer ${process.env.DEPL_API_KEY}` // ← Server-side only
    },
    body: JSON.stringify(req.body)
  });

  res.json(await response.json());
});
```

#### Use Environment Variables

**Never hardcode keys in source code**:

```bash
# .env file (NEVER commit to git!)
DEPL_API_KEY=api_550e8400-e29b-41d4-a716-446655440000
DEPL_CLIENT_KEY=client_650e8400-e29b-41d4-a716-446655440001
```

```javascript
// Node.js
const apiKey = process.env.DEPL_API_KEY;

// Python
import os
api_key = os.getenv('DEPL_API_KEY')
```

#### Client Key in Mobile Apps

Client Key is **safe** to embed in mobile apps, but consider:

```swift
// iOS - Store in a constants file (not in git)
struct Config {
    static let deplClientKey = "client_650e8400-..." // OK for client key only
}
```

```kotlin
// Android - Use BuildConfig
android {
    defaultConfig {
        buildConfigField "String", "DEPL_CLIENT_KEY", "\"client_650e8400-...\""
    }
}

// Access in code
val clientKey = BuildConfig.DEPL_CLIENT_KEY
```

#### Separate Dev/Prod Environments

- Create separate workspaces for development and production
- Use different subdomains: `myapp-dev.depl.link` vs `myapp.depl.link`
- Never mix dev and prod data

---

### 13.2 Deep Link Design Best Practices

#### Use Descriptive Slugs

**❌ Bad**:
```
https://myapp.depl.link/abc123
https://myapp.depl.link/link1
```

**✅ Good**:
```
https://myapp.depl.link/summer-sale-2025
https://myapp.depl.link/product-iphone-15
https://myapp.depl.link/refer-friend
```

Benefits:
- Easier to debug
- Better for analytics
- Memorable for users
- SEO-friendly

#### Structure App Params Consistently

**Use a standard schema**:

```json
{
  "app_params": {
    "screen": "product_detail",
    "product_id": "12345",
    "utm_source": "instagram",
    "utm_medium": "social",
    "utm_campaign": "summer_sale_2025"
  }
}
```

**Always include**:
- `screen`: The target screen in your app
- Unique identifiers (IDs, codes, etc.)
- UTM parameters for tracking

#### Optimize Social Meta

**Complete social metadata**:

```json
{
  "social_meta": {
    "title": "Get 50% Off Everything - Summer Sale",
    "description": "Limited time offer! Shop now and save big on all items. Free shipping included.",
    "thumbnail_url": "https://cdn.myapp.com/og-summer-sale.jpg"
  }
}
```

**Image requirements**:
- Size: 1200x630px (Facebook/LinkedIn recommended)
- Format: JPG or PNG
- Text: Minimal (Facebook limits text in images)
- Branding: Include your logo
- Mobile-optimized: Test on small screens

---

### 13.3 Performance Best Practices

#### Batch Create Deep Links

If creating many links, use Promise.all() or parallel requests:

```javascript
// Create 100 links in parallel
const links = await Promise.all(
  products.map(product =>
    createDeepLink({
      slug: `product-${product.id}`,
      app_params: {
        screen: 'product_detail',
        product_id: product.id
      }
    })
  )
);
```

**Rate limits**:
- Free: 100 requests/minute
- Pro: 1,000 requests/minute
- Add delays if needed:
  ```javascript
  await sleep(1000); // Wait 1 second between batches
  ```

#### Cache Deep Link Data

**Mobile apps should cache responses**:

```swift
// iOS - Cache deep link data
class DeepLinkCache {
    private var cache: [String: DeepLinkResponse] = [:]

    func getDeepLink(slug: String) -> DeepLinkResponse? {
        // Check cache first
        if let cached = cache[slug] {
            return cached
        }

        // Fetch from API
        fetchDeepLink(slug: slug) { deepLink in
            self.cache[slug] = deepLink // Cache for future use
        }
    }
}
```

Benefits:
- Faster app opens (no network delay)
- Works offline
- Reduces API calls

---

### 13.4 Analytics Best Practices

#### Use UTM Parameters

Always include UTM parameters in `app_params` to track campaign performance:

```json
{
  "app_params": {
    "screen": "home",
    "utm_source": "instagram",
    "utm_medium": "social",
    "utm_campaign": "summer_2025",
    "utm_content": "story_ad"
  }
}
```

Then in your app:
```swift
func trackDeepLinkOpen(params: [String: Any]) {
    Analytics.logEvent("deep_link_opened", parameters: [
        "utm_source": params["utm_source"],
        "utm_campaign": params["utm_campaign"],
        "screen": params["screen"]
    ])
}
```

#### Monitor Click Rates

Regularly check dashboard statistics:
- Low click rates → Improve social meta (title, image)
- High click rates but low conversions → Check app experience
- Compare UI-created vs API-created links

---

### 13.5 Testing Best Practices

#### Test Before Production

**Checklist before going live**:

- [ ] iOS Universal Links work on physical device
- [ ] Android App Links work (auto-open, not prompt)
- [ ] Social media previews look good (Facebook, Twitter, WhatsApp)
- [ ] Desktop redirect works (App Store/Play Store)
- [ ] Analytics tracking works (check click counts)
- [ ] Error handling works (invalid slugs, network errors)
- [ ] Works with app not installed (store redirect)

#### Create Test Links

Create dedicated test links for QA:

```bash
curl https://depl.link/api/deeplink \
  -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-qa-001",
    "app_params": {
      "screen": "test",
      "test_id": "qa-001"
    }
  }'
```

Delete after testing:
- Dashboard → Deep Links → Delete

---

## 14. API Reference

### 14.1 Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/deeplink` | API Key | Create deep link |
| GET | `/api/deeplink?slug={slug}` | Client Key | Get deep link data |
| GET | `/.well-known/apple-app-site-association` | None | iOS AASA file |
| GET | `/.well-known/assetlinks.json` | None | Android assetlinks |

### 14.2 Data Models

#### Create Deep Link Request

```typescript
interface CreateDeepLinkRequest {
  slug?: string;              // Optional, auto-generated if not provided
  app_params: {               // Required, any valid JSON object
    [key: string]: any;
  };
  social_meta?: {             // Optional
    title?: string;
    description?: string;
    thumbnail_url?: string;
  };
}
```

#### Create Deep Link Response

```typescript
interface CreateDeepLinkResponse {
  success: boolean;
  deeplink_url: string;       // e.g., "https://yourapp.depl.link/abc123"
  created_at: string;         // ISO 8601 timestamp
}
```

#### Get Deep Link Response

```typescript
interface DeepLinkResponse {
  id: string;                 // UUID
  workspace_id: string;       // UUID
  slug: string;
  app_params: {
    [key: string]: any;
  };
  ios_parameters: {};         // Deprecated, always empty
  android_parameters: {};     // Deprecated, always empty
  social_meta: {
    title?: string;
    description?: string;
    thumbnail_url?: string;
  };
  click_count: number;
  is_random_slug: boolean;
  source: 'UI' | 'API';
  created_at: string;
  updated_at: string;
}
```

#### Error Response

```typescript
interface ErrorResponse {
  error: {
    code: string;             // Machine-readable error code
    message: string;          // Human-readable message
    details?: any;            // Optional (dev mode only)
  };
}
```

### 14.3 Error Codes Reference

| Code | HTTP | Description | Solution |
|------|------|-------------|----------|
| `INVALID_JSON` | 400 | Request body is not valid JSON | Check JSON syntax |
| `INVALID_REQUEST` | 400 | Missing required field | Include `app_params` |
| `NO_APPS_CONFIGURED` | 400 | No iOS/Android apps registered | Configure apps in dashboard |
| `UNAUTHORIZED` | 401 | Missing Authorization header | Add `Authorization: Bearer {key}` |
| `INVALID_API_KEY` | 401 | Invalid API key | Verify API key from dashboard |
| `INVALID_CLIENT_KEY` | 401 | Invalid client key | Verify client key from dashboard |
| `NOT_FOUND` | 404 | Deep link not found | Check slug spelling |
| `SLUG_ALREADY_EXISTS` | 409 | Duplicate slug | Choose different slug |
| `SLUG_GENERATION_FAILED` | 500 | Couldn't generate unique slug | Retry request |
| `SERVER_ERROR` | 500 | Internal server error | Contact support |

---

## 15. FAQs

### General Questions

**Q: What is the difference between DEPL and Firebase Dynamic Links?**

A: DEPL is a modern alternative to Firebase Dynamic Links (which was shut down in 2025). Key differences:
- **No SDK required** - pure REST API
- **Custom subdomains** - brand your links
- **Simpler integration** - fewer dependencies
- **Better analytics** - real-time dashboard
- **Active development** - regular updates and support

**Q: Do I need to install an SDK in my mobile app?**

A: No! DEPL is purely API-based. You only need to:
1. Configure Universal Links (iOS) or App Links (Android) - native OS features
2. Call DEPL's REST API to fetch deep link data
3. No third-party SDK required

**Q: Can I use my own domain instead of depl.link?**

A: Currently, all deep links use `*.depl.link` subdomains. Custom domains (e.g., `links.myapp.com`) are planned for Enterprise plans.

**Q: Is DEPL GDPR compliant?**

A: Yes. DEPL does not store any personally identifiable information (PII). We only track:
- Click counts (aggregated)
- Timestamps
- Platform type (iOS/Android/Desktop)
No user IDs, IP addresses, or personal data is collected.

---

### Technical Questions

**Q: Can I update a deep link after creation?**

A: Currently, deep links are immutable after creation. To change parameters:
1. Create a new deep link with updated data
2. Delete the old link
3. Or create a new link with a different slug

**Q: What happens if my app is not installed?**

A: DEPL automatically redirects users to the appropriate app store:
- iOS users → App Store
- Android users → Google Play Store
- Desktop users → Web store (not mobile intent URLs)

**Q: Can I track individual user clicks?**

A: No. DEPL only provides aggregated click counts for privacy reasons. For user-level tracking, add tracking parameters to `app_params` and track in your own analytics system.

**Q: How long do deep links last?**

A: Deep links are **permanent** unless you delete them. There is no expiration.

**Q: Can I create deep links for web-only experiences?**

A: DEPL is designed for mobile apps. For web-only redirects, consider:
- Using a URL shortener (bit.ly, etc.)
- Building your own redirect service
DEPL requires at least one mobile app (iOS or Android) to be configured.

**Q: What's the maximum number of deep links I can create?**

A: Limits depend on your subscription plan:
- Free: 100 links/month
- Pro: 1,000 links/month
- Enterprise: Unlimited

There is no hard limit on total links (cumulative), only monthly creation quotas.

---

### Integration Questions

**Q: Can I use DEPL with React Native?**

A: Yes! React Native supports both Universal Links (iOS) and App Links (Android) natively. Follow the platform-specific setup guides in this document, then use React Native's Linking API:

```javascript
import { Linking } from 'react-native';

// Handle incoming deep link
Linking.addEventListener('url', (event) => {
  const { url } = event;
  // Extract slug and fetch data
});
```

**Q: Can I use DEPL with Flutter?**

A: Yes! Use the `uni_links` package:

```dart
import 'package:uni_links/uni_links.dart';

// Listen for deep links
uriLinkStream.listen((Uri? uri) {
  if (uri != null) {
    // Extract slug and fetch data
  }
});
```

**Q: Can I test deep links on iOS Simulator?**

A: No. iOS Simulators do not support Universal Links. You **must** use a physical device for testing.

**Q: Do I need a separate workspace for each app?**

A: No. One workspace can have both iOS and Android apps. However, we recommend:
- **Single app**: One workspace
- **Multiple apps** (e.g., consumer app + driver app): Separate workspaces
- **Dev vs Prod**: Separate workspaces

---

### Billing Questions

**Q: What happens when I exceed my quota?**

A:
- **Link creation**: API returns error, no new links can be created until next month or upgrade
- **Clicks**: Existing links continue to work (no interruption to users)

**Q: When does my monthly quota reset?**

A: Quotas reset on the same day each month (30-day cycle from workspace creation). Check your dashboard for the exact reset date.

**Q: Can I upgrade/downgrade anytime?**

A: Yes. Changes take effect immediately:
- **Upgrade**: New quota applied instantly
- **Downgrade**: Takes effect at next billing cycle

---

### Troubleshooting Questions

**Q: Why doesn't my iOS app open from the link?**

A: Most common causes:
1. **AASA file not accessible** - verify with curl
2. **Bundle ID mismatch** - check Xcode vs Dashboard
3. **Associated Domains not configured** - add in Xcode
4. **Testing on Simulator** - use physical device
5. **iOS cache** - clear Safari data and reinstall app

See [Section 12.1](#121-common-issues) for detailed solutions.

**Q: Why doesn't my Android app open from the link?**

A: Most common causes:
1. **SHA-256 fingerprint mismatch** - verify all keystores
2. **Intent filter missing** - check AndroidManifest.xml
3. **autoVerify not set** - add `android:autoVerify="true"`
4. **Package name mismatch** - check build.gradle vs Dashboard
5. **App defaults not set** - clear and retry

See [Section 12.1](#121-common-issues) for detailed solutions.

**Q: Why is my social media preview blank?**

A: Check:
1. **Image URL is public** (not behind auth)
2. **Image is HTTPS** (not HTTP)
3. **Image size** is at least 200x200px
4. **social_meta was provided** when creating link
5. **Clear Facebook cache** using Facebook Debugger

---

## Appendix A: Migration Guide

### Migrating from Firebase Dynamic Links

If you're migrating from Firebase Dynamic Links, follow this checklist:

#### 1. Create DEPL Workspace

- [ ] Sign up for DEPL account
- [ ] Create workspace with your desired subdomain
- [ ] Configure iOS app (Bundle ID, Team ID, App Store ID)
- [ ] Configure Android app (Package Name, SHA-256 fingerprints)

#### 2. Update Mobile App Code

**iOS Changes**:

**Before (Firebase)**:
```swift
func application(_ app: UIApplication,
                 open url: URL,
                 options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    if let dynamicLink = DynamicLinks.dynamicLinks().dynamicLink(fromCustomSchemeURL: url) {
        // Handle Firebase Dynamic Link
    }
}
```

**After (DEPL)**:
```swift
func application(_ application: UIApplication,
                 continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
        return false
    }

    // Handle DEPL deep link
    handleDeepLink(url: url)
    return true
}
```

**Android Changes**:

**Before (Firebase)**:
```kotlin
FirebaseDynamicLinks.getInstance()
    .getDynamicLink(intent.data)
    .addOnSuccessListener { pendingDynamicLinkData ->
        // Handle Firebase Dynamic Link
    }
```

**After (DEPL)**:
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val uri = intent.data
    if (uri != null) {
        handleDeepLink(uri)
    }
}
```

#### 3. Update Backend Code

**Before (Firebase)**:
```javascript
const shortLink = await admin.dynamicLinks().createShortLink({
  longDynamicLink: '...',
});
```

**After (DEPL)**:
```javascript
const response = await fetch('https://depl.link/api/deeplink', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DEPL_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    slug: 'my-link',
    app_params: {
      screen: 'promo',
      promo_id: '123'
    }
  })
});

const { deeplink_url } = await response.json();
```

#### 4. Update Deep Link URLs

Replace all Firebase Dynamic Links URLs with DEPL URLs:

**Before**:
```
https://myapp.page.link/abc123
```

**After**:
```
https://myapp.depl.link/abc123
```

#### 5. Test Thoroughly

- [ ] Test iOS Universal Links
- [ ] Test Android App Links
- [ ] Test social media previews
- [ ] Test fallback to app stores
- [ ] Verify analytics tracking

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **AASA** | Apple App Site Association - JSON file that enables iOS Universal Links |
| **API Key** | Server-side authentication key for creating deep links (write access) |
| **App Links** | Android's native deep linking system (Android 6.0+) |
| **App Params** | Custom JSON data passed to your app when deep link opens |
| **assetlinks.json** | JSON file that enables Android App Links |
| **Bundle ID** | Unique identifier for iOS apps (e.g., com.company.app) |
| **Client Key** | Mobile app authentication key for reading deep links (read access) |
| **Deep Link** | URL that opens specific content within a mobile app |
| **Intent URL** | Android-specific URL format for app linking |
| **Package Name** | Unique identifier for Android apps (e.g., com.company.app) |
| **SHA-256 Fingerprint** | Cryptographic hash of Android app's signing certificate |
| **Slug** | Unique identifier in deep link URL (e.g., /summer-sale) |
| **Social Meta** | Metadata for social media previews (title, description, image) |
| **Subdomain** | Your workspace's unique identifier (e.g., myapp.depl.link) |
| **Team ID** | Apple Developer Team identifier (e.g., ABCD123456) |
| **Universal Link** | iOS's native deep linking system (iOS 9.0+) |
| **Workspace** | Container for your apps and deep links |

---

## Appendix C: Platform Requirements

### iOS Requirements

| Component | Minimum Version |
|-----------|----------------|
| iOS | 9.0+ (Universal Links) |
| Xcode | 12.0+ |
| Swift | 5.0+ |

**Capabilities Required**:
- Associated Domains

**Info.plist Entries**:
None required (handled by Associated Domains)

### Android Requirements

| Component | Minimum Version |
|-----------|----------------|
| Android | 6.0+ (Marshmallow, API 23) for auto-verification |
| Android Studio | 4.0+ |
| Kotlin/Java | Kotlin 1.5+ or Java 8+ |

**Permissions Required**:
None (App Links use standard INTERNET permission)

**Gradle Dependencies**:
```gradle
implementation 'com.squareup.okhttp3:okhttp:4.12.0'  // For API calls
implementation 'com.google.code.gson:gson:2.10.1'     // For JSON parsing
```

---

## Conclusion

Congratulations! You now have a comprehensive understanding of how to use DEPL for your mobile app deep linking needs.

**Quick Recap**:

1. **Create workspace** with unique subdomain
2. **Configure iOS/Android apps** with platform details
3. **Create deep links** via dashboard or API
4. **Integrate Universal/App Links** in your mobile apps
5. **Handle deep links** by fetching data from DEPL API
6. **Test thoroughly** on physical devices
7. **Monitor analytics** in dashboard

**Next Steps**:

- Start with a simple test deep link
- Integrate into one platform first (iOS or Android)
- Test with real users
- Scale to production

For support, visit [https://depl.link/docs](https://depl.link/docs) or contact support@depl.link.

Happy deep linking! 🚀

---

**Document Version**: 1.0
**Last Updated**: 2025-11-02
**Maintained by**: DEPL Team
