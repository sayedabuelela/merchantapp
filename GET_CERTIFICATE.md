# How to Get Certificate Fingerprint for Preview Build

## Method 1: EAS Build Details (After Build Completes)

Once your build is complete, view the build details:

```bash
# List recent builds
eas build:list --platform android --limit 5

# View specific build (copy the ID from the list)
eas build:view BUILD_ID
```

Look for the "Fingerprint" or certificate information in the output.

## Method 2: EAS Credentials (Interactive)

```bash
eas credentials
```

Then select:
1. Android
2. Select your profile (preview/production)
3. View credentials
4. Look for "Keystore" → "SHA-256 Certificate Fingerprint"

## Method 3: From Installed APK (Best for Preview)

If you already have the preview APK installed on your device:

```bash
# Connect device via USB and enable USB debugging

# Get the certificate fingerprint
adb shell pm dump com.kashier.merchantapp | grep -A 20 "Signing Certificates:"

# Or use this to get a cleaner output
adb shell dumpsys package com.kashier.merchantapp | grep "signatures\|Certificates"
```

## Method 4: Download APK and Extract Certificate

```bash
# Download the APK from the build
# Then extract the certificate

# Using apksigner (from Android SDK)
apksigner verify --print-certs kashier.apk

# Or using keytool
unzip -p kashier.apk META-INF/*.RSA | keytool -printcert | grep SHA256
```

## Method 5: EAS Dashboard (Web UI)

1. Go to https://expo.dev/
2. Navigate to your project: `kashiers-organization/kashier`
3. Go to "Credentials" in the left sidebar
4. Select "Android"
5. Find the keystore for your preview profile
6. Copy the SHA-256 fingerprint

## Quick Command Reference

```bash
# Check what's currently in assetlinks.json
curl https://portal.kashier.io/.well-known/assetlinks.json | jq

# Current fingerprint in assetlinks.json:
# 55:53:58:CB:92:9D:9B:B9:DE:DB:30:5F:50:71:15:2A:A8:FD:DC:B9:66:25:44:37:6A:B9:87:CD:E0:28:E9:12

# Get fingerprint from installed app
adb shell pm dump com.kashier.merchantapp | grep -i "sha256"

# Manually verify app links (after fixing)
adb shell pm verify-app-links --re-verify com.kashier.merchantapp
adb shell pm set-app-links --package com.kashier.merchantapp 0 portal.kashier.io

# Check verification status
adb shell pm get-app-links com.kashier.merchantapp
```

## What to Do After Getting the Fingerprint

Compare your preview build's fingerprint with what's in assetlinks.json:
- **If they match** → App links should work (try manual verification)
- **If they don't match** → Ask backend team to add preview fingerprint to assetlinks.json

The assetlinks.json can have multiple fingerprints:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kashier.merchantapp",
    "sha256_cert_fingerprints": [
      "55:53:58:CB:92:9D:9B:B9:DE:DB:30:5F:50:71:15:2A:A8:FD:DC:B9:66:25:44:37:6A:B9:87:CD:E0:28:E9:12",
      "YOUR_PREVIEW_FINGERPRINT_HERE"
    ]
  }
}]
```
