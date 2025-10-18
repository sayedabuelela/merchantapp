import { useApi } from "@/src/core/api/clients.hooks";
import { ROUTES } from "@/src/core/navigation/routes";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { getOnboardingAllData } from "@/src/modules/onboarding/data/onboarding-data.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { GlobalOnboardingData } from "../data/onboarding-data.model";
import useOnboardingDataViewModel from "../data/onboarding-data.viewmodel";
import { BusinessContactFormData, City } from "./contact.model";
import { getCities } from "./contact.services";

const useContactViewModel = () => {
    const router = useRouter();
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const currentMerchantId = user?.merchantId;
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const { onboardingDataQueryKey, submitPartialData, isSubmittingPartialData: isSubmittingContactData, submitPartialDataError } = useOnboardingDataViewModel();

    const {
        data: businessContactData,
        isLoading: isLoadingContactData,
        error: contactDataError,
        isFetching: isFetchingContactData,
    } = useQuery<GlobalOnboardingData, Error, BusinessContactFormData>({
        queryKey: onboardingDataQueryKey,
        queryFn: () => getOnboardingAllData(api, currentMerchantId!),
        select: (allFetchedData) => {
            return allFetchedData?.merchant?.merchantInfo?.businessContactInfo;
        },
        enabled: !!currentMerchantId,
        staleTime: 20 * 60 * 1000, // 20 minutes,
        // staleTime: Infinity,
    });

    const { data: cities, isLoading: citiesLoading } = useQuery<City[]>({
        queryKey: ['cities'],
        queryFn: () => getCities(api),
    });

    // const { mutateAsync: saveBusinessContactMutation, isPending: isSavingBusinessContact, error: saveBusinessContactError } = useMutation({
    //     mutationFn: async (data: BusinessContactRequestData) => await saveBusinessContact(api, currentMerchantId!, data),
    // });

    useEffect(() => {
        if (cities && businessContactData?.governorate) {
            initializeCity(businessContactData.governorate);
        }
    }, [cities, businessContactData]);

    const initializeCity = (existingCityValue: string) => {
        if (!cities) return;

        const city = cities.find(city => city.value === existingCityValue);

        if (city) {
            setSelectedCity(city[I18nManager.isRTL ? 'city_name_ar' : 'city_name_en']);
        }
    };

    const handleCityChange = (cityValue: string) => {
        setSelectedCity(cityValue);
    };

    // const submitBusinessContactForm = async (data: BusinessContactFormData, formState: { dirtyFields: { [key: string]: boolean }, isDirty: boolean }) => {

    //     const { dirtyFields, isDirty } = formState;

    //     if (!isDirty) {
    //         router.push(ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE);
    //         return;
    //     }

    //     let payload: BusinessContactRequestData = {
    //         merchantInfo: {
    //             businessContactInfo: data
    //         }
    //     };
    //     try {
    //         await saveBusinessContactMutation(payload);
    //         router.push(ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE);
    //     } catch (error) {
    //         console.error('Error submitting business contact form:', error);
    //     }
    // }

    const submitBusinessContact = useCallback(async (data: BusinessContactFormData, formState: { dirtyFields: { [key: string]: boolean }, isDirty: boolean }) => {

        const { isDirty } = formState;

        if (!isDirty) {
            router.push(ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE);
            return;
        }

        await submitPartialData({
            merchantInfo: {
                businessContactInfo: data
            }
        });
        router.push(ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE);
    }, [submitPartialData]);


    return {
        businessContactData,
        isLoadingContactData,
        contactDataError,
        isFetchingContactData,
        cities,
        citiesLoading,
        selectedCity,
        handleCityChange,
        submitBusinessContact,
        isSubmittingContactData,
        submitPartialDataError
    };
};

export default useContactViewModel;