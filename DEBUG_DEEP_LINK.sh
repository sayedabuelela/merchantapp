#!/bin/bash

echo "========================================="
echo "Deep Link Debugging Helper"
echo "========================================="
echo ""
echo "Choose an option:"
echo ""
echo "1) View logs from preview build (current APK installed)"
echo "2) Test deep link with ADB (manual trigger)"
echo "3) Check if encryption keys are set in EAS"
echo "4) Setup for development build debugging"
echo ""
read -p "Enter option (1-4): " choice

case $choice in
  1)
    echo ""
    echo "Starting log viewer..."
    echo "Click your deep link now and watch for errors"
    echo "Press Ctrl+C to stop"
    echo ""
    adb logcat -c
    adb logcat | grep -E "ReactNativeJS|DeepLink|Crypto|Error"
    ;;
  2)
    echo ""
    read -p "Paste the full deep link URL: " url
    echo ""
    echo "Triggering deep link..."
    adb shell am start -W -a android.intent.action.VIEW -d "$url"
    echo ""
    echo "Now viewing logs..."
    adb logcat | grep -E "ReactNativeJS|DeepLink|Crypto"
    ;;
  3)
    echo ""
    echo "Checking EAS secrets..."
    eas secret:list
    ;;
  4)
    echo ""
    echo "Development Build Setup Instructions:"
    echo ""
    echo "1. Get encryption keys from backend team"
    echo "2. Create .env file:"
    echo "   cp .env.example .env"
    echo ""
    echo "3. Edit .env and add real values"
    echo ""
    echo "4. Install dotenv:"
    echo "   bun add -D dotenv"
    echo ""
    echo "5. Build development version (one-time):"
    echo "   eas build -p android --profile development"
    echo ""
    echo "6. Install the APK on your device"
    echo ""
    echo "7. Run with logs:"
    echo "   bun expo run:android"
    echo ""
    echo "8. Click deep link and see logs in terminal"
    ;;
  *)
    echo "Invalid option"
    ;;
esac
