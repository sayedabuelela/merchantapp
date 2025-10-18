import { useApi } from "@/src/core/api/clients.hooks";
import { ROUTES } from "@/src/core/navigation/routes";
import { getOnboardingAllData } from "@/src/modules/onboarding/data/onboarding-data.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { selectUser, useAuthStore } from "../../auth/auth.store";
import { AccountType } from "../account-type/account-type.model";
import useOnboardingDataViewModel from "../data/onboarding-data.viewmodel";
import { BusinessLogoMetadata, PickedFile } from "../documents/documents.model";
import useDocumentViewModel from "../documents/documents.viewmodel";
import { accountTypeSelector, useOnboardingStore } from "../onboarding.store";
import { OnboardingFormState } from "../types";
import { BusinessDetailsFormData, BusinessDetailsRequestData, BusinessIndustry } from "./business.model";
import { getBusinessIndustries } from "./business.service";

const useBusinessViewModel = () => {
    const router = useRouter();
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const accountType = useOnboardingStore(accountTypeSelector);
    const currentMerchantId = user?.merchantId;
    const [selectedIndustry, setSelectedIndustry] = useState<BusinessIndustry | undefined>(undefined);
    const [selectedSector, setSelectedSector] = useState<string>('');
    const { onboardingDataQueryKey, submitPartialData, isSubmittingPartialData, submitPartialDataError } = useOnboardingDataViewModel();
    const {
        data: businessDetailsData,
        isLoading: isLoadingGlobalData,
        error: fetchError,
        isFetching: isFetchingGlobalData,
    } = useQuery({
        queryKey: onboardingDataQueryKey,
        queryFn: () => currentMerchantId
            ? getOnboardingAllData(api, currentMerchantId)
            : Promise.reject(new Error("No merchant ID available")),
        select: (allFetchedData) => {
            const publicData = allFetchedData?.merchant?.merchantInfo?.publicData;
            const businessLogo = allFetchedData?.merchant?.merchantInfo?.businessLogo;
            return { ...publicData, businessLogo };
        },
        enabled: !!currentMerchantId,
        staleTime: 20 * 60 * 1000, // 20 minutes,
        // staleTime: Infinity,
    });
    const {
        data: businessIndustries,
        isLoading: isLoadingBusinessIndustries,
        error: fetchBusinessIndustriesError,
        isFetching: isFetchingBusinessIndustries,
    } = useQuery({
        queryKey: ['business-industries'],
        queryFn: () => getBusinessIndustries(api),
        staleTime: 120 * 60 * 1000, // 2 hours
    });

    const {
        displayableFileUri: businessLogoDataUri,
        isLoadingDocument: isLoadingLogo,
        existingFileMetadata: logoMetadata,
        uploadDocumentAsync,
        isUploading,
        uploadError,
    } = useDocumentViewModel({ documentType: 'businessLogo' });

    // const { mutateAsync: saveBusinessDetailsMutation, isPending: isSavingBusinessDetails, error: saveBusinessDetailsError } = useMutation({
    //     mutationFn: async (data: BusinessDetailsRequestData) => await saveBusinessDetails(api, currentMerchantId!, data),
    // });

    useEffect(() => {
        if (businessIndustries && businessDetailsData?.businessIndustry) {
            initializeIndustryAndSector(businessDetailsData.businessIndustry);
        }
    }, [businessIndustries, businessDetailsData]);

    const initializeIndustryAndSector = (existingSectorValue: string) => {
        if (!businessIndustries) return;

        const industry = businessIndustries.find(industry =>
            industry.sectors.some(sector => sector.value === existingSectorValue || sector.en === existingSectorValue)
        );

        if (industry) {
            setSelectedIndustry(industry);
            const sector = industry.sectors.find(
                sector => sector.value === existingSectorValue || sector.en === existingSectorValue
            );
            setSelectedSector(sector?.value || '');
        }
    };

    const handleIndustryChange = (industry: BusinessIndustry) => {
        setSelectedIndustry(industry);
        setSelectedSector('');
    };

    const handleSectorChange = (sectorValue: string) => {
        setSelectedSector(sectorValue);
    };

    const getSelectedSectorName = (language: 'en' | 'ar' = 'en'): string => {
        if (!selectedIndustry || !selectedSector) return '';

        const sector = selectedIndustry.sectors.find(s => s.value === selectedSector);
        return sector ? sector[language] : '';
    };

    // const prepareFormDataForSubmission = (formData: BusinessDetailsRequestData): BusinessDetailsRequestData => {
    //     return {
    //         ...formData,
    //         businessIndustry: selectedSector
    //     };
    // };
    const createBusinessLogoMetadata = async (
        dirtyFields: Record<string, boolean>,
        logo: PickedFile | undefined
    ): Promise<BusinessLogoMetadata> => {
        return {
            documentType: 'businessLogo',
            isDeleted: false,
            isReviewd: false,
            key: dirtyFields.businessLogo
                ? (await uploadDocumentAsync({ pickedFile: logo as PickedFile })).body.imageTitle
                : logoMetadata?.key || ''
        };
    };

    const submitBusinessDetailsForm = async (
        data: BusinessDetailsFormData,
        formState: OnboardingFormState
    ) => {
        const { dirtyFields, isDirty } = formState;

        if (!isDirty) {
            router.push(ROUTES.ONBOARDING.CONTACT);
            return;
        }

        const { businessLogo, businessSector, ...rest } = data;

        const payload: BusinessDetailsRequestData = {
            merchantInfo: {
                merchantAccountType: accountType as AccountType,
                publicData: {
                    ...rest,
                    businessIndustry: selectedSector,
                }
            }
        };

        const payloadBusinessLogo: BusinessLogoMetadata = {
            documentType: 'businessLogo',
            isDeleted: false,
            isReviewd: false,
            key: ''
        };

        if (dirtyFields.businessLogo && businessLogo) {
            try {
                const { body: { imageTitle } } = await uploadDocumentAsync({
                    pickedFile: businessLogo as PickedFile
                });
                payloadBusinessLogo.key = imageTitle;
            } catch (error) {
                console.error('Logo upload failed:', error);
                return;
            }
        } else if (logoMetadata?.key) {
            payloadBusinessLogo.key = logoMetadata.key;
        }

        payload.merchantInfo.publicData.businessLogo = payloadBusinessLogo;

        try {
            await submitPartialData(payload);
            router.push(ROUTES.ONBOARDING.CONTACT);
        } catch (error) {
            console.error('Failed to submit business details:', error);
        }
    };

    return {
        businessDetailsData,
        isLoadingGlobalData,
        fetchError,
        isFetchingGlobalData,
        businessIndustries,
        isLoadingBusinessIndustries,
        fetchBusinessIndustriesError,
        isFetchingBusinessIndustries,
        selectedIndustry,
        selectedSector,
        handleIndustryChange,
        handleSectorChange,
        getSelectedSectorName,
        initializeIndustryAndSector,
        submitBusinessDetailsForm,
        businessLogoDataUri,
        isLoadingLogo,
        isSubmittingPartialData,
        submitPartialDataError,
        isUploadingLogo: isUploading,
        logoUploadError: uploadError,
    };
};

export default useBusinessViewModel;
