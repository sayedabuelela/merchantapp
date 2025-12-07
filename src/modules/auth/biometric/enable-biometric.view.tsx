import { ROUTES } from "@/src/core/navigation/routes";
import { KashierLogo } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectUser, useAuthStore } from "../auth.store";
import { useBiometricViewModel } from "./biometric.viewmodel";
import BiometricIcons from "./components/BiometricIcons";
import { FadeInDownView, FadeInUpView, ScaleView } from "@/src/shared/components/wrappers/animated-wrappers";
const EnableBiometricScreen = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { fullName = '' } = useAuthStore(selectUser) ?? {};
    const { enableBiometric, setInitialized, isInitialized, isBiometricAvailable } = useBiometricViewModel();
    // let isLoading = false;

    const onEnable = async () => {
        // isLoading = true;
        const success = await enableBiometric();
        if (success) router.replace(ROUTES.TABS.HOME);
    }

    const onSkip = () => {
        setInitialized(true);
        router.replace(ROUTES.TABS.HOME);
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="items-center px-6 pt-36">
                <FadeInDownView delay={0} duration={600}>
                    <KashierLogo style={{ marginBottom: 24 }} />
                </FadeInDownView>

                <FadeInUpView delay={150} duration={600}>
                    <FontText
                        type="head"
                        weight="bold"
                        className="text-center text-xl text-primary"
                    >
                        {t("Welcome")} {fullName.length > 1 && fullName}
                    </FontText>
                </FadeInUpView>

                <FadeInUpView delay={250} duration={600}>
                    <FontText
                        type="body"
                        weight="semi"
                        className="text-center text-sm text-content-hint mt-8"
                    >
                        {t('Add your fingerprint or Face ID to login with next time')}
                    </FontText>
                </FadeInUpView>

                <ScaleView delay={350} duration={600}>
                    <BiometricIcons onPress={onEnable} />
                </ScaleView>

                <FadeInUpView delay={450} duration={600}>
                    <Button
                        className="mt-12"
                        title={t('Remind Me Later')}
                        fullWidth
                        onPress={onSkip}
                    />
                </FadeInUpView>

            </View>
        </SafeAreaView>
    )
}

export default EnableBiometricScreen;