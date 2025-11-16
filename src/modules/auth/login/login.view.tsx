import { ROUTES } from '@/src/core/navigation/routes';
import { LoginFormData } from "@/src/modules/auth/login/login.model";
import { KashierLogo } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBiometricViewModel } from "../biometric/biometric.viewmodel";
import { LoginForm } from './components/LoginForm';
import { useLoginViewModel } from './login.viewmodel';
import { DeveloperSettings } from '../../settings/components/DeveloperSettings';
import { useNetworkStatus } from '@/src/core/hooks/useNetworkStatus';

const LoginScreen = () => {
    const { t } = useTranslation();
    const { login, isLoading, error } = useLoginViewModel();
    const { isBiometricAvailable, isInitialized } = useBiometricViewModel();
    const { hasNetwork } = useNetworkStatus();
    const router = useRouter();
    const [networkError, setNetworkError] = useState<string | null>(null);


    const handleSubmit = async ({ email, password }: LoginFormData) => {
        try {
            setNetworkError(null);

            // Check network connectivity before login
            if (!hasNetwork) {
                setNetworkError(t('No internet connection. Please check your network and try again.'));
                return;
            }

            await login({ email, password });
            if (isBiometricAvailable && !isInitialized) {
                router.replace(ROUTES.AUTH.ENABLE_BIOMETRIC);
            } else {
                router.replace(ROUTES.TABS.HOME);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white pt-36">

            <KeyboardAwareScrollView
                bottomOffset={40}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View className="items-center px-6">
                    <DeveloperSettings/>
                    <KashierLogo
                    // style={{ marginBottom: 28 }}
                    />
                    <LoginForm
                        onSubmit={handleSubmit}
                        loading={isLoading}
                        error={networkError || error?.error || error?.message}
                    />
                    <View className="flex-row justify-center mt-8">
                        <FontText
                            className={'text-content-secondary text-sm'}
                        >
                            {t("Don't have an account?") + " "}
                        </FontText>
                        <Link href={ROUTES.AUTH.REGISTER_EMAIL}>
                            <FontText
                                weight='bold'
                                className={'text-secondary text-sm'}
                            >
                                {t('Create Account')}
                            </FontText>
                        </Link>
                    </View>
                </View>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

export default LoginScreen;