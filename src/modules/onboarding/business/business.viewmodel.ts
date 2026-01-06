import { useApi } from "@/src/core/api/clients.hooks";
import { ROUTES } from "@/src/core/navigation/routes";
import { getOnboardingAllData } from "@/src/modules/onboarding/data/onboarding-data.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { selectUser, useAuthStore } from "../../auth/auth.store";
import { AccountType } from "../account-type/account-type.model";
import useOnboardingDataViewModel from "../data/onboarding-data.viewmodel";
import { PickedFile } from "../documents/documents.model";
import useDocumentViewModel from "../documents/documents.viewmodel";
import { accountTypeSelector, useOnboardingStore } from "../onboarding.store";
import { OnboardingFormState } from "../types";
import { BusinessDetailsFormData, BusinessDetailsRequestData, BusinessIndustry } from "./business.model";
import { getBusinessIndustries } from "./business.service";
import useApprovalBasedSubmit from "../hooks/useApprovalBasedSubmit";

const useBusinessViewModel = () => {
    const router = useRouter();
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const accountType = useOnboardingStore(accountTypeSelector);
    const setPendingPublicData = useOnboardingStore((state) => state.setPendingPublicData);
    const setPendingBusinessLogo = useOnboardingStore((state) => state.setPendingBusinessLogo);
    const currentMerchantId = user?.merchantId;
    const [selectedIndustry, setSelectedIndustry] = useState<BusinessIndustry | undefined>(undefined);
    const [selectedSector, setSelectedSector] = useState<string>('');
    const { onboardingDataQueryKey, submitPartialData, isSubmittingPartialData, submitPartialDataError } = useOnboardingDataViewModel();
    const { shouldSaveLocally, canPartialSubmit } = useApprovalBasedSubmit();
    const {
        data: businessDetailsData,
        isLoading: isLoadingGlobalData,
        error: fetchError,
        isFetching: isFetchingGlobalData,
    } = useQuery({
        queryKey: onboardingDataQueryKey,
        queryFn: () => getOnboardingAllData(api),
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

    const submitBusinessDetailsForm = async (
        data: BusinessDetailsFormData,
        formState: OnboardingFormState
    ) => {
        const { dirtyFields, isDirty } = formState;

        // If no changes and in pending mode, just navigate forward
        if (!isDirty && canPartialSubmit) {
            router.push(ROUTES.ONBOARDING.CONTACT);
            return;
        }

        // If no changes and in local save mode, just go back
        if (!isDirty && shouldSaveLocally) {
            router.back();
            return;
        }

        const { businessLogo, businessSector, ...rest } = data;

        // Normalize optional fields to empty strings (API expects strings, not undefined)
        const normalizedPublicData = {
            legalCompanyName: rest.legalCompanyName,
            storeName: rest.storeName,
            description: rest.description ?? "",
            businessIndustry: selectedSector,
            companyWebsite: rest.companyWebsite ?? "",
            socialTwitter: rest.socialTwitter ?? "",
            socialLinkedIn: rest.socialLinkedIn ?? "",
            socialFacebook: rest.socialFacebook ?? "",
            socialInstagram: rest.socialInstagram ?? "",
            termsAndConditions: rest.termsAndConditions,
        };

        const payload: BusinessDetailsRequestData = {
            merchantInfo: {
                merchantAccountType: accountType as AccountType,
                publicData: normalizedPublicData
            }
        };

        let logoKey = '';

        // Logo uploads always go to API (need the key)
        if (dirtyFields.businessLogo && businessLogo) {
            try {
                const { body: { imageTitle } } = await uploadDocumentAsync({
                    pickedFile: businessLogo as PickedFile
                });
                logoKey = imageTitle;
            } catch (error) {
                console.error('Logo upload failed:', error);
                return;
            }
        } else if (logoMetadata?.key) {
            logoKey = logoMetadata.key;
        }

        if (logoKey) {
            payload.merchantInfo.publicData.businessLogo = {
                documentType: 'businessLogo',
                isDeleted: false,
                isReviewd: false,
                key: logoKey
            };
        }

        console.log('payload : ', payload);

        // Conditional submission based on approval status
        if (shouldSaveLocally) {
            // Save to local store for approved/rejected merchants
            setPendingPublicData(normalizedPublicData);
            if (logoKey) {
                setPendingBusinessLogo({
                    documentType: 'businessLogo',
                    isDeleted: false,
                    isReviewd: false,
                    key: logoKey
                });
            }
            router.back(); // Return to review screen
        } else if (canPartialSubmit) {
            // Partial submit for pending merchants (current behavior)
            try {
                await submitPartialData(payload);
                router.push(ROUTES.ONBOARDING.CONTACT);
            } catch (error) {
                console.error('Failed to submit business details:', error);
            }
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
