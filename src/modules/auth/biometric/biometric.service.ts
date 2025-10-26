import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricResult } from './biometric.model';
import { I18nManager } from 'react-native';

export const checkDeviceBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
}


export const biometricAuthenticate = async (): Promise<BiometricResult> => {
    // console.log('Biometric authenticate called : ',I18nManager.isRTL);
    try {
        const promptMessage = I18nManager.isRTL ? 'تسجيل الدخول باستخدام التحقق من الهوية الرقمية' : 'Login with biometrics';
        const cancelLabel = I18nManager.isRTL ? 'إلغاء' : 'Cancel';
        const fallbackLabel = I18nManager.isRTL ? 'استخدام كلمة المرور' : 'Use password';
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage,
            cancelLabel,
            fallbackLabel
        });
        const error = result.success ? undefined : result.error || I18nManager.isRTL ? 'فشل التحقق من الهوية الرقمية أو تم إلغاء العملية' : 'Authentication failed or cancelled by user.';
        return {
            success: result.success,
            error
        };
    } catch (error: any) {
        console.error('Biometric authentication error:', error);
        const errorMsg = I18nManager.isRTL ? 'حدث خطأ غير متوقع أثناء التحقق من الهوية الرقمية' : 'An unexpected error occurred during biometric authentication.';
        return {
            success: false,
            error: error?.message || errorMsg
        };
    }
};
