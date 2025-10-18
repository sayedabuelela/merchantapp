import { ROUTES } from "@/src/core/navigation/routes";
import { KashierLogo } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {  View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectUser, useAuthStore } from "../auth.store";
import { useBiometricViewModel } from "./biometric.viewmodel";
import BiometricIcons from "./components/BiometricIcons";
const EnableBiometricScreen = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { fullName = '' } = useAuthStore(selectUser) ?? {};
    const { enableBiometric, setInitialized, isInitialized, isBiometricAvailable } = useBiometricViewModel();
    // let isLoading = false;

    const onEnable = async () => {
        // isLoading = true;
        const success = await enableBiometric();
        if (success) router.replace(ROUTES.TABS.ROOT);
    }

    const onSkip = () => {
        setInitialized(true);
        router.replace(ROUTES.TABS.ROOT);
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="items-center px-6 pt-36">
                <KashierLogo style={{ marginBottom: 24 }} />

                <FontText
                    type="head"
                    weight="bold"
                    className="text-center text-xl text-primary"
                >
                    {t("Welcome")} {fullName.length > 1 && fullName}
                </FontText>

                <FontText
                    type="body"
                    weight="semi"
                    className="text-center text-sm text-content-hint mt-8"
                >
                    {t('Add your fingerprint or Face ID to login with next time')}
                </FontText>

                <BiometricIcons onPress={onEnable} />

                <Button
                    className="mt-12"
                    title={t('Remind Me Later')}
                    fullWidth
                    onPress={onSkip}
                />

            </View>
        </SafeAreaView>
    )
}

export default EnableBiometricScreen;