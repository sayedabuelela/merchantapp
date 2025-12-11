# EAS Setup Guide - Step by Step

> **Your First Time with EAS? Perfect!** This guide walks you through everything step-by-step with explanations.

> **✨ Updated December 2025** - This guide uses the latest EAS CLI commands and best practices from the official Expo documentation.

## 📋 Table of Contents
- [Understanding Managed Workflow](#understanding-managed-workflow)
- [What You've Already Done](#what-youve-already-done)
- [Quick Start Checklist](#quick-start-checklist)
- [Detailed Setup Steps](#detailed-setup-steps)
- [Testing Your Builds](#testing-your-builds)
- [Troubleshooting](#troubleshooting)

---

## 🎓 Understanding Managed Workflow

### What is Managed Workflow?
You're using **Expo's Managed Workflow**, which means:
- ✅ **Do NOT edit** `android/` or `ios/` folders directly
- ✅ **Configure everything** through `app.json` and EAS configuration
- ✅ **Native folders regenerate** when you run `expo prebuild --clean`
- ✅ **EAS handles** all the complex native build configuration

### Why This Matters
When you run `expo prebuild --clean`, Expo:
1. Deletes existing `android/` and `ios/` folders
2. Regenerates them from your `app.json` configuration
3. Applies all plugins and native configurations automatically

**Key Principle**: Configuration goes in `app.json`, not native folders!

---

## ✅ What You've Already Done

Good news! You've completed these initial steps:

### 1. EAS Project Initialized ✓
```bash
bunx eas-cli@latest init --id d404b506-3538-4f98-8128-43573bc0a5be
```
**What this did**: Linked your project to EAS organization `kashiers-organization`

### 2. Build Configuration Created ✓
```bash
eas build:configure
```
**What this did**: Created `eas.json` with basic build profiles

### 3. Build Scripts Added ✓
Your `package.json` already has these scripts:
- `build:preview:ios` - Build iOS for testing
- `build:preview:android` - Build Android for testing
- `build:preview:all` - Build both platforms
- `submit:preview:ios` - Submit to TestFlight
- `submit:preview:android` - Submit to Google Play Internal Testing

---

## 🎯 Quick Start Checklist

Before we dive deep, here's what we need to set up:

- [ ] **Phase 1**: Secure sensitive data (encryption keys)
- [ ] **Phase 2**: Configure EAS build profiles in `eas.json`
- [ ] **Phase 3**: Set up iOS credentials (certificates, provisioning)
- [ ] **Phase 4**: Set up Android credentials (keystore, signing)
- [ ] **Phase 5**: Configure push notifications
- [ ] **Phase 6**: Enable backend integration for notifications
- [ ] **Phase 7**: Set up CI/CD with GitHub Actions
- [ ] **Phase 8**: Test builds and QA distribution

---

## 🚀 Detailed Setup Steps

### PHASE 1: Secure Sensitive Data (15 minutes)

#### Problem
Your deep linking encryption keys are currently **hardcoded** in source code:
```typescript
// ❌ BAD: Exposed in git history
export const ENCRYPTION_KEY = 'e2070c4b4d582330d36b000de1a6d8c2';
export const ENCRYPTION_IV = '4cedf7bd8763484f9557257b98f1f1c5';
```

#### Solution: Use Environment Variables

**Step 1.1: Create `.env` file** (in project root)
```bash
# Deep linking encryption keys
ENCRYPTION_KEY=e2070c4b4d582330d36b000de1a6d8c2
ENCRYPTION_IV=4cedf7bd8763484f9557257b98f1f1c5
```

**Step 1.2: Create `.env.example` file** (template for team)
```bash
# Deep linking encryption keys
ENCRYPTION_KEY=your_encryption_key_here
ENCRYPTION_IV=your_encryption_iv_here
```

**Step 1.3: Update `.gitignore`**
Add these lines to ensure secrets aren't committed:
```
# Environment variables
.env

# Google Play service account
google-play-service-account.json
```

**Step 1.4: Update `app.json`**
Add environment variables to the `extra` section (after line 119):
```json
"extra": {
  "router": {},
  "eas": {
    "projectId": "d404b506-3538-4f98-8128-43573bc0a5be"
  },
  "encryptionKey": "${ENCRYPTION_KEY}",
  "encryptionIV": "${ENCRYPTION_IV}"
}
```

**Step 1.5: Update `src/core/environment/environments.ts`**
Replace the hardcoded values (lines 41-42) with:
```typescript
import Constants from 'expo-constants';

// Read from environment variables via expo-constants
export const ENCRYPTION_KEY = Constants.expoConfig?.extra?.encryptionKey || '';
export const ENCRYPTION_IV = Constants.expoConfig?.extra?.encryptionIV || '';
```

**Step 1.6: Store environment variables in EAS**
These will be used during EAS builds:
```bash
# Store encryption keys in EAS (for cloud builds)
eas env:create --name ENCRYPTION_KEY --value "e2070c4b4d582330d36b000de1a6d8c2" --type string --visibility secret --scope project
eas env:create --name ENCRYPTION_IV --value "4cedf7bd8763484f9557257b98f1f1c5" --type string --visibility secret --scope project

# Verify they were created
eas env:list --scope project
```

**Command Options Explained**:
- `--type string` - It's a text value (not a file)
- `--visibility secret` - Hide the value in EAS dashboard (most secure)
- `--scope project` - Available to this project only

**Why this matters**: Now your secrets are:
- ✅ Not in git history
- ✅ Loaded from environment at build time
- ✅ Securely stored in EAS with secret visibility

---

### PHASE 2: Configure EAS Build Profiles (20 minutes)

Your `eas.json` is currently minimal. Let's configure it properly.

#### Understanding Build Profiles

EAS supports multiple build profiles:
- **development**: For development builds with expo-dev-client
- **preview**: For QA testing (what you want!)
- **production**: For final App Store/Play Store releases

#### Step 2.1: Update `eas.json`

Replace the entire contents of `eas.json` with:

```json
{
  "cli": {
    "version": ">= 16.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium",
        "bundleIdentifier": "com.kashier.merchantapp"
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "ENCRYPTION_KEY": "$ENCRYPTION_KEY",
        "ENCRYPTION_IV": "$ENCRYPTION_IV"
      }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "autoIncrement": true,
      "ios": {
        "resourceClass": "m-medium",
        "bundleIdentifier": "com.kashier.merchantapp"
      },
      "android": {
        "buildType": "aab"
      },
      "env": {
        "ENCRYPTION_KEY": "$ENCRYPTION_KEY",
        "ENCRYPTION_IV": "$ENCRYPTION_IV"
      }
    }
  },
  "submit": {
    "preview": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@example.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal",
        "releaseStatus": "draft"
      }
    },
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@example.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "production"
      }
    }
  }
}
```

#### Understanding the Configuration

**Key Settings Explained**:

| Setting | What It Does |
|---------|-------------|
| `distribution: "internal"` | Build will be distributed via TestFlight/Internal Testing (not public stores) |
| `channel: "preview"` | Identifies this build channel (useful for updates) |
| `resourceClass: "m-medium"` | EAS build server size (faster builds, reasonable cost) |
| `buildType: "apk"` | Android APK for preview (faster), AAB for production (required by Play Store) |
| `env: { ... }` | Environment variables available during build |
| `autoIncrement: true` | Automatically bump version numbers |
| `track: "internal"` | Google Play track (internal/alpha/beta/production) |
| `releaseStatus: "draft"` | Submit as draft (good for new apps, allows you to review before publishing) |

**Why use internal distribution for preview?**
- QA can install via TestFlight link (iOS) or Google Play Internal Testing (Android)
- No App Store/Play Store review required
- Updates can be pushed quickly

---

### PHASE 3: Set Up iOS Credentials (45 minutes)

EAS will help you create and manage iOS certificates automatically.

#### What You Need
- Apple Developer Account (with Admin or App Manager role)
- Access to your Apple ID and password

#### Step 3.1: Configure iOS Credentials Interactively

Run this command:
```bash
eas credentials
```

You'll see a menu. Follow these steps:

**Navigation Path**:
1. Select: **iOS**
2. Select: **com.kashier.merchantapp** (your bundle identifier)
3. Select: **Set up Push Notifications**

**What EAS Will Do**:
- Generate an Apple Push Notification Service (APNs) Key
- Create or reuse a Distribution Certificate
- Create a Provisioning Profile
- Store everything securely in EAS

**Expected Prompts**:
- "Sign in to Apple Developer Portal" → Enter your Apple ID credentials
- "Select Team" → Choose your organization's team
- "Create new Push Key?" → Yes
- "Create new Distribution Certificate?" → Yes (or reuse if you have one)

#### Step 3.2: Verify Credentials

After setup, verify everything is configured:
```bash
eas credentials --profile preview --platform ios
```

You should see:
- ✅ Push Notification Key
- ✅ Distribution Certificate
- ✅ Provisioning Profile

#### Step 3.3: Update `eas.json` Submit Configuration

You'll need these values from App Store Connect:

1. **Go to**: https://appstoreconnect.apple.com
2. **Find or Create App**: Search for "Kashier" or create new app
3. **Get App ID**: In app settings, find "Apple ID" (numeric, e.g., `1234567890`)
4. **Get Team ID**: https://developer.apple.com/account → Membership → Team ID

**Update `eas.json`** submit section with your values:
```json
"submit": {
  "preview": {
    "ios": {
      "appleId": "your-email@kashier.io",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCDE12345"
    }
  }
}
```

#### Step 3.4: Set Up TestFlight Internal Testing

1. **Go to**: https://appstoreconnect.apple.com
2. **Select Your App** → TestFlight tab
3. **Create Internal Testing Group**:
   - Name: "QA Team"
   - Add testers by email (they must have Apple IDs)
4. **Enable Automatic Distribution**: Testers get builds automatically

**Alternative: Register Specific Devices**
If you want ad-hoc distribution instead:
```bash
eas device:create
```
Share the link with QA team to register their devices.

---

### PHASE 4: Set Up Android Credentials (30 minutes)

For Android, you need a **keystore** to sign your app.

#### Understanding Android Keystores

**What is a Keystore?**
- A cryptographic file that proves you're the app publisher
- Once you publish with a keystore, you MUST use it forever
- Lose it = can't update your app on Play Store 🚨

**Your Situation**:
I see you have `merchantapp-key.keystore` at the root. We'll upload this to EAS.

#### Step 4.1: Get Keystore Information

First, we need the keystore password, key alias, and key password. Run:

```bash
keytool -list -v -keystore merchantapp-key.keystore
```

**You'll be prompted for**:
- Keystore password

**Output will show**:
- Alias name: `YOUR_KEY_ALIAS` (note this down)
- Certificate fingerprints (SHA256, SHA1)

If you don't know the passwords, contact whoever created the keystore.

#### Step 4.2: Upload Keystore to EAS

Run:
```bash
eas credentials
```

**Navigation Path**:
1. Select: **Android**
2. Select: **com.kashier.merchantapp**
3. Select: **Keystore: Set up a new keystore** or **Keystore: Upload an existing keystore**
4. Choose: **Upload an existing keystore**
5. **Provide**:
   - Keystore path: `./merchantapp-key.keystore`
   - Keystore password: `[your password]`
   - Key alias: `[from Step 4.1]`
   - Key password: `[your password]`

**What happens**: EAS securely stores your keystore in their vault.

#### Step 4.3: Store Keystore Credentials as Environment Variables (Optional)

If you need these in CI/CD later:
```bash
eas env:create --name KEYSTORE_PASSWORD --value "your-password" --type string --visibility secret --scope project
eas env:create --name KEYSTORE_KEY_ALIAS --value "your-alias" --type string --visibility secret --scope project
eas env:create --name KEYSTORE_KEY_PASSWORD --value "your-key-password" --type string --visibility secret --scope project
```

#### Step 4.4: Set Up Google Play Console

**Create App Listing**:
1. **Go to**: https://play.google.com/console
2. **Create App** → Enter details (Kashier, package: `com.kashier.merchantapp`)
3. **Set up Internal Testing**:
   - Testing → Internal testing → Create new release
   - Add testers: Email addresses or Google Groups
   - Save

**Create Service Account for EAS**:
1. **Go to**: Settings → API access
2. **Create Service Account** → Follow link to Google Cloud Console
3. **Create Service Account**:
   - Name: `EAS Builder`
   - Grant Role: **Service Account User**
4. **Create Key** → Download JSON
5. **Back in Play Console** → Grant permissions:
   - ✅ Release Manager
   - ✅ Create & publish apps
6. **Save JSON as**: `google-play-service-account.json` (in project root)

**Update `.gitignore`** to exclude this file (should already be there).

#### Step 4.5: Get SHA-256 Certificate Fingerprint

For Android App Links (deep linking), you need the SHA-256 fingerprint:

```bash
keytool -list -v -keystore merchantapp-key.keystore | grep SHA256
```

Copy the SHA-256 value (format: `AB:CD:EF:12:34:...`).

**Update your `assetlinks.json` file** (the one hosted at `portal.kashier.io`) with this fingerprint.

---

### PHASE 5: Configure Push Notifications (20 minutes)

Your Firebase setup is already done! We just need to configure FCM for EAS.

#### Step 5.1: Get FCM Server Key

1. **Go to**: https://console.firebase.google.com
2. **Select Project**: `payformance-bbecc` (from your `google-services.json`)
3. **Go to**: Project Settings → Cloud Messaging
4. **Find**: "Server key" under "Cloud Messaging API (Legacy)"
5. **Copy the server key** (starts with `AAAA...`)

**If Cloud Messaging API is not enabled**:
- Enable it in Google Cloud Console
- Wait 5-10 minutes for propagation

#### Step 5.2: Add FCM Key to EAS

Run:
```bash
eas credentials
```

**Navigation Path**:
1. Select: **Android**
2. Select: **com.kashier.merchantapp**
3. Select: **FCM API Key (V1)**
4. **Paste**: Server Key from Step 5.1

#### Step 5.3: Verify Push Notification Configuration

Check your `app.json` (should already be configured):
```json
"plugins": [
  [
    "expo-notifications",
    {
      "icon": "./src/shared/assets/images/app-icon.png",
      "color": "#ffffff"
    }
  ]
]
```

✅ Already configured! No changes needed.

**iOS Push Notifications**: Automatically configured when you set up iOS credentials in Phase 3.

---

### PHASE 6: Enable Backend Integration (15 minutes)

Your notification service has backend integration commented out. Let's enable it.

#### What This Does
- Registers push tokens with your backend (so backend can send notifications)
- Confirms notification delivery (so backend knows notification was received)

#### Step 6.1: Update `src/modules/notifications/notification.service.ts`

**Find line 110-119** (the `sendTokenToBackend` function) and **replace** with:

```typescript
const sendTokenToBackend = async (token: string, api: AxiosInstance): Promise<void> => {
    try {
        const { deviceId, huawei } = await getDeviceInfo();
        await api.post('/v2/identity/fcm-token', {
            fcmToken: token,
            deviceId,
            huawei,
        });
        console.log('✅ Token registered with backend:', token);
    } catch (error) {
        console.error('❌ Failed to register token with backend:', error);
        throw error;
    }
};
```

**Find line 124** (the `registerForPushNotificationsAsync` function signature) and **update**:

```typescript
export const registerForPushNotificationsAsync = async (
    api: AxiosInstance
): Promise<string | null> => {
    const token = await getPushTokenCore();

    if (token) {
        await sendTokenToBackend(token, api);  // ✅ UNCOMMENTED!
    }

    return token;
};
```

#### Step 6.2: Update `src/core/providers/NotificationProvider.tsx`

**Find line 26** and update to pass `api` parameter:
```typescript
const setupNotifications = async () => {
    await registerForPushNotificationsAsync(api);  // ✅ Pass api
    await configureAndroidNotificationChannel();
};
```

**Find lines 46-53** (foreground delivery confirmation) and **uncomment**:
```typescript
if (notificationId && !confirmedNotifications.current.has(notificationId)) {
    const { deviceId } = await getDeviceInfo();
    await confirmNotificationDelivery(api, notificationId, {
        deliveredAt: new Date().toISOString(),
        deviceId,
        platform: Platform.OS as 'ios' | 'android',
    });
    confirmedNotifications.current.add(notificationId);
    console.log('✅ Delivery confirmed for notification:', notificationId);
}
```

**Find lines 77-83** (background delivery confirmation) and **uncomment**:
```typescript
if (notificationId && !confirmedNotifications.current.has(notificationId)) {
    await confirmNotificationDelivery(api, notificationId, {
        deliveredAt: notification.date.toString(),
        deviceId,
        platform: Platform.OS as 'ios' | 'android',
    });
    confirmedNotifications.current.add(notificationId);
    console.log('✅ Delivery confirmed for background notification:', notificationId);
}
```

---

### PHASE 7: Set Up CI/CD with GitHub Actions (30 minutes)

Automate builds when you push code to GitHub.

#### Step 7.1: Create GitHub Workflows Directory

```bash
mkdir -p .github/workflows
```

#### Step 7.2: Create Build Workflow

**Create file**: `.github/workflows/eas-build.yml`

```yaml
name: EAS Build

on:
  push:
    branches: [main, payments]
  workflow_dispatch:
    inputs:
      profile:
        description: 'Build profile'
        required: true
        default: 'preview'
        type: choice
        options: [preview, production]
      platform:
        description: 'Platform'
        required: true
        default: 'all'
        type: choice
        options: [ios, android, all]

jobs:
  build:
    name: Build on EAS
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Run linter
        run: npm run lint

      - name: Trigger EAS Build
        run: |
          PROFILE="${{ github.event.inputs.profile || 'preview' }}"
          PLATFORM="${{ github.event.inputs.platform || 'all' }}"
          eas build --profile $PROFILE --platform $PLATFORM --non-interactive --no-wait
```

#### Step 7.3: Create PR Checks Workflow

**Create file**: `.github/workflows/pr-checks.yml`

```yaml
name: PR Checks

on:
  pull_request:
    branches: [main, payments]

jobs:
  lint:
    name: Lint and Type Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit
```

#### Step 7.4: Generate Expo Access Token

```bash
eas account:token:create
```

**Copy the token** (it will only be shown once!).

#### Step 7.5: Add GitHub Secrets

1. **Go to**: Your GitHub repository → Settings → Secrets and variables → Actions
2. **Add New Secret**:
   - Name: `EXPO_TOKEN`
   - Value: [token from Step 7.4]

**That's it!** Now:
- Push to `main` or `payments` → Triggers automatic build
- Create PR → Runs linting and type checking
- Manual dispatch → Build on demand with custom profile/platform

---

### PHASE 8: Test Your First Build! (60 minutes)

Now let's build and test!

#### Step 8.1: Verify Local Setup

Before building on EAS, test locally:

```bash
# Test development build
npm start
```

**Verify**:
- ✅ App loads without errors
- ✅ Deep linking works (test with a deep link)
- ✅ Push notification permission prompt shows on first launch
- ✅ Environment switcher works

#### Step 8.2: Trigger Your First EAS Build

**For iOS Preview Build**:
```bash
npm run build:preview:ios
```

**For Android Preview Build**:
```bash
npm run build:preview:android
```

**For Both Platforms**:
```bash
npm run build:preview:all
```

#### What Happens During Build

1. **Upload**: EAS uploads your code
2. **Install Dependencies**: Runs `npm install`
3. **Prebuild**: Generates native `android/` and `ios/` folders from `app.json`
4. **Build**: Compiles native code
5. **Sign**: Signs with your credentials
6. **Upload Artifact**: Makes build available for download

**Build time**: 15-30 minutes per platform

#### Step 8.3: Monitor Build Progress

```bash
# List all builds
eas build:list

# Watch specific build
eas build:view [build-id]
```

Or visit: https://expo.dev → Select your project → Builds

#### Step 8.4: Download and Install Build

**When build completes**, you'll get a link. Two options:

**Option A: Install Directly (Quick Test)**
- iOS: Download `.ipa` → Install via Xcode or TestFlight
- Android: Download `.apk` → Install directly on device

**Option B: Submit to Stores (QA Distribution)**
```bash
# Submit iOS to TestFlight
npm run submit:preview:ios

# Submit Android to Internal Testing
npm run submit:preview:android
```

#### Step 8.5: Test on Real Device

**Test Checklist**:
- [ ] App launches without crashes
- [ ] Push notification permission requested
- [ ] Push token registered (check backend logs)
- [ ] Receive test push notification
- [ ] Tap notification → Correct screen opens
- [ ] Delivery confirmation sent (check backend logs)
- [ ] Deep link from email/SMS works
- [ ] Universal link (https://portal.kashier.io/...) opens app
- [ ] Environment switcher works (staging/production, test/live)

---

## 🧪 Testing Push Notifications End-to-End

### Test Scenario 1: Token Registration

1. Fresh install app from TestFlight/Internal Testing
2. Launch app → Allow notifications
3. **Check backend logs**: Should see POST to `/v2/identity/fcm-token` with token
4. **Expected**: Token successfully stored

### Test Scenario 2: Receive Notification

1. Send test notification from backend to device token
2. **Foreground (app open)**: Notification banner shows, delivery confirmed
3. **Background (app closed)**: Notification shows in tray
4. **Check backend logs**: Should see delivery confirmation

### Test Scenario 3: Tap Notification

1. Send notification with navigation data (e.g., transaction ID)
2. Tap notification
3. **Expected**: App opens to correct screen (transaction details)

---

## 🧪 Testing Deep Linking End-to-End

### Test Scenario 1: Custom Scheme

**Deep Link**:
```
kashier://deep-link-handler?accessToken=[encrypted]&currentMerchantPayformanceId=[encrypted]
```

**Steps**:
1. Send link via email/SMS
2. Tap link on device
3. **Expected**: App launches, auto-login successful

### Test Scenario 2: Universal Links (iOS)

**Deep Link**:
```
https://portal.kashier.io/en/login?accessToken=[encrypted]&currentMerchantPayformanceId=[encrypted]
```

**Steps**:
1. Open link in Safari
2. **Expected**: App opens (not browser), auto-login successful

### Test Scenario 3: App Links (Android)

**Deep Link**:
```
https://portal.kashier.io/ar/login?accessToken=[encrypted]&currentMerchantPayformanceId=[encrypted]
```

**Steps**:
1. Open link in Chrome
2. **Expected**: App opens (not browser), auto-login successful

---

## 🔧 Troubleshooting

### Build Failed

**Check build logs**:
```bash
eas build:view [build-id]
```

**Common Issues**:
- ❌ **Missing credentials**: Run `eas credentials` to set up
- ❌ **Invalid keystore**: Re-upload keystore with correct passwords
- ❌ **Dependency errors**: Check `package.json` for conflicting versions
- ❌ **Native module errors**: Check plugin configuration in `app.json`

### Push Notifications Not Working

**iOS**:
- ✅ Verify APNs key is configured: `eas credentials --platform ios`
- ✅ Check bundle ID matches in Firebase
- ✅ Test with production APNs environment

**Android**:
- ✅ Verify FCM Server Key: `eas credentials --platform android`
- ✅ Check package name in `google-services.json` matches `app.json`
- ✅ Ensure Cloud Messaging API is enabled in Firebase

### Universal/App Links Not Working

**iOS**:
- ✅ Verify `apple-app-site-association` is accessible:
  ```bash
  curl https://portal.kashier.io/.well-known/apple-app-site-association
  ```
- ✅ Check file is valid JSON (no HTML wrapper)
- ✅ Reinstall app (iOS caches association files)

**Android**:
- ✅ Verify `assetlinks.json` is accessible:
  ```bash
  curl https://portal.kashier.io/.well-known/assetlinks.json
  ```
- ✅ Check SHA-256 fingerprint matches your keystore
- ✅ Get fingerprint: `keytool -list -v -keystore merchantapp-key.keystore | grep SHA256`

### Encryption Keys Not Loading

```bash
# Verify environment variables are stored in EAS
eas env:list --scope project

# Rebuild with cache cleared
eas build --profile preview --platform all --clear-cache
```

---

## 📚 Useful Commands Reference

### EAS Commands
```bash
# Login to EAS
eas login

# View project status
eas whoami
eas project:info

# Build commands
eas build --profile preview --platform ios
eas build --profile preview --platform android
eas build --profile preview --platform all

# Submit commands
eas submit --profile preview --platform ios --latest
eas submit --profile preview --platform android --latest

# View builds
eas build:list
eas build:view [build-id]

# Manage credentials
eas credentials
eas credentials --platform ios
eas credentials --platform android

# Manage environment variables (secrets)
eas env:list --scope project
eas env:create --name KEY_NAME --value "value" --type string --visibility secret --scope project
eas env:update --name KEY_NAME --value "new-value"
eas env:delete --name KEY_NAME
eas env:pull --environment development  # Pull to local .env file

# Device management
eas device:list
eas device:create
```

### Development Commands
```bash
# Start development server
npm start

# Build scripts (already in package.json)
npm run build:preview:ios
npm run build:preview:android
npm run build:preview:all

# Submit scripts
npm run submit:preview:ios
npm run submit:preview:android

# Lint and type check
npm run lint
npx tsc --noEmit
```

---

## 📖 Next Steps

### After First Successful Build

1. **Distribute to QA Team**:
   - iOS: Share TestFlight link
   - Android: Share Google Play Internal Testing link

2. **Collect Feedback**:
   - Test all features thoroughly
   - Document any issues
   - Iterate and rebuild

3. **Prepare for Production**:
   - Update `eas.json` submit section with real Apple ID, Team ID
   - Test production builds
   - Complete App Store/Play Store listings (screenshots, descriptions)
   - Submit for review

### Ongoing Maintenance

- **Update Dependencies**: Regularly update Expo SDK and dependencies
- **Monitor Builds**: Check EAS dashboard for build success/failure
- **Rotate Secrets**: Periodically rotate encryption keys and tokens
- **Backup Keystore**: Keep secure backups of `merchantapp-key.keystore`

---

## 🎓 Learning Resources

### Official Expo Documentation
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit (iOS)**: https://docs.expo.dev/submit/ios/
- **EAS Submit (Android)**: https://docs.expo.dev/submit/android/
- **Environment Variables**: https://docs.expo.dev/eas/environment-variables/
- **Managed Credentials**: https://docs.expo.dev/app-signing/managed-credentials/
- **Internal Distribution**: https://docs.expo.dev/build/internal-distribution/
- **Push Notifications**: https://docs.expo.dev/push-notifications/overview/
- **Deep Linking**: https://docs.expo.dev/guides/deep-linking/

### Additional Resources
- **eas.json Configuration**: https://docs.expo.dev/build/eas-json/
- **EAS CLI on GitHub**: https://github.com/expo/eas-cli
- **Medium Guide**: [eas.json Demystified](https://medium.com/@ikrammohdabdul/eas-json-demystified-the-only-guide-you-need-for-eas-build-submit-8b909e96348b)

---

## ✅ Final Checklist

Before going to production, verify:

- [ ] All sensitive data stored in environment variables (not hardcoded)
- [ ] iOS and Android builds complete successfully
- [ ] Push notifications work on both platforms
- [ ] Deep linking (custom scheme + universal/app links) works
- [ ] QA team can install and test builds
- [ ] CI/CD pipeline works (GitHub Actions triggers builds)
- [ ] App Store Connect and Google Play Console listings complete
- [ ] Keystore backed up securely (off-repo)
- [ ] All credentials stored in EAS
- [ ] Documentation updated for your team

---

**Good luck with your EAS setup! 🚀**

If you get stuck, refer to the troubleshooting section or reach out for help.
