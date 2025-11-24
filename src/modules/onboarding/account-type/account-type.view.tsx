import { ROUTES } from "@/src/core/navigation/routes";
import FontText from "@/src/shared/components/FontText";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AcountTypeItem from "../components/AcountTypeItem";
import Header from "../components/Header";
import { useOnboardingStore } from "../onboarding.store";
import { AccountType } from "./account-type.model";

const AccountTypeScreen = () => {
    const { t } = useTranslation();
    const { accountType, setAccountType } = useOnboardingStore();
    const router = useRouter();

    const handleSelectAccountType = (type: AccountType) => {
        setAccountType(type);
        router.push(ROUTES.ONBOARDING.BUSINESS);
    }

    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <Header title={t('Account Type')}
            // progress={0} 
            />
            <View className="flex-1 justify-between pb-4">
                <View>
                    <FontText type="body" weight="semi" className="text-content-secondary text-base mb-6">
                        {t('Choose account type')}
                    </FontText>

                    <AcountTypeItem
                        title={t('Individual Seller')}
                        description={t('For small-scale businesses like online selling, provide your National ID and Utility Bill for credibility as a seller.')}
                        onPress={() => { handleSelectAccountType('individual') }}
                        isSelected={accountType === 'individual'}
                    />
                    <AcountTypeItem
                        title={t('Registered Business')}
                        description={t('For registered and tax-compliant businesses, provide your National ID, Commercial Register, and Tax ID for validation.')}
                        onPress={() => { handleSelectAccountType('registered') }}
                        isSelected={accountType === 'registered'}
                    />
                    <AcountTypeItem
                        title={t('Professional Business')}
                        description={t('For professional service businesses (e.g., consultancy, teaching, healthcare). Along with your National ID, provide a Tax ID to verify your professional status and qualifications.')}
                        onPress={() => { handleSelectAccountType('professional') }}
                        isSelected={accountType === 'professional'}
                    />
                </View>

                <Link href={ROUTES.TABS.HOME}>
                    <FontText
                        type="body"
                        weight='bold'
                        className={'text-primary text-sm text-center'}
                    >
                        {t('Skip')}
                    </FontText>
                </Link>
            </View>
        </SafeAreaView>
    );
};

export default AccountTypeScreen;
