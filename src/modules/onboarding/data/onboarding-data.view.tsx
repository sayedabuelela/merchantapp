import Header from "@/src/modules/onboarding/components/Header";
import Button from "@/src/shared/components/Buttons/Button";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useDocumentViewModel from "../documents/documents.viewmodel";
import { accountTypeSelector, pendingEditsSelector, useOnboardingStore } from "../onboarding.store";
import BrandHeader from "./components/BrandHeader";
import BusinessContactSection from "./components/sections/BusinessContactSection";
import BusinessDetailsSection from "./components/sections/BusinessDetailsSection";
import CurrencySettingsSection from "./components/sections/CurrencySettingsSection";
import DocumentsSection from "./components/sections/DocumentsSection";
import useOnboardingDataViewModel from "./onboarding-data.viewmodel";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import ActivationNote from "@/src/modules/settings/components/ActivationNote";
import { MerchantInfo } from "./onboarding-data.model";
import FontText from "@/src/shared/components/FontText";


const OnboardingDataScreen = () => {
    const { t } = useTranslation();
    const accountType = useOnboardingStore(accountTypeSelector);
    const pendingEdits = useOnboardingStore(pendingEditsSelector);
    const hasPendingEdits = useOnboardingStore((state) => state.hasPendingEdits);
    const clearPendingEdits = useOnboardingStore((state) => state.clearPendingEdits);
    const {
        onboardingData,
        submitRequestHandler,
        isSubmittingOnboadingRequest,
        submitOnboadingRequestError,
        canEdit,
        canSubmit,
        showActivationNote,
        merchantStatus,
    } = useOnboardingDataViewModel()

    // Server data
    const serverBusinessContactData = onboardingData?.merchant?.merchantInfo?.businessContactInfo;
    const serverBusinessDetailsData = onboardingData?.merchant?.merchantInfo?.publicData;
    const serverCurrencies = onboardingData?.merchant?.merchantInfo?.payoutMethod?.currencies;
    const serverDocuments = onboardingData?.merchant?.merchantInfo?.documents;

    // Company name from server or pending edits
    const companyName = pendingEdits.publicData?.legalCompanyName ?? serverBusinessDetailsData?.legalCompanyName;
    const pendingEditsExist = hasPendingEdits();

    const {
        displayableFileUri: businessLogoDataUri,
        isLoadingDocument: isLoadingLogo,
    } = useDocumentViewModel({ documentType: 'businessLogo' });

    const submitHandler = async () => {
        if (!onboardingData?.merchant.merchantInfo) return;

        const serverPublicData = onboardingData.merchant.merchantInfo.publicData;

        // Build merged payload with server data + pending edits
        const merchantInfo: MerchantInfo = {
            ...onboardingData.merchant.merchantInfo,
            // Override with pending edits if they exist
            // Use server data as base and spread pending edits on top
            publicData: pendingEdits.publicData && serverPublicData
                ? { ...serverPublicData, ...pendingEdits.publicData }
                : serverPublicData,
            businessContactInfo: pendingEdits.businessContactInfo
                ?? onboardingData.merchant.merchantInfo.businessContactInfo,
            payoutMethod: pendingEdits.currencies
                ? { currencies: pendingEdits.currencies }
                : onboardingData.merchant.merchantInfo.payoutMethod,
            documents: pendingEdits.documents
                ?? onboardingData.merchant.merchantInfo.documents,
        };

        // Handle business logo from pending edits
        if (pendingEdits.businessLogo) {
            merchantInfo.businessLogo = pendingEdits.businessLogo;
        }

        try {
            await submitRequestHandler(merchantInfo);
            clearPendingEdits(); // Clear pending edits after successful submit
        } catch (error) {
            // Error handled in submitRequestHandler, pending edits remain for retry
            console.error('Submit failed:', error);
        }
    }

    const getActivationStatus = (): 'pending' | 'submitted' | 'rejected' => {
        const isApprovedBusinessInfo = onboardingData?.isApprovedBusinessInfo;
        // Show "evaluating profile" message when business info is pending but merchant is approved/submitted
        if (isApprovedBusinessInfo === 'pending' && (merchantStatus === 'approved' || merchantStatus === 'submitted')) {
            return 'submitted';
        }
        if (merchantStatus === 'submitted') return 'submitted';
        if (merchantStatus === 'rejected') return 'rejected';
        return 'pending';
    };

    // console.log('accountType : ', accountType);
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
                        {pendingEditsExist && (
                            <View className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4">
                                <FontText type="body" weight="semi" className="text-amber-800">
                                    {t('You have unsaved changes. Submit to apply them.')}
                                </FontText>
                            </View>
                        )}
                        {showActivationNote && (
                            <ActivationNote
                                status={getActivationStatus()}
                            />
                        )}
                        {!isLoadingLogo && companyName && (
                            <BrandHeader
                                companyName={companyName}
                                logoUrl={businessLogoDataUri}
                            />
                        )}
                        {serverBusinessDetailsData && (
                            <BusinessDetailsSection
                                {...serverBusinessDetailsData}
                                {...(pendingEdits.publicData || {})}
                                showEditButton={canEdit}
                                hasUnsavedChanges={!!pendingEdits.publicData}
                            />
                        )}
                        {serverBusinessContactData && (
                            <BusinessContactSection
                                {...(pendingEdits.businessContactInfo || serverBusinessContactData)}
                                showEditButton={canEdit}
                                hasUnsavedChanges={!!pendingEdits.businessContactInfo}
                            />
                        )}
                        {serverDocuments && (
                            <DocumentsSection
                                documents={pendingEdits.documents || serverDocuments}
                                showEditButton={canEdit}
                                hasUnsavedChanges={!!pendingEdits.documents}
                            />
                        )}
                        {serverCurrencies && (
                            <CurrencySettingsSection
                                currencies={pendingEdits.currencies || serverCurrencies}
                                showEditButton={canEdit}
                                hasUnsavedChanges={!!pendingEdits.currencies}
                            />
                        )}
                    </View>
                    {serverBusinessDetailsData && serverBusinessContactData && serverDocuments && serverCurrencies && (
                        <View className="mt-6 ">
                            <Button
                                isLoading={isSubmittingOnboadingRequest}
                                disabled={!canSubmit || isSubmittingOnboadingRequest}
                                title={
                                    merchantStatus === 'approved'
                                        ? t("Request Change")
                                        : pendingEditsExist
                                            ? t("Submit Changes")
                                            : t("Request Activation")
                                }
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
