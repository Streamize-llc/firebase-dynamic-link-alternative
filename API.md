# DEPL API Documentation

## Overview

DEPL provides a RESTful API for creating and retrieving deep links. All API endpoints use JSON for request and response bodies.

**Base URL**: `https://depl.link`

---

## Authentication

DEPL uses two types of API keys:

- **API Key**: For creating deep links (write operations)
- **Client Key**: For retrieving deep link data (read operations)

Include your key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

Find your keys in: **Dashboard → Workspace → Settings**

---

## Endpoints

### 1. Create Deep Link

Create a new deep link for your mobile app.

**Endpoint**: `POST /api/deeplink`

**Headers**:
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Request Body**:
```json
{
  "slug": "summer-sale",
  "app_params": {
    "screen": "promo",
    "promo_id": "summer2024",
    "discount": "50"
  },
  "social_meta": {
    "title": "Summer Sale - 50% Off!",
    "description": "Don't miss our biggest sale of the year",
    "thumbnail_url": "https://cdn.example.com/summer.jpg"
  }
}
```

**Parameters**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | No | Custom URL slug. If omitted, a random 6-character slug is generated. |
| `app_params` | object | Yes | Custom parameters passed to your app when opened. Can contain any key-value pairs. |
| `social_meta` | object | No | Metadata for social media sharing. |
| `social_meta.title` | string | No | Social media title (default: "Depl.link \| App Download") |
| `social_meta.description` | string | No | Social media description (default: "Download the mobile app...") |
| `social_meta.thumbnail_url` | string | No | Social media thumbnail URL (default: "/images/og-image.jpg") |

**Success Response (200 OK)**:
```json
{
  "success": true,
  "deeplink_url": "https://yourdomain.depl.link/summer-sale",
  "created_at": "2025-01-24T10:30:00.000Z"
}
```

**Error Responses**:

**401 Unauthorized** - Invalid API Key
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key."
  }
}
```

**400 Bad Request** - Missing required fields
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Required field missing. app_params is required."
  }
}
```

**400 Bad Request** - No apps configured
```json
{
  "error": {
    "code": "NO_APPS_CONFIGURED",
    "message": "프로젝트에 등록된 앱이 없습니다."
  }
}
```

**409 Conflict** - Slug already exists
```json
{
  "error": {
    "code": "SLUG_ALREADY_EXISTS",
    "message": "A deeplink with this slug already exists in your workspace."
  }
}
```

---

### 2. Get Deep Link

Retrieve deep link data by slug. Use this in your mobile app to fetch parameters when a deep link is opened.

**Endpoint**: `GET /api/deeplink?slug={slug}`

**Headers**:
```
Authorization: Bearer YOUR_CLIENT_KEY
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | The slug from the deep link URL |

**Success Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "workspace_id": "workspace-id",
  "slug": "summer-sale",
  "is_random_slug": false,
  "app_params": {
    "screen": "promo",
    "promo_id": "summer2024",
    "discount": "50"
  },
  "ios_parameters": {
    "bundle_id": "com.myapp.ios",
    "app_store_id": "6450730873"
  },
  "android_parameters": {
    "package_name": "com.myapp.android",
    "action": "android.intent.action.VIEW",
    "fallback_url": "https://play.google.com/store/apps/details?id=com.myapp.android"
  },
  "social_meta": {
    "title": "Summer Sale - 50% Off!",
    "description": "Don't miss our biggest sale of the year",
    "thumbnail_url": "https://cdn.example.com/summer.jpg"
  },
  "click_count": 1234,
  "source": "API",
  "created_at": "2025-01-24T10:30:00.000Z",
  "updated_at": "2025-01-24T10:30:00.000Z"
}
```

**Error Responses**:

**401 Unauthorized** - Invalid Client Key
```json
{
  "error": {
    "code": "INVALID_CLIENT_KEY",
    "message": "Invalid client_key."
  }
}
```

**400 Bad Request** - Missing slug parameter
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "slug parameter is required."
  }
}
```

**404 Not Found** - Deep link not found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Deeplink with the specified slug not found."
  }
}
```

---

### 3. iOS Universal Links Verification File

Returns the Apple App Site Association (AASA) file for Universal Links configuration.

**Endpoint**: `GET /api/apple-app-site-association`

**Access**: `https://{your-subdomain}.depl.link/api/apple-app-site-association`

**Headers**: None required

**Response (200 OK)**:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABCD123456.com.example.myapp",
        "paths": ["NOT /_/*", "/*"]
      }
    ]
  }
}
```

**Notes**:
- The `appID` is constructed from your iOS app's Team ID and Bundle ID
- This file is automatically generated based on your workspace's iOS app configuration
- If no iOS app is configured, returns an empty AASA file (with `apps: []` and `details: []`)
- This endpoint always returns `200 OK` to comply with Apple's requirements

---

### 4. Android App Links Verification File

Returns the Digital Asset Links file for Android App Links configuration.

**Endpoint**: `GET /api/assetlinks`

**Access**: `https://{your-subdomain}.depl.link/.well-known/assetlinks.json`

**Headers**: None required

**Response (200 OK)**:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.myapp",
      "sha256_cert_fingerprints": [
        "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
      ]
    }
  }
]
```

**Notes**:
- This file is automatically generated based on your workspace's Android app configuration
- The `package_name` and `sha256_cert_fingerprints` are from your Android app settings
- If no Android app is configured, returns an empty array `[]`

---

## Mobile Integration Examples

### iOS (Swift)

```swift
// When your app opens from a deep link
func handleDeepLink(url: URL) {
    // Extract slug from URL: https://yourdomain.depl.link/summer-sale
    let slug = url.lastPathComponent

    // Fetch deep link data
    var request = URLRequest(url: URL(string: "https://depl.link/api/deeplink?slug=\(slug)")!)
    request.setValue("Bearer YOUR_CLIENT_KEY", forHTTPHeaderField: "Authorization")

    URLSession.shared.dataTask(with: request) { data, response, error in
        if let data = data {
            let deeplink = try? JSONDecoder().decode(DeepLink.self, from: data)
            // Use deeplink.app_params to navigate your app
            navigateToScreen(params: deeplink?.app_params)
        }
    }.resume()
}
```

### Android (Kotlin)

```kotlin
// When your app opens from a deep link
fun handleDeepLink(uri: Uri) {
    // Extract slug from URL: https://yourdomain.depl.link/summer-sale
    val slug = uri.lastPathSegment

    // Fetch deep link data
    val request = Request.Builder()
        .url("https://depl.link/api/deeplink?slug=$slug")
        .addHeader("Authorization", "Bearer YOUR_CLIENT_KEY")
        .build()

    client.newCall(request).enqueue(object : Callback {
        override fun onResponse(call: Call, response: Response) {
            val deeplink = gson.fromJson(response.body?.string(), DeepLink::class.java)
            // Use deeplink.app_params to navigate your app
            navigateToScreen(deeplink.app_params)
        }
    })
}
```

---

## Rate Limits

| Plan | Rate Limit |
|------|------------|
| Free | 100 requests/minute |
| Pro  | 1000 requests/minute |
| Enterprise | Custom |

---

## Best Practices

1. **Use Custom Slugs**: For marketing campaigns, use memorable slugs like `summer-sale` instead of random strings
2. **Structured app_params**: Use a consistent schema for your `app_params` to make client-side parsing easier
3. **Social Meta**: Always include `social_meta` for better social media sharing experience
4. **Error Handling**: Implement proper error handling for all API calls
5. **Client Key Security**: Client keys are safe to embed in mobile apps, but API keys should only be used server-side

---

## Support

For issues or questions, please contact: support@depl.link

or visit our documentation: https://depl.link/docs
