# Deep Link Testing Guide

## Overview

The app supports impersonate login via deep links. Users receive an email with a link like:
```
https://portal.kashier.io/en/login?accessToken=...&currentMerchantPayformanceId=...&refreshToken=...
```

## How It Works

1. User clicks the link in their email
2. Android/iOS opens the Kashier app (if properly configured)
3. The app navigates to `/en/login` or `/ar/login` route
4. The `DeepLinkHandler` component processes the query parameters:
   - Decrypts the `accessToken` and `currentMerchantPayformanceId`
   - Calls `/v2/identity/auth-by-token` API to get a real access token
   - Fetches full user data via `/v2/identity/user`
   - Sets authentication state and redirects to home

## Configuration

### Android App Links

The app is configured with intent filters in `app.config.ts`:

```typescript
intentFilters: [
  {
    action: 'VIEW',
    autoVerify: true,
    data: [
      {
        scheme: 'https',
        host: 'portal.kashier.io',
        pathPrefix: '/en/login',
      },
    ],
    category: ['BROWSABLE', 'DEFAULT'],
  },
  {
    action: 'VIEW',
    autoVerify: true,
    data: [
      {
        scheme: 'https',
        host: 'portal.kashier.io',
        pathPrefix: '/ar/login',
      },
    ],
    category: ['BROWSABLE', 'DEFAULT'],
  },
]
```

### iOS Universal Links

Configured via `associatedDomains` in `app.config.ts`:

```typescript
ios: {
  associatedDomains: ['applinks:portal.kashier.io'],
}
```

## Testing Deep Links

### Why Links Open in Browser (Common Issue)

If clicking the link opens the browser instead of the app, it's usually because:

1. **Missing assetlinks.json (Android)** or **apple-app-site-association (iOS)**
   - The server needs to host these files at:
     - Android: `https://portal.kashier.io/.well-known/assetlinks.json`
     - iOS: `https://portal.kashier.io/.well-known/apple-app-site-association`

2. **Certificate Mismatch**
   - The assetlinks.json must contain the SHA-256 fingerprint of the signing certificate used to build the APK
   - Preview/debug builds use different certificates than production

3. **Manual APK Installation**
   - Apps installed manually (not from Play Store) may not auto-verify App Links
   - Android needs to verify the app with the server first

### Solution 1: Manual App Link Verification (Android)

After installing the preview APK, manually verify the app links:

```bash
# Check current verification status
adb shell pm get-app-links com.kashier.merchantapp

# Manually verify the app links
adb shell pm verify-app-links --re-verify com.kashier.merchantapp

# Set the app as the default handler
adb shell pm set-app-links --package com.kashier.merchantapp 0 portal.kashier.io
```

### Solution 2: Use Custom Scheme (For Testing)

For easier testing during development, you can use a custom scheme URL instead:

```
kashier://login?accessToken=...&currentMerchantPayformanceId=...&refreshToken=...
```

This will always open the app without requiring server-side configuration.

**Note:** The custom scheme route still needs to be added to the app.

### Solution 3: Test via ADB

You can test deep links directly using ADB:

```bash
# Test HTTPS deep link
adb shell am start -W -a android.intent.action.VIEW -d "https://portal.kashier.io/en/login?accessToken=TEST&currentMerchantPayformanceId=TEST"

# Test custom scheme
adb shell am start -W -a android.intent.action.VIEW -d "kashier://login?accessToken=TEST&currentMerchantPayformanceId=TEST"
```

### Solution 4: Check Server Configuration

Ensure the server hosts the correct `assetlinks.json`:

```bash
# Check if the file exists
curl https://portal.kashier.io/.well-known/assetlinks.json

# Expected format:
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kashier.merchantapp",
    "sha256_cert_fingerprints": ["AA:BB:CC:..."]
  }
}]
```

To get your APK's SHA-256 fingerprint:

```bash
# For preview builds, get the fingerprint from EAS
eas credentials -p android

# Or extract from the keystore
keytool -list -v -keystore path/to/keystore.jks
```

## Troubleshooting

### Check Route Registration

Verify the routes exist:
- `app/en/login.tsx` → Handles `/en/login`
- `app/ar/login.tsx` → Handles `/ar/login`

### Check Deep Link Handler

The handler is at `app/deep-link-handler.tsx` and expects these query params:
- `accessToken` (required) - Encrypted token
- `currentMerchantPayformanceId` (required) - Encrypted merchant ID
- `refreshToken` (optional) - Encrypted refresh token
- `v2` (optional) - Version flag

### Check Decryption

The app uses `decryptToken()` from `src/core/utils/crypto.ts` which requires:
- `ENCRYPTION_KEY` environment variable
- `ENCRYPTION_IV` environment variable

Verify these are set in your EAS build:

```bash
eas env:list
```

### Check Logs

Monitor logs while clicking the deep link:

```bash
# Android
adb logcat | grep -i kashier

# Look for:
# - Intent filter matches
# - Route navigation
# - Decryption errors
# - API call errors
```

## Building with Deep Link Support

When building for testing:

```bash
# Preview build (APK)
eas build -p android --profile preview

# After installation, verify app links
adb shell pm verify-app-links --re-verify com.kashier.merchantapp
```

## Production Setup Checklist

- [ ] Routes exist: `app/en/login.tsx` and `app/ar/login.tsx`
- [ ] Intent filters configured in `app.config.ts`
- [ ] `assetlinks.json` hosted on server with correct SHA-256 fingerprint
- [ ] `apple-app-site-association` hosted on server (for iOS)
- [ ] Environment variables set in EAS (ENCRYPTION_KEY, ENCRYPTION_IV)
- [ ] App signed with production certificate
- [ ] Deep link tested via email on real device
- [ ] Deep link tested via ADB
- [ ] Error handling tested (invalid tokens, missing params, etc.)
