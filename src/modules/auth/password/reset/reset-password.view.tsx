import { ROUTES } from "@/src/core/navigation/routes";
import { PasswordFormData } from '@/src/modules/auth/auth.model';
import PasswordForm from '@/src/modules/auth/components/PasswordForm';
import { KashierLogo } from "@/src/shared/assets/svgs";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResetPassword } from './reset.viewmodel';

const ResetCreatePasswordScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { code } = useLocalSearchParams<{ code: string }>();
    const { resetPassword, isResetting, resetError } = useResetPassword();

    const onSubmit = async ({ password }: PasswordFormData) => {
        await resetPassword({ code, password });
        router.replace(ROUTES.AUTH.LOGIN);
    };


    return (
        <SafeAreaView className="flex-1 bg-white pt-36">

            <ScrollView
                className="flex-1 px-6 pb-16"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <KashierLogo
                    style={{
                        marginBottom: 30,
                        alignSelf: 'center'
                    }}
                />

                {resetError && (
                    <AnimatedError errorMsg={t(resetError.error || resetError.message || "Something went wrong")} />
                )}

                <PasswordForm onSubmit={onSubmit} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default ResetCreatePasswordScreen;