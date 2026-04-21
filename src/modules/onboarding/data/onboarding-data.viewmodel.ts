import { useApi } from "@/src/core/api/clients.hooks";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AccountType } from "../account-type/account-type.model";
import { accountTypeSelector, approvalStatusSelector, pendingEditsSelector, setAccountTypeSelector, setApprovalStatusSelector, useOnboardingStore } from "../onboarding.store";
import {
    ChangeRequestBusinessContactInfo,
    ChangeRequestPayload,
    ChangeRequestPublicData,
    GlobalOnboardingData,
    MerchantInfo,
    OnboardingDataPayload,
    OnboardingRequestPayload,
    PublicData,
} from "./onboarding-data.model";
import {
    dismissChangeRequest,
    getBusinessProfile,
    getOnboardingAllData,
    submitChangeRequest,
    submitOnboardingRequestData,
    submitPartialOnboardingData,
} from "./onboarding-data.service";
import { ROUTES } from "@/src/core/navigation/routes";
import { router } from "expo-router";
import usePermissions from "@/src/modules/auth/hooks/usePermissions";

const omitEmpty = <T extends Record<string, any>>(obj: T): Partial<T> => {
    const result: Partial<T> = {};
    (Object.keys(obj) as (keyof T)[]).forEach((key) => {
        const value = obj[key];
        if (value !== undefined && value !== null && value !== "") {
            result[key] = value;
        }
    });
    return result;
};

const useOnboardingDataViewModel = () => {
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const setAccountType = useOnboardingStore(setAccountTypeSelector);
    const accountType = useOnboardingStore(accountTypeSelector);
    const setApprovalStatus = useOnboardingStore(setApprovalStatusSelector);
    const storedApprovalStatus = useOnboardingStore(approvalStatusSelector);
    const pendingEdits = useOnboardingStore(pendingEditsSelector);
    const clearPendingEdits = useOnboardingStore((state) => state.clearPendingEdits);
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

    const saveOnboardingRequest = useCallback(async (data: OnboardingRequestPayload) => {
        if (!currentMerchantId) {
            throw new Error("Merchant ID is required");
        }
        return await submitOnboardingRequestData(api, currentMerchantId, data);
    }, [api, currentMerchantId]);

    const saveChangeRequestPayload = useCallback(async (data: ChangeRequestPayload) => {
        return await submitChangeRequest(api, data);
    }, [api]);

    const dismissActiveRequest = useCallback(async (requestId: string) => {
        return await dismissChangeRequest(api, requestId);
    }, [api]);

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
        mutationFn: saveOnboardingRequest
    });

    const {
        mutateAsync: submitChangeRequestAsync,
        isPending: isSubmittingChangeRequest,
        error: submitChangeRequestError,
    } = useMutation({
        mutationFn: saveChangeRequestPayload,
    });

    const {
        mutateAsync: dismissChangeRequestAsync,
        isPending: isDismissingChangeRequest,
        error: dismissChangeRequestError,
    } = useMutation({
        mutationFn: dismissActiveRequest,
    });

    const buildChangeRequestPayload = (serverMerchantInfo: MerchantInfo): ChangeRequestPayload => {
        const serverPublicData = serverMerchantInfo.publicData;
        const mergedPublicData: PublicData = {
            ...(serverPublicData ?? {}),
            ...(pendingEdits.publicData ?? {}),
        } as PublicData;

        const contact = pendingEdits.businessContactInfo ?? serverMerchantInfo.businessContactInfo;
        const termsAndConditions = mergedPublicData?.termsAndConditions ?? undefined;
        const businessLogoKey = pendingEdits.businessLogo?.storageInfo?.key
            ?? serverPublicData?.businessLogo?.storageInfo?.key;

        const publicDataPayload = omitEmpty<ChangeRequestPublicData>({
            businessIndustry: mergedPublicData.businessIndustry,
            legalCompanyName: mergedPublicData.legalCompanyName,
            storeName: mergedPublicData.storeName,
            companyWebsite: mergedPublicData.companyWebsite ?? undefined,
            description: mergedPublicData.description ?? undefined,
            socialLinkedIn: mergedPublicData.socialLinkedIn ?? undefined,
            socialFacebook: mergedPublicData.socialFacebook ?? undefined,
            socialTwitter: mergedPublicData.socialTwitter ?? undefined,
            socialInstagram: mergedPublicData.socialInstagram ?? undefined,
        }) as ChangeRequestPublicData;

        const contactPayload = omitEmpty<ChangeRequestBusinessContactInfo>({
            country: contact.country,
            governorate: contact.governorate,
            addressLine1: contact.addressLine1,
            addressLine2: contact.addressLine2 ?? undefined,
            businessPhone: contact.businessPhone,
            businessEmail: contact.businessEmail,
            hotlineNumber: contact.hotlineNumber ?? undefined,
        }) as ChangeRequestBusinessContactInfo;

        return {
            publicData: publicDataPayload,
            businessContactInfo: contactPayload,
            ...(termsAndConditions ? { termsAndConditions } : {}),
            ...(businessLogoKey ? { businessLogo: businessLogoKey } : {}),
        };
    };

    const submitRequestHandler = async () => {
        if (!onboardingData?.merchant.merchantInfo) return;
        const serverMerchantInfo = onboardingData.merchant.merchantInfo;

        if (isUserLive) {
            const payload = buildChangeRequestPayload(serverMerchantInfo);
            await submitChangeRequestAsync(payload);
            clearPendingEdits();
            queryClient.invalidateQueries({ queryKey: onboardingDataQueryKey });
            router.replace(ROUTES.TABS.HOME);
            return;
        }

        // Non-live: initial onboarding submission (unchanged)
        const serverPublicData = serverMerchantInfo.publicData;
        const mergedMerchantInfo: MerchantInfo = {
            ...serverMerchantInfo,
            publicData: pendingEdits.publicData && serverPublicData
                ? { ...serverPublicData, ...pendingEdits.publicData }
                : serverPublicData,
            businessContactInfo: pendingEdits.businessContactInfo
                ?? serverMerchantInfo.businessContactInfo,
            payoutMethod: pendingEdits.currencies
                ? { currencies: pendingEdits.currencies }
                : serverMerchantInfo.payoutMethod,
            documents: pendingEdits.documents
                ?? serverMerchantInfo.documents,
        };
        if (pendingEdits.businessLogo) {
            mergedMerchantInfo.businessLogo = pendingEdits.businessLogo;
        }

        const payloadMerchantInfo: MerchantInfo = {
            ...mergedMerchantInfo,
            documents: mergedMerchantInfo.documents?.map(obj => {
                const { id: _, storageInfo: __, fileInfo: ___, ...rest } = obj;
                return rest;
            }) || null,
            payoutMethod: {
                currencies: mergedMerchantInfo.payoutMethod?.currencies?.map(obj => {
                    if (obj.id) {
                        delete obj.id;
                    }
                    return obj;
                }) || [],
            },
        };
        if (payloadMerchantInfo.businessLogo) {
            delete payloadMerchantInfo.businessLogo;
        }

        await submitOnboadingRequest({
            merchantInfo: payloadMerchantInfo,
            merchantStatus: "submitted",
        });
        clearPendingEdits();
        queryClient.invalidateQueries({ queryKey: onboardingDataQueryKey });
        router.replace(ROUTES.TABS.HOME);
    };

    const dismissChangeRequestHandler = async (requestId: string) => {
        await dismissChangeRequestAsync(requestId);
        clearPendingEdits();
        queryClient.invalidateQueries({ queryKey: onboardingDataQueryKey });
    };

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
    const activeRequest = onboardingData?.activeRequest;

    const hasPendingChangeRequest = activeRequest?.status === 'pending';
    const hasRejectedChangeRequest = activeRequest?.status === 'rejected';

    // Edit permission logic
    // Locked when:
    // - isApprovedBusinessInfo === 'submitted' (initial onboarding under review)
    // - live user with pending change request (activeRequest.status === 'pending')
    // - live user with rejected change request (must dismiss first)
    // - live user whose initial profile is pending (legacy case with no activeRequest)
    const isLocked =
        isApprovedBusinessInfo === 'submitted' ||
        hasPendingChangeRequest ||
        hasRejectedChangeRequest ||
        (isUserLive && isApprovedBusinessInfo === 'pending' && !activeRequest);
    const canEdit = !isLocked;

    // Can submit when not locked
    const canSubmit = !isLocked;

    // Under review when isApprovedBusinessInfo is 'submitted' or pending change request
    const isUnderReview = isApprovedBusinessInfo === 'submitted' || hasPendingChangeRequest;

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

        // Request submission (initial onboarding for non-live users)
        isSubmittingOnboadingRequest,
        submitOnboadingRequestError,

        // Change request submission (live users)
        isSubmittingChangeRequest,
        submitChangeRequestError,

        // Unified submit handler (routes to correct endpoint based on isUserLive)
        submitRequestHandler,
        isSubmitting: isSubmittingOnboadingRequest || isSubmittingChangeRequest,
        submitError: submitOnboadingRequestError || submitChangeRequestError,

        // Dismiss rejected change request
        dismissChangeRequest: dismissChangeRequestHandler,
        isDismissingChangeRequest,
        dismissChangeRequestError,

        // Change request state
        activeRequest,
        hasPendingChangeRequest,
        hasRejectedChangeRequest,

        // Expose the query key for components that need to interact with the cache
        onboardingDataQueryKey,

        // Edit permissions and status helpers
        canEdit,
        canSubmit,
        isUnderReview,
        isApproved,
        showActivationNote,
        merchantStatus,
        isUserLive,
    };
};

export default useOnboardingDataViewModel;
