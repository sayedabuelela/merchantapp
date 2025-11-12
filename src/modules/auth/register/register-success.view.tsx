import { ROUTES } from "@/src/core/navigation/routes";
import { SuccessRegister } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {  View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterSuccessScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const handleSkip = () => {
        router.replace(ROUTES.TABS.BALANCE);
    }

    const handleActivate = () => {
        router.push(ROUTES.ONBOARDING.ACCOUNT_TYPE);
    }
    
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-6 pb-16 pt-28">
                <SuccessRegister />
                <FontText
                    type="head"
                    weight="bold"
                    className="text-center text-2xl mt-8 text-feedback-success-text">
                    {t("Account Successfully Created")}
                </FontText>
                <FontText
                    type="body"
                    weight="regular"
                    className="text-center text-xl mt-10 text-content-primary">
                    {t("Activate your account to start accepting payments")}
                </FontText>
            </View>
            <View className="items-center justify-center mt-8 px-6 pb-8">
                <Button
                    title={t("Activate Account")}
                    onPress={handleActivate}
                    variant="outline"
                    className="w-full"
                />
                <Button
                    title={t("Skip for now")}
                    onPress={handleSkip}
                    variant="outline"
                    className="w-full border-0 mt-6"
                />
            </View>
        </SafeAreaView>
    );
}

export default RegisterSuccessScreen;
