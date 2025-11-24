import { ROUTES } from "@/src/core/navigation/routes";
import Header from "@/src/modules/onboarding/components/Header";
import BusinessContactForm from "@/src/modules/onboarding/contact/components/BusinessContactForm";
import { BusinessContactFormData } from "@/src/modules/onboarding/contact/contact.model";
import useContactViewModel from "@/src/modules/onboarding/contact/contact.viewmodel";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from "react-native-safe-area-context";

const ContactDetailsScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        businessContactData,
        isLoadingContactData,
        contactDataError,
        cities,
        citiesLoading,
        selectedCity,
        handleCityChange,
        submitBusinessContact,
        isSubmittingContactData,
        submitPartialDataError
    } = useContactViewModel();

    const onSubmit = async (data: BusinessContactFormData, formState: { dirtyFields: { [key: string]: boolean }, isDirty: boolean }) => {
        submitBusinessContact(data, formState);
    }

    const handleSkip = () => {
        router.replace(ROUTES.TABS.HOME);
    }

    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <Header title={t('Business Contact Info')} progress={46} />

            <KeyboardAwareScrollView
                bottomOffset={40}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pb-12"
            >
                <BusinessContactForm
                    onSubmit={onSubmit}
                    loading={citiesLoading || isLoadingContactData || isSubmittingContactData}
                    error={contactDataError?.message || submitPartialDataError?.message}
                    cities={cities}
                    existingData={businessContactData}
                    selectedCity={selectedCity}
                    handleCityChange={handleCityChange}
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

export default ContactDetailsScreen;
