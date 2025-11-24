import { ROUTES } from "@/src/core/navigation/routes";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { BusinessDetailsFormData } from "./business.model";
import { TERMS_AR, TERMS_EN } from "./business.static";
import useBusinessViewModel from "./business.viewmodel";
import BusinessDetailsForm from "./components/BusinessDetailsForm";

const BusinessDetailsScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        businessDetailsData,
        businessIndustries,
        selectedIndustry,
        selectedSector,
        handleIndustryChange,
        handleSectorChange,
        submitBusinessDetailsForm,
        businessLogoDataUri,
        isLoadingLogo,
        isSubmittingPartialData,
        submitPartialDataError,
        isUploadingLogo,
        logoUploadError,
    } = useBusinessViewModel();

    const onSubmit = async (data: BusinessDetailsFormData, formState: { dirtyFields: { [key: string]: boolean }, isDirty: boolean }) => {
        submitBusinessDetailsForm(data, formState);
    }

    const normalizedData: BusinessDetailsFormData = {
        legalCompanyName: businessDetailsData?.legalCompanyName ?? "",
        storeName: businessDetailsData?.storeName ?? "",
        description: businessDetailsData?.description ?? "",
        businessIndustry: businessDetailsData?.businessIndustry ?? "",
        businessSector: selectedSector ?? "",
        termsAndConditions: businessDetailsData?.termsAndConditions ?? { ar: TERMS_AR, en: TERMS_EN },
        companyWebsite: businessDetailsData?.companyWebsite ?? "",
        socialTwitter: businessDetailsData?.socialTwitter ?? "",
        socialLinkedIn: businessDetailsData?.socialLinkedIn ?? "",
        socialFacebook: businessDetailsData?.socialFacebook ?? "",
        socialInstagram: businessDetailsData?.socialInstagram ?? "",
        // businessLogo: { businessLogo: businessLogoDataUri, businessLogoKey: logoMetadata?.key }
        businessLogo: businessLogoDataUri
    };
    const handleSkip = () => {
        router.replace(ROUTES.TABS.HOME);
    }
    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <Header title={t('Business Details')} progress={31} />

            <KeyboardAwareScrollView
                bottomOffset={40}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pb-12"
            >
                <BusinessDetailsForm
                    onSubmit={onSubmit}
                    loading={isLoadingLogo || isSubmittingPartialData || isUploadingLogo}
                    error={submitPartialDataError?.message || logoUploadError?.message}
                    businessIndustries={businessIndustries}
                    existingData={normalizedData}
                    selectedIndustry={selectedIndustry}
                    selectedSector={selectedSector}
                    handleIndustryChange={handleIndustryChange}
                    handleSectorChange={handleSectorChange}
                />

                <TouchableOpacity onPress={handleSkip} className="mt-6">
                    <FontText
                        type="body"
                        weight='bold'
                        className={'text-primary text-sm text-center'}
                    >
                        {t('Skip')}
                    </FontText>
                </TouchableOpacity>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default BusinessDetailsScreen;