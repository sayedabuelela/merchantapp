import { ROUTES } from "@/src/core/navigation/routes";
import { KashierLogo } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectUser, useAuthStore } from "../auth.store";
import { useBiometricViewModel } from "./biometric.viewmodel";
import BiometricIcons from "./components/BiometricIcons";
import { FadeInDownView, FadeInUpView, ScaleView } from "@/src/shared/components/wrappers/animated-wrappers";

const BiometricScreen = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { fullName = '' } = useAuthStore(selectUser) ?? {};

    const { login, loading } = useBiometricViewModel();

    const onSubmit = async () => {
        await login();
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
                        {t("Welcome")} {fullName.length <= 1 ? t('Back') : fullName}
                    </FontText>
                </FadeInUpView>

                <FadeInUpView delay={250} duration={600}>
                    <FontText
                        type="body"
                        weight="semi"
                        className="text-center text-sm text-content-hint mt-8"
                    >
                        {t('Login with Fingerprint or Face ID')}
                    </FontText>
                </FadeInUpView>

                <ScaleView delay={350} duration={600}>
                    <BiometricIcons onPress={onSubmit} isLoading={loading} />
                </ScaleView>

                <FadeInUpView delay={450} duration={600}>
                    <Link href={ROUTES.AUTH.LOGIN} className={`mt-14 self-center`}>
                        <FontText
                            weight='semi'
                            className={'text-primary'}
                        >
                            {t('Login with Email')}
                        </FontText>
                    </Link>
                </FadeInUpView>

            </View>
        </SafeAreaView>
    )
}

export default BiometricScreen;