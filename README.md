# Firebase Dynamic Links Alternatives

> Comprehensive guide to Firebase Dynamic Links alternatives after its shutdown in August 2025

Firebase Dynamic Links was discontinued on **August 25, 2025**. This repository provides a detailed comparison of alternatives to help you migrate your deep linking infrastructure.

## 📋 Table of Contents

- [Why Find an Alternative?](#why-find-an-alternative)
- [Quick Comparison Table](#quick-comparison-table)
- [Detailed Analysis](#detailed-analysis)
- [Migration Guide](#migration-guide)
- [Choosing the Right Solution](#choosing-the-right-solution)

---

## Why Find an Alternative?

Firebase Dynamic Links served millions of apps but Google decided to sunset the service. Key reasons to migrate:

- ✅ Service discontinued (August 25, 2025)
- ✅ Existing links will redirect to error pages
- ✅ No new link creation after shutdown
- ✅ Need reliable deep linking for marketing campaigns
- ✅ App Store and Play Store optimization requirements

---

## Quick Comparison Table

| Provider | Free Tier | Pricing Start | SDK Required | Setup Time | Best For |
|----------|-----------|---------------|--------------|------------|----------|
| **[DEPL](#depl-recommended)** | ✅ 100 links/mo | $9/mo | ❌ API Only | ~15 min | Developers, Startups |
| **[Branch.io](#branchio)** | ❌ No | $299/mo | ✅ Yes | ~2 hours | Enterprise, Attribution |
| **[AppsFlyer](#appsflyer-onelink)** | ❌ No | $299/mo | ✅ Yes | ~3 hours | Marketing Teams |
| **[Adjust](#adjust-deep-linking)** | ❌ No | Custom | ✅ Yes | ~2 hours | Mobile Attribution |
| **[Airship](#airship)** | ❌ No | Custom | ✅ Yes | ~4 hours | Push + Deep Linking |
| **[Singular](#singular-links)** | ❌ No | Custom | ✅ Yes | ~2 hours | Marketing Analytics |
| **[Kochava](#kochava-smartlinks)** | ❌ No | Custom | ✅ Yes | ~3 hours | Fraud Prevention |

---

## Detailed Analysis

### DEPL (Recommended)

**Website**: [depl.link](https://depl.link)

#### Overview
Open-source Firebase Dynamic Links alternative with pure REST API integration. No SDK required.

#### Key Features
- ✅ **No SDK Required**: Pure REST API integration
- ✅ **Firebase-like API**: Similar request/response structure
- ✅ **Custom Subdomains**: Brand your links (`yourapp.depl.link`)
- ✅ **Universal Links & App Links**: Native iOS and Android support
- ✅ **Social Media Optimization**: Rich previews on all platforms
- ✅ **Real-time Analytics**: Click tracking and statistics
- ✅ **Fast Setup**: 15 minutes from signup to first link

#### Pricing
```
Free:       100 links/month, 1,000 clicks
Pro:        $9/month - 1,000 links, 50,000 clicks
Enterprise: Custom pricing
```

#### Code Example

**Create Deep Link**
```bash
curl https://depl.link/api/deeplink \
  -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "summer-sale",
    "app_params": {
      "screen": "promo",
      "promo_id": "summer2024"
    },
    "social_meta": {
      "title": "Summer Sale - 50% Off!",
      "thumbnail_url": "https://cdn.example.com/sale.jpg"
    }
  }'
```

**Response**
```json
{
  "success": true,
  "deeplink_url": "https://yourapp.depl.link/summer-sale"
}
```

#### Mobile Integration (No SDK!)

**iOS (Swift)**
```swift
// Just handle Universal Links - no SDK needed
func application(_ application: UIApplication,
                 continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    guard let url = userActivity.webpageURL else { return false }

    let slug = url.lastPathSegment
    fetchDeepLinkData(slug: slug) // Your own API call
    return true
}
```

**Android (Kotlin)**
```kotlin
// Just handle App Links - no SDK needed
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val uri = intent.data
    val slug = uri?.lastPathSegment
    if (slug != null) {
        fetchDeepLinkData(slug) // Your own API call
    }
}
```

#### Pros
- ✅ Most affordable option with generous free tier
- ✅ No vendor lock-in (pure API, no SDK)
- ✅ Fastest migration path from Firebase
- ✅ Developer-friendly documentation
- ✅ Open-source friendly architecture
- ✅ Simple integration (15 minutes)

#### Cons
- ⚠️ Newer platform (less market presence)
- ⚠️ No built-in attribution (use with Google Analytics/Mixpanel)
- ⚠️ Limited enterprise features

#### Best For
- Startups and indie developers
- Teams migrating from Firebase Dynamic Links
- Developers preferring API-first solutions
- Apps that don't need complex attribution

---

### Branch.io

**Website**: [branch.io](https://branch.io)

#### Overview
Industry-leading deep linking platform with extensive attribution and analytics features.

#### Key Features
- ✅ Advanced attribution and analytics
- ✅ Cross-platform support (iOS, Android, Web, Email)
- ✅ A/B testing for deep links
- ✅ Fraud detection
- ✅ Journey analytics
- ❌ Requires SDK integration

#### Pricing
```
Starting at $299/month (10,000 MAU)
Enterprise: Custom (>100,000 MAU)
```

#### Code Example
```javascript
// Requires Branch SDK
branch.link({
  channel: 'instagram',
  feature: 'sharing',
  data: {
    '$og_title': 'Summer Sale',
    '$og_description': '50% off',
    screen: 'promo',
    promo_id: 'summer2024'
  }
}, (err, link) => {
  console.log(link);
});
```

#### Pros
- ✅ Industry standard with proven track record
- ✅ Comprehensive attribution features
- ✅ Advanced analytics and reporting
- ✅ A/B testing capabilities
- ✅ Enterprise-grade support

#### Cons
- ❌ Expensive ($299/month minimum)
- ❌ No free tier
- ❌ Requires SDK integration
- ❌ Complex setup (2+ hours)
- ❌ Vendor lock-in

#### Best For
- Large enterprises with big budgets
- Marketing teams needing advanced attribution
- Apps requiring fraud detection
- Complex user journey tracking

---

### AppsFlyer OneLink

**Website**: [appsflyer.com](https://www.appsflyer.com/products/onelink/)

#### Overview
Deep linking solution integrated with AppsFlyer's mobile attribution platform.

#### Key Features
- ✅ Integrated with AppsFlyer attribution
- ✅ Cross-platform deep linking
- ✅ Marketing campaign tracking
- ✅ ROI measurement
- ❌ Requires AppsFlyer SDK

#### Pricing
```
Starting at $299/month
Enterprise: Custom pricing
```

#### Pros
- ✅ Seamless integration with AppsFlyer ecosystem
- ✅ Powerful marketing analytics
- ✅ ROI tracking
- ✅ Fraud prevention

#### Cons
- ❌ Expensive
- ❌ Must use AppsFlyer for attribution
- ❌ SDK required
- ❌ Complex setup

#### Best For
- Teams already using AppsFlyer
- Marketing-focused organizations
- Apps with large ad spend

---

### Adjust Deep Linking

**Website**: [adjust.com](https://www.adjust.com/product/deep-linking/)

#### Overview
Deep linking integrated with Adjust's mobile measurement platform.

#### Key Features
- ✅ Mobile attribution integration
- ✅ Reattribution support
- ✅ Fraud prevention
- ❌ Requires Adjust SDK

#### Pricing
```
Custom pricing (contact sales)
Typically $299+/month
```

#### Pros
- ✅ Strong attribution features
- ✅ Fraud detection
- ✅ Global presence

#### Cons
- ❌ Must contact sales for pricing
- ❌ SDK required
- ❌ Complex setup

#### Best For
- Apps with complex attribution needs
- Teams already using Adjust

---

### Airship

**Website**: [airship.com](https://www.airship.com/)

#### Overview
Mobile engagement platform with deep linking capabilities.

#### Key Features
- ✅ Push notifications + deep linking
- ✅ In-app messaging
- ✅ Cross-channel orchestration
- ❌ Requires SDK

#### Pricing
```
Custom pricing
Enterprise-focused
```

#### Pros
- ✅ All-in-one mobile engagement
- ✅ Push + deep linking combined
- ✅ Enterprise support

#### Cons
- ❌ Expensive (enterprise pricing)
- ❌ SDK required
- ❌ Overkill if you only need deep linking

#### Best For
- Enterprise apps needing push + deep linking
- Large marketing teams

---

### Singular Links

**Website**: [singular.net](https://www.singular.net/)

#### Overview
Marketing analytics platform with deep linking.

#### Key Features
- ✅ Marketing analytics integration
- ✅ Cost aggregation
- ✅ ROI tracking
- ❌ Requires SDK

#### Pricing
```
Custom pricing
```

#### Pros
- ✅ Marketing-focused analytics
- ✅ Cost aggregation across channels

#### Cons
- ❌ Custom pricing only
- ❌ SDK required
- ❌ More analytics than deep linking

#### Best For
- Marketing teams with large budgets
- Multi-channel campaign tracking

---

### Kochava SmartLinks

**Website**: [kochava.com](https://www.kochava.com/)

#### Overview
Attribution platform with fraud prevention and deep linking.

#### Key Features
- ✅ Fraud prevention focus
- ✅ Attribution tracking
- ✅ Cost analytics
- ❌ Requires SDK

#### Pricing
```
Custom pricing
```

#### Pros
- ✅ Strong fraud detection
- ✅ Attribution features

#### Cons
- ❌ Custom pricing
- ❌ SDK required
- ❌ Complex setup

#### Best For
- Apps concerned about fraud
- Enterprise attribution needs

---

## Migration Guide

### From Firebase Dynamic Links to DEPL

DEPL provides the smoothest migration path with Firebase-like API structure.

#### Step 1: Sign Up
1. Visit [depl.link](https://depl.link)
2. Sign in with Google
3. Create workspace with your subdomain

#### Step 2: Configure Apps

**iOS**
- Bundle ID
- Team ID
- App Store ID

**Android**
- Package Name
- SHA-256 fingerprints

#### Step 3: Update Backend Code

**Before (Firebase)**
```javascript
const shortLink = await admin.dynamicLinks().createShortLink({
  longDynamicLink: 'https://example.page.link/?link=...',
  suffix: { option: 'SHORT' }
});
```

**After (DEPL)**
```javascript
const response = await fetch('https://depl.link/api/deeplink', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DEPL_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    slug: 'summer-sale',
    app_params: {
      screen: 'promo',
      promo_id: 'summer2024'
    }
  })
});

const { deeplink_url } = await response.json();
```

#### Step 4: Update Mobile App

**iOS**: Replace Firebase SDK with native Universal Links
```swift
// Remove Firebase SDK
// pod 'Firebase/DynamicLinks'  ❌ Remove this

// Add Associated Domains in Xcode
// applinks:yourapp.depl.link

// Handle Universal Links (native iOS)
func application(_ application: UIApplication,
                 continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    // Your handling code
}
```

**Android**: Replace Firebase SDK with native App Links
```kotlin
// Remove Firebase SDK from build.gradle
// implementation 'com.google.firebase:firebase-dynamic-links'  ❌ Remove this

// Add intent filter in AndroidManifest.xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="yourapp.depl.link" />
</intent-filter>
```

#### Step 5: Test
- iOS: Send link via iMessage, tap on device
- Android: `adb shell am start -W -a android.intent.action.VIEW -d "https://yourapp.depl.link/test"`

**Migration time: ~2-3 hours**

---

## Choosing the Right Solution

### Decision Tree

```
Do you need advanced attribution tracking?
├─ Yes → Do you have $300+/month budget?
│   ├─ Yes → Branch.io, AppsFlyer, or Adjust
│   └─ No → DEPL + Google Analytics/Mixpanel
└─ No → Do you want simple API integration?
    ├─ Yes → DEPL
    └─ No → Branch.io (if budget allows)
```

### By Use Case

#### Startups & Indie Developers
**Recommended**: **DEPL**
- Generous free tier
- No SDK overhead
- Fast integration
- Grow into Pro plan as you scale

#### Small to Medium Apps
**Recommended**: **DEPL** or **Branch.io**
- DEPL: If budget-conscious, API-first approach
- Branch.io: If need advanced attribution

#### Enterprise Apps
**Recommended**: **Branch.io**, **AppsFlyer**, or **Adjust**
- Advanced attribution required
- Budget for $300+/month
- Dedicated support teams

#### Marketing-Heavy Apps
**Recommended**: **AppsFlyer** or **Singular**
- Need campaign tracking
- ROI measurement critical
- Multi-channel attribution

#### Games
**Recommended**: **DEPL** or **Branch.io**
- DEPL: Simple sharing/referral links
- Branch.io: Complex viral loops

---

## Feature Comparison

| Feature | DEPL | Branch.io | AppsFlyer | Adjust |
|---------|------|-----------|-----------|--------|
| **Deep Linking** | ✅ | ✅ | ✅ | ✅ |
| **Universal Links** | ✅ | ✅ | ✅ | ✅ |
| **App Links** | ✅ | ✅ | ✅ | ✅ |
| **Social Meta Tags** | ✅ | ✅ | ✅ | ✅ |
| **Custom Domains** | ✅ | ✅ | ✅ | ✅ |
| **Click Analytics** | ✅ Basic | ✅ Advanced | ✅ Advanced | ✅ Advanced |
| **Attribution** | ❌ | ✅ | ✅ | ✅ |
| **A/B Testing** | ❌ | ✅ | ✅ | ✅ |
| **Fraud Detection** | ❌ | ✅ | ✅ | ✅ |
| **No SDK Required** | ✅ | ❌ | ❌ | ❌ |
| **Free Tier** | ✅ | ❌ | ❌ | ❌ |
| **Setup Time** | 15 min | 2+ hours | 3+ hours | 2+ hours |
| **Starting Price** | Free/$9 | $299 | $299 | Custom |

---

## Technical Comparison

### API Complexity

**DEPL** (Simplest)
```bash
curl https://depl.link/api/deeplink \
  -X POST \
  -H "Authorization: Bearer API_KEY" \
  -d '{"app_params": {"screen": "home"}}'
```

**Branch.io**
```javascript
// Requires SDK initialization
branch.init('key_live_xxx');
branch.link({ data: {...} }, callback);
```

**AppsFlyer**
```javascript
// Requires SDK + complex config
appsFlyer.initSdk({
  devKey: 'xxx',
  isDebug: false,
  appId: 'xxx',
  onInstallConversionDataListener: true,
  onDeepLinkListener: true
});
```

### SDK Size Impact

| Provider | iOS SDK Size | Android SDK Size |
|----------|--------------|------------------|
| **DEPL** | 0 KB (No SDK) | 0 KB (No SDK) |
| **Branch.io** | ~2.5 MB | ~500 KB |
| **AppsFlyer** | ~3 MB | ~800 KB |
| **Adjust** | ~2 MB | ~600 KB |

---

## Real-World Examples

### E-commerce App

**Requirements**:
- Product deep links
- Social sharing
- Basic analytics

**Best Choice**: **DEPL**

```javascript
// Create product link
const link = await createDeepLink({
  slug: `product-${productId}`,
  app_params: {
    screen: 'product_detail',
    product_id: productId
  },
  social_meta: {
    title: product.name,
    description: product.description,
    thumbnail_url: product.image
  }
});
```

**Why**: Simple, affordable, no SDK overhead, great social previews.

---

### Food Delivery App

**Requirements**:
- Referral links
- Restaurant deep links
- Marketing campaigns
- Advanced attribution

**Best Choice**: **Branch.io**

**Why**: Need to track complex referral flows and marketing ROI.

---

### Social Media App

**Requirements**:
- User profile links
- Content sharing
- Viral growth tracking

**Best Choice**: **DEPL** (early stage) or **Branch.io** (growth stage)

**Why**: Start with DEPL for MVP, upgrade to Branch.io when scaling.

---

## Community & Support

### DEPL
- 📖 Documentation: [depl.link/docs](https://depl.link/docs)
- 💬 GitHub: Open issues and discussions
- 📧 Email: support@depl.link

### Branch.io
- 📖 Documentation: [help.branch.io](https://help.branch.io)
- 💬 Community Slack
- 📧 Enterprise support (paid plans)

### AppsFlyer
- 📖 Documentation: [support.appsflyer.com](https://support.appsflyer.com)
- 💬 Support portal
- 📧 Dedicated account managers (enterprise)

---

## FAQ

### Why not just build your own?

Building a deep linking system requires:
- Universal Links / App Links infrastructure
- AASA / assetlinks.json hosting
- Platform detection logic
- Social media meta tag handling
- Click tracking
- Analytics dashboard
- Ongoing maintenance

**Estimated development time**: 2-4 weeks
**Ongoing maintenance**: 5-10 hours/month

**DEPL** provides all this for **$9/month** - less than 1 hour of developer time.

### Can I use multiple providers?

Yes, but not recommended due to:
- SDK conflicts
- Double click attribution
- Increased app size
- Maintenance complexity

### What about privacy (GDPR/CCPA)?

**DEPL**: No personal data collected, GDPR compliant by design
**Branch/AppsFlyer/Adjust**: Collect user data for attribution (requires consent management)

### Do I need to change my domain?

**DEPL**: Uses `yourapp.depl.link` subdomain (custom domains coming soon)
**Others**: Usually provide custom domain options (enterprise plans)

---

## Conclusion

### TL;DR Recommendations

**For 90% of apps**: Start with **[DEPL](https://depl.link)**
- ✅ Affordable (free tier available)
- ✅ Fast setup (15 minutes)
- ✅ No SDK required
- ✅ Easy migration from Firebase
- ✅ Scales as you grow

**For enterprise apps with $300+/month budget**: **Branch.io**
- ✅ Advanced attribution
- ✅ Fraud detection
- ✅ A/B testing
- ✅ Enterprise support

**For marketing teams**: **AppsFlyer OneLink**
- ✅ Marketing analytics focus
- ✅ Campaign ROI tracking
- ✅ Multi-channel attribution

---

## Get Started

### Try DEPL (Recommended for most apps)

1. Visit [depl.link](https://depl.link)
2. Sign up (free tier available)
3. Create your first deep link in 15 minutes
4. Migrate from Firebase with minimal code changes

### Other Options

- [Branch.io](https://branch.io) - Free trial available
- [AppsFlyer](https://www.appsflyer.com) - Contact sales
- [Adjust](https://www.adjust.com) - Contact sales

---

## Contributing

This guide is maintained by the community. To suggest changes:

1. Fork this repository
2. Update README.md
3. Submit a pull request

---

## License

This guide is provided as-is for informational purposes. Individual services mentioned have their own terms and conditions.

---

## Updates

- **2025-11**: Created comprehensive comparison guide
- **2025-08**: Firebase Dynamic Links shut down
- **2025-01**: Firebase Dynamic Links deprecation announced

---

**Last Updated**: November 2025

**Maintained by**: [Streamize LLC](https://github.com/Streamize-llc)
