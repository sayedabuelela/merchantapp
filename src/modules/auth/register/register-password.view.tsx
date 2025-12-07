import {KashierLogo} from "@/src/shared/assets/svgs";
import {useLocalSearchParams, useRouter} from 'expo-router';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PasswordForm from '@/src/modules/auth/components/PasswordForm';
import { PasswordFormData } from '@/src/modules/auth/auth.model';
import { FadeInDownView, FadeInUpView } from '@/src/shared/components/wrappers/animated-wrappers';

const RegisterPasswordScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { email, code } = useLocalSearchParams<{ email: string, code: string }>();

    const onSubmit = async ({ password }: PasswordFormData) => {
        router.push({
            pathname: `/(auth)/(register)/register-data`,
            params: { email, password, code },
        })
    };


    return (
        <SafeAreaView className="flex-1 bg-white pt-36">

            <ScrollView
                className="flex-1 px-6 pb-16"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <FadeInDownView delay={0} duration={600}>
                    <KashierLogo
                        style={{
                            marginBottom: 30,
                            alignSelf: 'center'
                        }}
                    />
                </FadeInDownView>
                <FadeInUpView delay={150} duration={600}>
                    <PasswordForm onSubmit={onSubmit} />
                </FadeInUpView>
            </ScrollView>
        </SafeAreaView>
    );
}

export default RegisterPasswordScreen;