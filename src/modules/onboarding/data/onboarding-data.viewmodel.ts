import { useApi } from "@/src/core/api/clients.hooks";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AccountType } from "../account-type/account-type.model";
import { accountTypeSelector, approvalStatusSelector, setAccountTypeSelector, setApprovalStatusSelector, useOnboardingStore } from "../onboarding.store";
import { GlobalOnboardingData, MerchantInfo, OnboardingDataPayload, OnboardingRequestPayload } from "./onboarding-data.model";
import { getBusinessProfile, getOnboardingAllData, submitBusinessProfileUpdate, submitOnboardingRequestData, submitPartialOnboardingData } from "./onboarding-data.service";
import { ROUTES } from "@/src/core/navigation/routes";
import { router } from "expo-router";
import usePermissions from "@/src/modules/auth/hooks/usePermissions";

const useOnboardingDataViewModel = () => {
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const setAccountType = useOnboardingStore(setAccountTypeSelector);
    const accountType = useOnboardingStore(accountTypeSelector);
    const setApprovalStatus = useOnboardingStore(setApprovalStatusSelector);
    const storedApprovalStatus = useOnboardingStore(approvalStatusSelector);
    const currentMerchantId = user?.merchantId;
    const queryClient = useQueryClient();
    const { canViewBusinessProfile } = usePermissions(user?.actions!, currentMerchantId);
    const onboardingDataQueryKey = ['onboarding-data', currentMerchantId];

    // Use isLive from auth user to determine which endpoint to use
    // If isLive is true, user is approved/live - use business-profile endpoint
    // If isLive is false, user is pending/not live - use onborad endpoint
    const isUserLive = user?.isLive ?? false;

    const {
        data: onboardingData,
        error: onboardingDataError,
        isLoading: onboardingDataLoading
    } = useQuery<GlobalOnboardingData>({
        queryKey: onboardingDataQueryKey,
        queryFn: () => {
            if (isUserLive && currentMerchantId) {
                return getBusinessProfile(api, currentMerchantId);
            }
            return getOnboardingAllData(api);
        },
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

        // If user is live, use business-profile PUT endpoint
        if (isUserLive) {
            return await submitBusinessProfileUpdate(api, data);
        }

        // Use existing endpoint for pending merchants (initial submission)
        return await submitOnboardingRequestData(api, currentMerchantId, data);
    }, [api, currentMerchantId, isUserLive]);

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
        router.replace(ROUTES.TABS.HOME);
    }
    useEffect(() => {
        if (onboardingData) {
            const newAccountType: AccountType | undefined = onboardingData?.merchant?.merchantInfo?.publicData?.merchantAccoutType || onboardingData?.merchant?.merchantInfo?.merchantAccountType;
            if (newAccountType && newAccountType !== accountType) {
                setAccountType(newAccountType);
            }
            // Store approval status for endpoint selection on subsequent loads
            const newApprovalStatus = onboardingData.isApprovedBusinessInfo;
            if (newApprovalStatus && newApprovalStatus !== storedApprovalStatus) {
                setApprovalStatus(newApprovalStatus);
            }
        }
    }, [onboardingData, accountType, setAccountType, storedApprovalStatus, setApprovalStatus]);

    // Get merchantStatus from merchantInfo for UI logic
    const merchantStatus = onboardingData?.merchant?.merchantInfo?.merchantStatus;
    const isApprovedBusinessInfo = onboardingData?.isApprovedBusinessInfo;

    // Edit permission logic based on isApprovedBusinessInfo and isUserLive
    // Can edit when:
    // - New user onboarding (isLive=false, isApprovedBusinessInfo='pending')
    // - Live user with approved status (isLive=true, isApprovedBusinessInfo='approved')
    // - Rejected user (isApprovedBusinessInfo='rejected')
    // Cannot edit when:
    // - isApprovedBusinessInfo='submitted' (under review)
    // - isLive=true AND isApprovedBusinessInfo='pending' (live user with change request pending)
    const isLocked =
        isApprovedBusinessInfo === 'submitted' ||
        (isUserLive && isApprovedBusinessInfo === 'pending');
    const canEdit = !isLocked;

    // Can submit when not locked
    const canSubmit = !isLocked;

    // Under review when isApprovedBusinessInfo is 'submitted' or (live user with pending change request)
    const isUnderReview = isLocked;

    // Is approved when isApprovedBusinessInfo is 'approved'
    const isApproved = isApprovedBusinessInfo === 'approved';

    // Show activation note when not approved
    const showActivationNote = isApprovedBusinessInfo !== 'approved';
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
        merchantStatus,
    };
};

export default useOnboardingDataViewModel;