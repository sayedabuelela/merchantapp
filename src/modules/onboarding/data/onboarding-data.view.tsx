
import { ROUTES } from "@/src/core/navigation/routes";
import Header from "@/src/modules/onboarding/components/Header";
import Button from "@/src/shared/components/Buttons/Button";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useDocumentViewModel from "../documents/documents.viewmodel";
import { accountTypeSelector, useOnboardingStore } from "../onboarding.store";
import BrandHeader from "./components/BrandHeader";
import BusinessContactSection from "./components/sections/BusinessContactSection";
import BusinessDetailsSection from "./components/sections/BusinessDetailsSection";
import CurrencySettingsSection from "./components/sections/CurrencySettingsSection";
import DocumentsSection from "./components/sections/DocumentsSection";
import useOnboardingDataViewModel from "./onboarding-data.viewmodel";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";


const OnboardingDataScreen = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const accountType = useOnboardingStore(accountTypeSelector);
    const { onboardingData, submitRequestHandler, isSubmittingOnboadingRequest, submitOnboadingRequestError } = useOnboardingDataViewModel()
    console.log('OnboardingDataScreen accountType : ', accountType);
    // console.log('OnboardingDataScreen onboardingData : ', onboardingData?.merchant.merchantInfo);
    const businessContactData = onboardingData?.merchant?.merchantInfo?.businessContactInfo;
    const businessDetailsData = onboardingData?.merchant?.merchantInfo?.publicData;
    const companyName = businessDetailsData?.legalCompanyName;
    const currencies = onboardingData?.merchant?.merchantInfo?.payoutMethod?.currencies;
    const documents = onboardingData?.merchant?.merchantInfo?.documents;
    const {
        displayableFileUri: businessLogoDataUri,
        isLoadingDocument: isLoadingLogo,
    } = useDocumentViewModel({ documentType: 'businessLogo' });
    const submitHandler = () => {
        if (onboardingData?.merchant.merchantInfo) {
            submitRequestHandler(onboardingData?.merchant.merchantInfo);
        }
    }
    console.log('accountType : ', accountType);
    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <Header title={t(`${accountType} ${accountType === 'individual' ? 'Seller' : 'Business'}`)} />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pb-12"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="flex-1 justify-between">
                    <View>
                        {submitOnboadingRequestError && (
                            <AnimatedError errorMsg={submitOnboadingRequestError.message} />
                        )}
                        {!isLoadingLogo && companyName && (
                            <BrandHeader
                                companyName={companyName}
                                logoUrl={businessLogoDataUri}
                            />
                        )}
                        {businessDetailsData && (
                            <BusinessDetailsSection
                                {...businessDetailsData}
                            />
                        )}
                        {businessContactData && (
                            <BusinessContactSection
                                {...businessContactData}
                            />
                        )}
                        {documents && (
                            <DocumentsSection
                                documents={documents}
                            />
                        )}
                        {currencies && (
                            <CurrencySettingsSection
                                currencies={currencies}
                            />
                        )}
                    </View>
                    {businessDetailsData && businessContactData && documents && currencies && (
                        <View className="mt-6 ">
                            <Button
                                isLoading={isSubmittingOnboadingRequest}
                                disabled={isSubmittingOnboadingRequest}
                                title={t("Request Activation")}
                                onPress={submitHandler}
                            />
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default OnboardingDataScreen;
