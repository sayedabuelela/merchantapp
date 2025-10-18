import { KashierLogo } from "@/src/shared/assets/svgs";
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterDataForm from "./components/RegisterDataForm";
import { RegisterDataFormData } from "./register-data.model";
import useRegister from "../register.viewmodel";
import { useLocalSearchParams } from 'expo-router';
import { ROUTES } from '@/src/core/navigation/routes';
import { Mode } from "@/src/core/environment/environments";
import { useEnvironmentStore } from "@/src/core/environment/environments.store";

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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            // keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0} 
            >
                <ScrollView
                    className="flex-1 px-6 pb-16 pt-28"
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <KashierLogo
                        style={{
                            // marginBottom: 30,
                            alignSelf: 'center'
                        }}
                    />

                    <RegisterDataForm
                        onSubmit={onSubmit}
                        loading={isLoading}
                        error={error?.error || error?.message}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default RegisterDataScreen;