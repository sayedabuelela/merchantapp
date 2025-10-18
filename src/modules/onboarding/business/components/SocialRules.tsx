import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const SocialRules = () => {
    const { t } = useTranslation();
    return (
        <View className="mt-4">
            <View className="flex-row items-baseline mb-1">
                <View className="w-1 h-1 rounded-full bg-content-disabled" />
                <FontText type="body" weight="semi" className="text-content-disabled text-xs ml-2 self-start">
                    {t('Social media accounts should be active with at least 2k followers.')}
                </FontText>
            </View>
            <View className="flex-row items-baseline mb-1">
                <View className="w-1 h-1 rounded-full bg-content-disabled" />
                <FontText type="body" weight="semi" className="text-content-disabled text-xs ml-2 self-start">
                    {t('The account should be active and has more than 1 year of recent frequent posts.')}
                </FontText>
            </View>
            <View className="flex-row items-baseline mb-1">
                <View className="w-1 h-1 rounded-full bg-content-disabled" />
                <FontText type="body" weight="semi" className="text-content-disabled text-xs ml-2 self-start">
                    {t('The account should contain contact info.')}
                </FontText>
            </View>
            <View className="flex-row items-baseline mb-1">
                <View className="w-1 h-1 rounded-full bg-content-disabled" />
                <FontText type="body" weight="semi" className="text-content-disabled text-xs ml-2 self-start">
                    {t('Website be live & reachable. It should also contain products/services.')}
                </FontText>
            </View>
            <View className="flex-row items-baseline mb-1">
                <View className="w-1 h-1 rounded-full bg-content-disabled" />
                <FontText type="body" weight="semi" className="text-content-disabled text-xs ml-2 self-start">
                    {t('Currency of the website must in EGP.')}
                </FontText>
            </View>
            <View className="flex-row items-baseline mb-1   ">
                <View className="w-1 h-1 rounded-full bg-content-disabled" />
                <FontText type="body" weight="semi" className="text-content-disabled text-xs ml-2 self-start">
                    {t('The website should contain Egyptian Contacts (Address, Phone number, E-mail, Terms & Conditions and Refund Policy).')}
                </FontText>
            </View>
        </View>
    )
}

export default SocialRules;