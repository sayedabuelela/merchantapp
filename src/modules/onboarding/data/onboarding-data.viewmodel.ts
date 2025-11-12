import { useApi } from "@/src/core/api/clients.hooks";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AccountType } from "../account-type/account-type.model";
import { accountTypeSelector, setAccountTypeSelector, useOnboardingStore } from "../onboarding.store";
import { GlobalOnboardingData, MerchantInfo, OnboardingDataPayload, OnboardingRequestPayload } from "./onboarding-data.model";
import { getOnboardingAllData, submitOnboardingRequestData, submitPartialOnboardingData } from "./onboarding-data.service";
import { ROUTES } from "@/src/core/navigation/routes";
import { router } from "expo-router";
import usePermissions from "@/src/modules/auth/hooks/usePermissions";

const useOnboardingDataViewModel = () => {
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const setAccountType = useOnboardingStore(setAccountTypeSelector);
    const accountType = useOnboardingStore(accountTypeSelector);
    const currentMerchantId = user?.merchantId;
    const queryClient = useQueryClient();
    const { canViewBusinessProfile } = usePermissions(user?.actions!, currentMerchantId);
    const onboardingDataQueryKey = ['onboarding-data', currentMerchantId];

    const {
        data: onboardingData,
        error: onboardingDataError,
        isLoading: onboardingDataLoading
    } = useQuery<GlobalOnboardingData>({
        queryKey: onboardingDataQueryKey,
        queryFn: () => getOnboardingAllData(api, currentMerchantId!),
        enabled: !!currentMerchantId && canViewBusinessProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const savePartialData = useCallback(async (data: OnboardingDataPayload) => {
        if (!currentMerchantId) {
            throw new Error("Merchant ID is required");
        }

        const result = await submitPartialOnboardingData(api, currentMerchantId, data);

        if (result) {
            queryClient.invalidateQueries({
                queryKey: onboardingDataQueryKey,
            });
        }

        return result;
    }, [api, currentMerchantId, queryClient, onboardingDataQueryKey]);

    const saveRequestData = useCallback(async (data: OnboardingRequestPayload) => {
        if (!currentMerchantId) {
            throw new Error("Merchant ID is required");
        }

        const result = await submitOnboardingRequestData(api, currentMerchantId, data);

        // if (result) {
        //     queryClient.invalidateQueries({
        //         queryKey: onboardingDataQueryKey,
        //     });
        // }

        return result;
    }, [api, currentMerchantId, queryClient, onboardingDataQueryKey]);

    const {
        mutateAsync: submitPartialData,
        isPending: isSubmittingPartialData,
        error: submitPartialDataError
    } = useMutation({
        mutationFn: savePartialData
    });

    const {
        mutateAsync: submitOnboadingRequest,
        isPending: isSubmittingOnboadingRequest,
        error: submitOnboadingRequestError
    } = useMutation({
        mutationFn: saveRequestData
    });
    const submitRequestHandler = async (merchantInfoData: MerchantInfo) => {
        const merchantInfo: MerchantInfo = {
            ...merchantInfoData,
            documents: merchantInfoData.documents?.map(obj => {
                const { id: _, storageInfo: __, fileInfo: ___, ...newObj } = obj
                return newObj;
            }) || null,
            payoutMethod: {
                currencies: merchantInfoData.payoutMethod?.currencies?.map(obj => {
                    if (obj.id) {
                        delete obj.id;
                    }
                    return obj;
                }) || [],
            },
        }
        if (merchantInfo.businessLogo) {
            delete merchantInfo.businessLogo;
        }
        await submitOnboadingRequest({
            merchantInfo,
            merchantStatus: "submitted"
        })
        queryClient.invalidateQueries({
            queryKey: onboardingDataQueryKey,
        });
        router.replace(ROUTES.TABS.BALANCE);
    }
    useEffect(() => {
        if (onboardingData) {
            const newAccountType: AccountType | undefined = onboardingData?.merchant?.merchantInfo?.publicData?.merchantAccoutType || onboardingData?.merchant?.merchantInfo?.merchantAccountType;
            // console.log('newAccountType : ', newAccountType);
            // console.log('accountType : ', onboardingData?.merchant?.merchantInfo?.publicData);
            if (newAccountType && newAccountType !== accountType) {
                setAccountType(newAccountType);
            }
        }
    }, [onboardingData, accountType, setAccountType]);

    // Edit permission logic based on approval status and isLive
    // Users can edit in two scenarios:
    // 1. Status is 'approved' AND isLive (to request changes to live account)
    // 2. Status is 'rejected' (to resubmit with corrections)
    const canEdit = (onboardingData?.isApprovedBusinessInfo === 'approved' && onboardingData?.isLive) ||
        onboardingData?.isApprovedBusinessInfo === 'rejected';
    const canSubmit = canEdit;
    const isUnderReview = onboardingData?.isApprovedBusinessInfo === 'submitted' ||
        onboardingData?.isApprovedBusinessInfo === 'pending';
    const isApproved = onboardingData?.isApprovedBusinessInfo === 'approved' && onboardingData?.isLive;
    const showActivationNote = !isApproved; // Hide when approved
    console.log('onboardingData?.isApprovedBusinessInfo : ', onboardingData?.isApprovedBusinessInfo);
    return {
        // Data access
        onboardingData,
        onboardingDataError,
        onboardingDataLoading,

        // For optimized mutations
        submitPartialData,
        isSubmittingPartialData,
        submitPartialDataError,

        // submitOnboadingRequest,
        isSubmittingOnboadingRequest,
        submitOnboadingRequestError,
        submitRequestHandler,

        // Expose the query key for components that need to interact with the cache
        onboardingDataQueryKey,

        // Edit permissions and status helpers
        canEdit,
        canSubmit,
        isUnderReview,
        isApproved,
        showActivationNote,
    };
};

export default useOnboardingDataViewModel;