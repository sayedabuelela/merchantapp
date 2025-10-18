import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricResult } from './biometric.model';


export const checkDeviceBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
}


export const biometricAuthenticate = async (): Promise<BiometricResult> => {
    try {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login with biometrics',
            disableDeviceFallback: true,
            cancelLabel: 'Cancel'
            // fallbackLabel: 'Use password'
        });

        return {
            success: result.success,
            error: result.success ? undefined : result.error || 'Authentication failed or cancelled by user.'
        };
    } catch (error: any) {
        console.error('Biometric authentication error:', error);
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred during biometric authentication.'
        };
    }
};
