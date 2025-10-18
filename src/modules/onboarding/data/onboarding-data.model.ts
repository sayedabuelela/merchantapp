import { AccountType } from "../account-type/account-type.model";
import { BusinessContactFormData } from "../contact/contact.model";
import { Currency } from "../currency/currency.model";
import { BusinessLogoMetadata, Document } from "../documents/documents.model";

export type ApprovalStatus = "approved" | "rejected" | "pending" | "accepted" | "submitted";


export interface PayoutMethod {
    currencies: Currency[];
}

// --- Public & Merchant Data ---
export interface TermsAndConditions {
    ar: string;
    en: string;
}

export interface PublicData {
    businessIndustry: string;
    companyWebsite?: string | null;
    description?: string | null;
    legalCompanyName: string;
    socialFacebook?: string | null;
    socialInstagram?: string | null;
    socialLinkedIn?: string | null;
    socialTwitter?: string | null;
    storeName: string;
    termsAndConditions?: TermsAndConditions | null; // Optional as it might not always be set
    businessLogo?: BusinessLogoMetadata | null; // Moved from root of merchantInfo to here
    merchantAccoutType?: AccountType;
}

export interface MerchantInfo {
    businessLogo?: BusinessLogoMetadata | null; 
    merchantAccountType: AccountType;
    businessContactInfo: BusinessContactFormData;
    documents: Document[] | null;
    payoutMethod: PayoutMethod | null;
    publicData: PublicData | null; 
    // merchantStatus?: ApprovalStatus; // Not in your new example for merchantInfo
    // isLive?: boolean; // Not in your new example for merchantInfo
}

export interface Merchant {
    merchantInfo: MerchantInfo;
}

// --- Payment Methods & Root ---
export interface AllowedPaymentMethods {
    acceptedPaymentMethods: string[]; // Assuming string[], though empty in example
    acceptedBNPLMethods: string[]; // Assuming string[], though empty in example
    bnplSettlementTypes: Record<string, any>; // Empty object, use Record or a specific type if known
    sparkitEnabled: boolean;
    terminalCredentials: Record<string, any>; // Empty object
    transfersEnabled: boolean;
    transfersProviders: string[]; // Assuming string[], though empty in example
    operations: Record<string, any>; // Empty object
    acceptedCardProviders: string[]; // Assuming string[], though empty in example
    acceptedWalletProviders: string[]; // Assuming string[], though empty in example
}

export interface GlobalOnboardingData {
    isApprovedBusinessInfo: ApprovalStatus; // This seems to be at the root now
    merchant: Merchant;
    allowedPaymentMethods: AllowedPaymentMethods;
    hasAccounts: boolean;
    isLive: boolean; // This also seems to be at the root now
    // requestInfo object is gone from the root in your new example
}


export interface DownloadedFileObject {
    file: string; // base64 encoded file string
    type: string; // MIME type, e.g., "application/octet-stream", "image/jpeg"
    documentType: DocumentType; // e.g., "businessLogo", "nationalId"
}

export type FileDownloadApiResponse = DownloadedFileObject[];

export interface OnboardingDataPayload {
    merchantInfo: Partial<MerchantInfo>;
}

export interface OnboardingRequestPayload {
    merchantInfo: MerchantInfo;
    merchantStatus: ApprovalStatus;
}

export type PartialOnboardingData<T extends keyof MerchantInfo> = {
    merchantInfo: {
        [K in T]: NonNullable<MerchantInfo[T]>;
    }
}
