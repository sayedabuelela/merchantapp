import {ChangePassword} from "@/src/shared/assets/svgs";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import FontText from "@/src/shared/components/FontText";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import {I18nManager, Pressable, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {SafeAreaView} from "react-native-safe-area-context";
import {ChangePasswordRequest} from "./change.model";
import {useChangePasswordViewModel} from "./change.viewmodel";
import ChangePasswordForm from "./components/ChangePasswordForm";
import {ChevronLeftIcon} from "react-native-heroicons/outline";

const isRTL = I18nManager.isRTL;

const ChangePasswordScreen = () => {
    const {t} = useTranslation();
    const router = useRouter();
    const {changePassword, isLoading, error} = useChangePasswordViewModel();

    const onSubmit = async ({currentPassword, newPassword}: ChangePasswordRequest) => {
        await changePassword({currentPassword, newPassword});
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <View>
                <Pressable onPress={router.back}>
                    <ChevronLeftIcon size={24} color="#0F172A"
                                     style={isRTL ? {transform: [{rotate: '180deg'}]} : {}}/>
                </Pressable>
            </View>
            <KeyboardAwareScrollView
                className="pb-16"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
            >
                <View className="items-center justify-center pt-36">
                    <ChangePassword/>
                    <FontText
                        type="head"
                        weight="bold"
                        className="text-content-primary text-2xl mt-4">
                        {t('Change password')}
                    </FontText>
                </View>


                {error && (
                    <AnimatedError errorMsg={t(error.message)}/>
                )}

                <ChangePasswordForm onSubmit={onSubmit} isLoading={isLoading}/>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;