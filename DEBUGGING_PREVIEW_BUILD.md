# Debugging Preview Build Deep Link Issues

## Problem: Authentication works in browser but fails in app

This typically means the **encryption keys** are missing or incorrect in the preview build.

## Root Cause

The app needs `ENCRYPTION_KEY` and `ENCRYPTION_IV` to decrypt the tokens from the deep link:
- In the **browser/web version**, these might be hardcoded or come from a different source
- In the **mobile app**, they come from EAS environment variables

## How to View Logs from Preview Build

### Option 1: React Native Debugger (with ADB - Android)

```bash
# Connect your device via USB and enable USB debugging

# View all logs
adb logcat | grep -E "ReactNativeJS|DeepLink|Crypto"

# Or for cleaner output, just React Native logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# Look for these specific log messages:
# [DeepLink] Starting authentication with params
# [DeepLink] Attempting to decrypt accessToken
# [Crypto] Missing encryption config
# [DeepLink] Decryption failed
```

### Option 2: Use Flipper (if available)

If your preview build has Flipper enabled:
1. Install Flipper Desktop: https://fbflipper.com/
2. Connect your device
3. Open Flipper → Select your app
4. Go to "Logs" section
5. Filter by "DeepLink" or "Crypto"

### Option 3: Remote Logging Service

For production debugging, consider adding a service like:
- Sentry
- LogRocket
- Bugsnag

## How to Check Environment Variables in EAS

```bash
# List all environment variables (will prompt for environment selection)
eas secret:list

# The preview build should have:
# - ENCRYPTION_KEY
# - ENCRYPTION_IV
```

To verify they're actually being used in the build, check your `eas.json`:

```json
{
  "build": {
    "preview": {
      "env": {
        "ENCRYPTION_KEY": "$ENCRYPTION_KEY",
        "ENCRYPTION_IV": "$ENCRYPTION_IV"
      }
    }
  }
}
```

## How to Fix Missing Encryption Keys

### Step 1: Get the encryption keys from your backend team

Ask for the production values of:
- `ENCRYPTION_KEY` (hex string)
- `ENCRYPTION_IV` (hex string)

### Step 2: Add them to EAS secrets

```bash
# Add ENCRYPTION_KEY
eas secret:create --name ENCRYPTION_KEY --value "your_hex_key_here" --type string

# Add ENCRYPTION_IV
eas secret:create --name ENCRYPTION_IV --value "your_hex_iv_here" --type string

# Verify they're added
eas secret:list
```

### Step 3: Rebuild

```bash
eas build -p android --profile preview
```

## Testing with Development Build (Recommended for Debugging)

Development builds give you **full debugging capabilities** including:
- Console logs visible in terminal
- React DevTools
- Hot reload
- Better error messages

### Create Development Build

```bash
# First, create a development build (one-time setup)
eas build -p android --profile development

# Or for iOS
eas build -p ios --profile development

# Install the development build on your device
```

### Run Development Build with Logs

Once the development build is installed:

```bash
# For Android
bun expo run:android

# For iOS
bun expo run:ios

# This will:
# 1. Start Metro bundler
# 2. Show ALL console.log outputs in your terminal
# 3. Give you hot reload
# 4. Let you test deep links while seeing real-time logs
```

### Test Deep Link with Development Build

With the development build running and Metro showing logs:

1. Click the deep link on your device
2. Watch your terminal for log messages:
   ```
   [DeepLink] Starting authentication with params
   [Crypto] Missing encryption config: { hasKey: false, hasIV: false }
   [DeepLink] Decryption failed
   ```

3. This will immediately show you if encryption keys are missing!

### Set Environment Variables for Development Build

For local development testing, create a `.env` file (but DON'T commit it):

```bash
# .env (add to .gitignore!)
ENCRYPTION_KEY=your_hex_key_here
ENCRYPTION_IV=your_hex_iv_here
```

Then install `dotenv`:

```bash
bun add -D dotenv
```

Update `app.config.ts`:

```typescript
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  // ...
  extra: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    encryptionIV: process.env.ENCRYPTION_IV,
  },
});
```

**Note:** The preview and production builds will still use EAS secrets, but local development will use the `.env` file.

## Comparison: Preview Build vs Development Build

| Feature | Preview Build | Development Build |
|---------|--------------|-------------------|
| Console logs | ❌ No (need ADB) | ✅ Yes (in terminal) |
| Hot reload | ❌ No | ✅ Yes |
| Build time | 🐌 Slow (5-15 min) | 🐌 Slow first time, ⚡ fast after |
| Distribution | ✅ Easy (APK/IPA) | ⚠️ Need to install once |
| Testing deep links | ✅ Production-like | ✅ Full debugging |
| Environment vars | EAS secrets only | .env or EAS secrets |
| Best for | Final testing before release | Active development & debugging |

## Recommended Workflow

1. **For debugging deep link issues:** Use **development build**
   ```bash
   eas build -p android --profile development  # One time
   bun expo run:android  # Every time you test
   ```

2. **For testing production-like experience:** Use **preview build**
   ```bash
   eas build -p android --profile preview
   # View logs via ADB
   ```

## Quick Debugging Checklist

- [ ] Verify encryption keys are set in EAS: `eas secret:list`
- [ ] Check if keys are in `eas.json` preview profile config
- [ ] Look at logs via ADB: `adb logcat | grep DeepLink`
- [ ] Look for "[Crypto] Missing encryption config" error
- [ ] If keys are missing, add them and rebuild
- [ ] For faster iteration, use development build: `bun expo run:android`
- [ ] Test the exact same deep link URL in both browser and app
- [ ] Check if the link parameters are being received correctly

## Next Steps

1. **Add encryption keys to EAS** (if missing)
2. **Create a development build** for easier debugging
3. **Run with** `bun expo run:android` to see real-time logs
4. **Click the deep link** and watch terminal for errors
5. **Share the logs** if you need help debugging further
