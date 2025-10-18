import { AxiosInstance } from "axios";
import { CurrencyRequestData } from "../currency/currency.model";
import { GlobalOnboardingData, OnboardingDataPayload } from "./onboarding-data.model";

export const getOnboardingAllData = async (api: AxiosInstance, merchantId: string): Promise<GlobalOnboardingData> => {
    const response = await api.get<{ body: GlobalOnboardingData }>(`/v2/merchants/${merchantId}/onborad`)
    console.log('response.data', response.data);
    return response.data.body;
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