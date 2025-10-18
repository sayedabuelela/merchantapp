import { ROUTES } from '@/src/core/navigation/routes';
import { LoginFormData } from "@/src/modules/auth/login/login.model";
import { KashierLogo } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBiometricViewModel } from "../biometric/biometric.viewmodel";
import { LoginForm } from './components/LoginForm';
import { useLoginViewModel } from './login.viewmodel';

const LoginScreen = () => {
    const { t } = useTranslation();
    const { login, isLoading, error } = useLoginViewModel();
    const { isBiometricAvailable, isInitialized } = useBiometricViewModel();
    const router = useRouter();


    const handleSubmit = async ({ email, password }: LoginFormData) => {
        try {
            // console.log("handleSubmit");
            // console.log("isBiometricAvailable", isBiometricAvailable);
            await login({ email, password });
            // console.log("isInitialized", isInitialized);
            // console.log("isBiometricAvailable && !isInitialized : ", isBiometricAvailable && !isInitialized);
            if (isBiometricAvailable && !isInitialized) {
                router.replace(ROUTES.AUTH.ENABLE_BIOMETRIC);
            } else {
                // router.replace(ROUTES.TABS.ROOT);
                router.replace(ROUTES.TABS.SETTINGS);
                // router.replace(ROUTES.ONBOARDING.ACCOUNT_TYPE);
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
                    <KashierLogo
                    // style={{ marginBottom: 28 }}
                    />
                    <LoginForm
                        onSubmit={handleSubmit}
                        loading={isLoading}
                        error={error?.error || error?.message}
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