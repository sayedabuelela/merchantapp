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
import { accountTypeSelector, useOnboardingStore } from "../onboarding.store";
import { BusinessContactFormData, City } from "./contact.model";
import { getCities } from "./contact.services";
import useApprovalBasedSubmit from "../hooks/useApprovalBasedSubmit";

const useContactViewModel = () => {
    const router = useRouter();
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const currentMerchantId = user?.merchantId;
    const accountType = useOnboardingStore(accountTypeSelector);
    const setPendingContactInfo = useOnboardingStore((state) => state.setPendingContactInfo);
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const { onboardingDataQueryKey, submitPartialData, isSubmittingPartialData: isSubmittingContactData, submitPartialDataError } = useOnboardingDataViewModel();
    const { shouldSaveLocally, canPartialSubmit } = useApprovalBasedSubmit();

    const {
        data: businessContactData,
        isLoading: isLoadingContactData,
        error: contactDataError,
        isFetching: isFetchingContactData,
    } = useQuery<GlobalOnboardingData, Error, BusinessContactFormData>({
        queryKey: onboardingDataQueryKey,
        queryFn: () => getOnboardingAllData(api),
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

    const submitBusinessContact = useCallback(async (data: BusinessContactFormData, formState: { dirtyFields: { [key: string]: boolean }, isDirty: boolean }) => {

        const { isDirty } = formState;

        // If no changes and in pending mode, just navigate forward
        if (!isDirty && canPartialSubmit) {
            router.push(ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE);
            return;
        }

        // If no changes and in local save mode, just go back
        if (!isDirty && shouldSaveLocally) {
            router.back();
            return;
        }

        // Normalize optional fields to empty strings (API expects strings, not undefined)
        const normalizedData: BusinessContactFormData = {
            country: data.country,
            governorate: data.governorate,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2 ?? "",
            businessPhone: data.businessPhone,
            businessEmail: data.businessEmail,
            hotlineNumber: data.hotlineNumber ?? "",
        };

        const payload = {
            merchantInfo: {
                businessContactInfo: normalizedData
            }
        };

        console.log('Submitting business contact payload:', JSON.stringify(payload, null, 2));

        // Conditional submission based on approval status
        if (shouldSaveLocally) {
            // Save to local store for approved/rejected merchants
            setPendingContactInfo(normalizedData);
            router.back(); // Return to review screen
        } else if (canPartialSubmit) {
            // Partial submit for pending merchants (current behavior)
            try {
                await submitPartialData(payload);
                router.push(ROUTES.ONBOARDING.DOCUMENTS.NATIONAL_ID_FACE);
            } catch (error: any) {
                console.error('Failed to submit business contact:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
            }
        }
    }, [submitPartialData, router, accountType, shouldSaveLocally, canPartialSubmit, setPendingContactInfo]);


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