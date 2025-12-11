# Migrating Existing App to EAS Build

This guide helps you migrate your existing `com.kashier.merchantapp` from the stores to EAS Build.

## ✅ What's Already Done

- ✓ Code configured for environment variables
- ✓ `eas.json` configured with correct build profiles
- ✓ Backend integration enabled for push notifications
- ✓ CI/CD workflows created

---

## 🔑 Critical: Using Existing Credentials

**IMPORTANT**: Since your app already exists on both stores with `com.kashier.merchantapp`, you MUST use:
- ✅ **Same iOS Distribution Certificate** and **Provisioning Profile**
- ✅ **Same Android Keystore** (`merchantapp-key.keystore`)

Using different credentials will create a **completely new app** that cannot update the existing one!

---

## 📋 Step-by-Step Migration

### Step 1: Store Environment Variables in EAS (5 minutes)

EAS CLI requires interactive input for environment selection:

```bash
# Run this command and select "production" when prompted
bunx eas-cli env:create --name ENCRYPTION_KEY --value "e2070c4b4d582330d36b000de1a6d8c2"

# When prompted:
# ? Select environment: production (select this)
# ? Visibility: secret
```

Repeat for `ENCRYPTION_IV`:

```bash
bunx eas-cli env:create --name ENCRYPTION_IV --value "4cedf7bd8763484f9557257b98f1f1c5"
```

Verify:
```bash
bunx eas-cli env:list
```

---

### Step 2: Upload Existing iOS Credentials to EAS (20 minutes)

**Option A: Let EAS Access Apple Developer (Recommended)**

```bash
bunx eas-cli credentials
```

1. Select: **iOS**
2. Select: **com.kashier.merchantapp**
3. Select: **Distribution Certificate**
4. Choose: **Download existing certificate from Apple Developer**
5. Sign in with your Apple ID (same one that created the existing app)
6. EAS will automatically find and use your existing certificate

Repeat for:
- **Push Notification Key**
- **Provisioning Profile**

**Option B: Upload Existing Files Manually**

If you have the `.p12` certificate and `.mobileprovision` files:

```bash
bunx eas-cli credentials
```

1. Select: **iOS** → **com.kashier.merchantapp**
2. Select: **Distribution Certificate** → **Upload existing certificate**
3. Provide path to your `.p12` file and password
4. Repeat for Provisioning Profile

---

### Step 3: Upload Existing Android Keystore to EAS (10 minutes)

```bash
bunx eas-cli credentials
```

1. Select: **Android**
2. Select: **com.kashier.merchantapp**
3. Select: **Keystore: Upload an existing keystore**
4. Provide:
   - **Keystore path**: `./merchantapp-key.keystore`
   - **Keystore password**: [your password]
   - **Key alias**: [run command below to find it]
   - **Key password**: [your password]

**To find your key alias:**
```bash
keytool -list -v -keystore merchantapp-key.keystore
```

Look for `Alias name:` in the output.

---

### Step 4: Configure FCM for Push Notifications (10 minutes)

**Get FCM Server Key:**
1. Go to: https://console.firebase.google.com
2. Select project: `payformance-bbecc`
3. Go to: **Project Settings** → **Cloud Messaging**
4. Copy: **Server key** (under "Cloud Messaging API (Legacy)")

**Add to EAS:**
```bash
bunx eas-cli credentials
```

1. Select: **Android** → **com.kashier.merchantapp**
2. Select: **FCM Server Key**
3. Paste your FCM server key

---

### Step 5: Update Submit Configuration (5 minutes)

Edit `eas.json` and update the submit section with your actual values:

**For iOS:**
1. Go to: https://appstoreconnect.apple.com
2. Find your app: "Kashier"
3. Get:
   - **Apple ID**: Your email (e.g., `developer@kashier.io`)
   - **App Store Connect App ID**: Numeric ID in app settings
   - **Apple Team ID**: From https://developer.apple.com/account → Membership

**For Android:**
1. Go to: https://play.google.com/console → Settings → API access
2. Create service account (if you don't have one)
3. Download JSON key
4. Save as: `./google-play-service-account.json`

Update `eas.json` lines 50-66:
```json
"ios": {
  "appleId": "your-actual-email@kashier.io",
  "ascAppId": "1234567890",
  "appleTeamId": "ABCDE12345"
}
```

---

### Step 6: Set Up GitHub Actions (5 minutes)

**Generate Expo token:**
```bash
bunx eas-cli account:token:create
```

Copy the token (shown only once!).

**Add to GitHub:**
1. Go to: Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click: **New repository secret**
3. Name: `EXPO_TOKEN`
4. Value: [paste your token]

---

### Step 7: Test Build (30 minutes)

**Test locally first:**
```bash
npm start
```

Verify:
- ✅ App loads
- ✅ No environment variable errors
- ✅ Deep linking works

**Run your first EAS build (preview):**
```bash
# Build for internal testing
npm run build:preview:android
```

This will:
1. Upload code to EAS
2. Use your existing keystore
3. Build APK for internal testing
4. Take ~15-20 minutes

**Monitor progress:**
```bash
bunx eas-cli build:list
```

Or visit: https://expo.dev → Your project → Builds

---

### Step 8: Submit to Store (When Ready)

**For production builds:**
```bash
# Build for stores
npm run build:production:ios
npm run build:production:android
```

**Submit to stores:**
```bash
# iOS to App Store
eas submit --platform ios --latest

# Android to Play Store
eas submit --platform android --latest
```

---

## 🔍 Verification Checklist

Before submitting to production:

- [ ] Environment variables stored in EAS (`eas env:list`)
- [ ] iOS credentials uploaded (same ones as existing app)
- [ ] Android keystore uploaded (`merchantapp-key.keystore`)
- [ ] FCM server key configured
- [ ] `eas.json` submit section updated with real values
- [ ] `google-play-service-account.json` downloaded
- [ ] GitHub Actions `EXPO_TOKEN` configured
- [ ] Preview build succeeds
- [ ] App installs and works on test device
- [ ] Push notifications work
- [ ] Deep linking works

---

## ⚠️ Important Notes

### About Existing App
- ✅ Using your existing keystore ensures updates go to the same app
- ✅ Bundle ID/Package name matches: `com.kashier.merchantapp`
- ✅ Version numbers will auto-increment (configured in `eas.json`)

### About Environment Variables
- They're stored securely in EAS (never in git)
- They're injected during build time
- Local development uses `.env` file

### About Builds
- **Preview builds** = Internal testing (TestFlight/Play Internal)
- **Production builds** = Store submission (App Store/Play Store)
- First build takes ~15-30 minutes per platform
- Subsequent builds are faster (cached dependencies)

---

## 🆘 Troubleshooting

### "env:create failed - Input is required"
Run the command and **select environment interactively**:
```bash
bunx eas-cli env:create --name ENCRYPTION_KEY --value "your-value"
# When prompted, select: production
```

### "Certificate doesn't match bundle identifier"
You're using the wrong certificate. Download the existing one from Apple Developer using EAS.

### "Build failed: Invalid keystore"
Double-check keystore password and key alias with:
```bash
keytool -list -v -keystore merchantapp-key.keystore
```

### "Push notifications not working"
1. Verify FCM key in EAS: `bunx eas-cli credentials`
2. Check Firebase project matches `google-services.json`
3. Ensure Cloud Messaging API is enabled

---

## 📚 Next Steps

Once your first build succeeds:
1. Test thoroughly on real devices
2. Submit to internal testing tracks
3. Gather QA feedback
4. Submit to production when ready

Need help? Refer to:
- Full setup guide: `EAS_SETUP_PLAN.md`
- EAS docs: https://docs.expo.dev/build/introduction/
