import { AxiosInstance } from "axios";
import { BusinessProfileResponse, ChangeRequestPayload, GlobalOnboardingData, OnboardingDataPayload } from "./onboarding-data.model";

/**
 * Adapts the BusinessProfileResponse format to the existing GlobalOnboardingData format.
 * This ensures backward compatibility with all existing consumers.
 */
const adaptBusinessProfileToGlobalOnboardingData = (data: BusinessProfileResponse): GlobalOnboardingData => {
    return {
        isApprovedBusinessInfo: data.requestInfo.isApprovedBusinessInfo,
        merchant: data.merchant,
        // business-profile endpoint doesn't return these, provide defaults
        allowedPaymentMethods: {
            acceptedPaymentMethods: [],
            acceptedBNPLMethods: [],
            bnplSettlementTypes: {},
            sparkitEnabled: false,
            terminalCredentials: {},
            transfersEnabled: false,
            transfersProviders: [],
            operations: {},
            acceptedCardProviders: [],
            acceptedWalletProviders: [],
        },
        hasAccounts: false,
        // isLive is inside merchantInfo for business-profile response
        isLive: data.merchant.merchantInfo.isLive ?? false,
        activeRequest: data.activeRequest,
    };
};

/**
 * Fetches onboarding data for pending/submitted merchants.
 * Uses GET /v2/merchants/onborad
 */
export const getOnboardingAllData = async (api: AxiosInstance): Promise<GlobalOnboardingData> => {
    console.log('getOnboardingAllData CALLED', new Error().stack);
    const response = await api.get(`/v2/merchants/onborad`);
    return response.data.body;
};

/**
 * Fetches business profile data for approved/rejected merchants.
 * Uses GET /v2/merchants/{merchantId}/business-profile
 */
export const getBusinessProfile = async (api: AxiosInstance, merchantId: string): Promise<GlobalOnboardingData> => {
    const response = await api.get<BusinessProfileResponse>(`/v2/merchants/${merchantId}/business-profile`);
    return adaptBusinessProfileToGlobalOnboardingData(response.data);
}

export const submitPartialOnboardingData = async <T extends OnboardingDataPayload>(
    api: AxiosInstance,
    merchantId: string,
    data: T
): Promise<any> => {
    // if (data.merchantInfo.businessContactInfo) {
    //     // Specifically simulate error for contact form submission
    //     throw new Error("Failed to save contact information. Please try again later.");
    // }
    const response = await api.post(`/v2/merchants/${merchantId}/onborad`, data);
    return response.data;
}

export const submitOnboardingRequestData = async <T extends OnboardingDataPayload>(
    api: AxiosInstance,
    merchantId: string,
    data: T
): Promise<any> => {
    const response = await api.post(`/v2/merchants/${merchantId}/onborad/submit`, data);
    return response.data;
}

// /**
//  * Submit business profile update for approved/rejected merchants.
//  * Uses PUT /v2/merchants/business-profile endpoint.
//  * DEPRECATED: replaced by submitChangeRequest (POST /v2/merchants/change-requests).
//  */
// export const submitBusinessProfileUpdate = async (
//     api: AxiosInstance,
//     data: OnboardingRequestPayload
// ): Promise<any> => {
//     const response = await api.put('/v2/merchants/business-profile', data);
//     return response.data;
// }

// /**
//  * Deactivates currency operations (router and converter) before submitting a change request.
//  * Must be called before submitBusinessProfileUpdate for live users.
//  * Uses POST /v2/merchants/changeCurrencyOperationsActivation
//  * DEPRECATED: new change-requests endpoint handles this server-side.
//  */
// export const changeCurrencyOperationsActivation = async (
//     api: AxiosInstance
// ): Promise<any> => {
//     const response = await api.post('/v2/merchants/changeCurrencyOperationsActivation', {
//         currencyRouterActive: false,
//         currencyConverterActive: false
//     });
//     return response.data;
// }

/**
 * Submit a change request for approved live merchants.
 * Uses POST /v2/merchants/change-requests
 */
export const submitChangeRequest = async (
    api: AxiosInstance,
    data: ChangeRequestPayload
): Promise<any> => {
    const response = await api.post('/v2/merchants/change-requests', data);
    return response.data;
}

/**
 * Dismiss a change request (hide it from the merchant).
 * Uses PATCH /v2/merchants/change-requests/{requestId}
 */
export const dismissChangeRequest = async (
    api: AxiosInstance,
    requestId: string
): Promise<any> => {
    const response = await api.patch(`/v2/merchants/change-requests/${requestId}`, {
        visibleToMerchant: false,
    });
    return response.data;
}

// export const sendPartialOnboardingData = async (api: AxiosInstance, merchantId: string, data: CurrencyRequestData) => {
//     return submitOnboardingData(api, merchantId, data);
// }

// const allDocumentMetadatas: (OnboardingDocumentMetadata | BusinessLogoMetadata)[] = React.useMemo(() => {
//     if (!onboardingData?.merchant?.merchantInfo) return [];

//     const docs = onboardingData.merchant.merchantInfo.documents?.filter(doc => !doc.isDeleted) || [];
//     const logo = onboardingData.merchant.merchantInfo.publicData?.businessLogo;

//     const combined: (OnboardingDocumentMetadata | BusinessLogoMetadata)[] = [...docs];
//     if (logo && !logo.isDeleted) {
//         // Add a 'documentType' to logo metadata if it doesn't have one but your list component expects it
//         // Or ensure your BusinessLogoMetadata type includes documentType:"businessLogo"
//         combined.unshift({ ...logo, documentType: logo.documentType || "businessLogo" } as BusinessLogoMetadata);
//     }
//     return combined;
// }, [onboardingData]);