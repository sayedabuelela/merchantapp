import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";

const BiometricHeader = ({ isBiometricEnabled }: { isBiometricEnabled: boolean }) => {
    const { t } = useTranslation();

    const android = {
        enabled: {
            title: t('Cancel Fingerprint or Face ID'),
            description: ""
        },
        disabled: {
            title: t('Login with Fingerprint or Face ID'),
            description: t('Add your fingerprint or Face ID to login with next time')
        }
    }
    const ios = {
        enabled: {
            title: t('Cancel Face ID'),
            description: ""
        },
        disabled: {
            title: t('Login with Face ID'),
            description: t('Add your Face ID to login with next time')
        }
    }
    return (
        <View className="gap-y-4">
            <FontText type="head" weight="bold" className="text-content-primary text-xl text-center">
                {Platform.OS === 'ios' ? (isBiometricEnabled ? ios.enabled.title : ios.disabled.title) : (isBiometricEnabled ? android.enabled.title : android.disabled.title)}
            </FontText>
            {isBiometricEnabled && (
                <FontText type="body" weight="semi" className="text-content-secondary text-sm text-center">
                    {Platform.OS === 'ios' ? ios.enabled.description : android.enabled.description}
                </FontText>
            )}
        </View>
    )
}

export default BiometricHeader