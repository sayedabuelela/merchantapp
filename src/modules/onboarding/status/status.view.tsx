import { ROUTES } from "@/src/core/navigation/routes";
import useOnboardingDataViewModel from "@/src/modules/onboarding/data/onboarding-data.viewmodel";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { accountTypeSelector, useOnboardingStore } from "../onboarding.store";
import OnboardingStatusItem from "./components/StatusItem";
import { FadeInDownView, FadeInUpView, StaggerChildrenView } from "@/src/shared/components/wrappers/animated-wrappers";

const OnboardingStatusScreen = () => {
    const { t } = useTranslation();
    const { onboardingData } = useOnboardingDataViewModel();
    const accountType = useOnboardingStore(accountTypeSelector);
    const router = useRouter();
    console.log('StatusScreen onboardingData : ', onboardingData);
    const handleSkip = () => {
        router.replace(ROUTES.TABS.HOME);
    }

    return (
        <SafeAreaView className="flex-1 bg-white justify-between px-6">

            <View>
                <FadeInDownView delay={0} duration={600}>
                    <FontText type="head" weight="bold" className="text-content-primary text-xl self-start mt-2 mb-8">{t('Activation status')}</FontText>
                </FadeInDownView>

                <StaggerChildrenView delay={150} staggerDelay={80} animationType="fadeInUp" duration={600}>
                    <OnboardingStatusItem
                        title={t('Account Type')}
                        onPress={() => { router.push(ROUTES.ONBOARDING.ACCOUNT_TYPE) }}
                        status={accountType !== null}
                    />

                    <OnboardingStatusItem
                        title={t('Business Details')}
                        onPress={() => { router.push(ROUTES.ONBOARDING.BUSINESS) }}
                        status={onboardingData?.merchant?.merchantInfo?.publicData !== undefined}
                    />

                    <OnboardingStatusItem
                        title={t('Business Contact Info')}
                        onPress={() => { router.push(ROUTES.ONBOARDING.CONTACT) }}
                        status={onboardingData?.merchant?.merchantInfo?.businessContactInfo !== undefined}
                    />

                    <OnboardingStatusItem
                        title={t('Business Documents')}
                        onPress={() => { router.push(ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE) }}
                        status={onboardingData?.merchant?.merchantInfo?.documents !== undefined}
                    />

                    <OnboardingStatusItem
                        title={t('Currency Settings')}
                        onPress={() => { router.push(ROUTES.ONBOARDING.CURRENCY_SETTINGS) }}
                        status={onboardingData?.merchant?.merchantInfo?.payoutMethod !== undefined}
                        isLast
                    />
                </StaggerChildrenView>
                {/* <OnboardingStatusItem
                    title={t('Onboarding data')}
                    onPress={() => { router.push(ROUTES.ONBOARDING.DATA) }}
                    status={onboardingData?.merchant?.merchantInfo?.payoutMethod !== undefined}
                    isLast
                /> */}

            </View>

            <FadeInUpView delay={550} duration={600}>
                <View className="mb-6">
                    <TouchableOpacity onPress={handleSkip} >
                        <FontText
                            type="body"
                            weight='bold'
                            className={'text-primary text-sm text-center'}
                        >
                            {t('Skip')}
                        </FontText>
                    </TouchableOpacity>
                </View>
            </FadeInUpView>


        </SafeAreaView>
    )
}

export default OnboardingStatusScreen

