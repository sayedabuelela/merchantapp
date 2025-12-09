import { KashierLogo } from "@/src/shared/assets/svgs";
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterDataForm from "./components/RegisterDataForm";
import { RegisterDataFormData } from "./register-data.model";
import useRegister from "../register.viewmodel";
import { useLocalSearchParams } from 'expo-router';
import { ROUTES } from '@/src/core/navigation/routes';
import { Mode } from "@/src/core/environment/environments";
import { useEnvironmentStore } from "@/src/core/environment/environments.store";
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { FadeInDownView, FadeInUpView } from '@/src/shared/components/wrappers/animated-wrappers';

const RegisterDataScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { register, isLoading, error } = useRegister();
    const { email, password, code } = useLocalSearchParams<{ email: string, password: string, code: string }>();

    const setMode = useEnvironmentStore(s => s.setMode)
    useEffect(() => {
        setMode(Mode.LIVE)
    }, [])

    const onSubmit = async (data: RegisterDataFormData) => {
        await register({ ...data, signupKey: email, password, code });
        router.replace(ROUTES.REGISTER_SUCCESS);
    };


    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAwareScrollView
                className="flex-1 px-6 pt-28"
                contentContainerStyle={{ flexGrow: 1, }}
                bottomOffset={100}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pb-12"
            >
                <FadeInDownView delay={0} duration={600}>
                    <KashierLogo
                        style={{
                            alignSelf: 'center'
                        }}
                    />
                </FadeInDownView>

                <FadeInUpView delay={150} duration={600} className="flex-1">
                    <RegisterDataForm
                        onSubmit={onSubmit}
                        loading={isLoading}
                        error={error?.error || error?.message}
                    />
                </FadeInUpView>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

export default RegisterDataScreen;