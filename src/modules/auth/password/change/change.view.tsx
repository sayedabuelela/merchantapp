import { ChangePassword } from "@/src/shared/assets/svgs";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChangePasswordRequest } from "./change.model";
import { useChangePasswordViewModel } from "./change.viewmodel";
import ChangePasswordForm from "./components/ChangePasswordForm";

const ChangePasswordScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { changePassword, isLoading, error } = useChangePasswordViewModel();

    const onSubmit = async ({ currentPassword, newPassword }: ChangePasswordRequest) => {
        await changePassword({ currentPassword, newPassword });

        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-white pt-36">
            <ScrollView
                className="flex-1 px-6 pb-16"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="items-center justify-center ">
                    <ChangePassword />
                    <FontText
                        type="head"
                        weight="bold"
                        className="text-content-primary text-2xl mt-4">
                        {t('Change password')}
                    </FontText>
                </View>


                {error && (
                    <AnimatedError errorMsg={t(error.message)} />
                )}

                <ChangePasswordForm onSubmit={onSubmit} isLoading={isLoading} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;