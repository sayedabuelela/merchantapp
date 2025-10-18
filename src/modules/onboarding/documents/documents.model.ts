import { AccountType } from "../account-type/account-type.model";
import { ApprovalStatus } from "../data/onboarding-data.model";

export type DocumentType =
    | "businessLogo"
    | "nationalId"
    | "nationalIdBack"
    | "utilityBill"
    | "taxId"
    | "commercialTaxId"
    | "others";


export type FileInfo = {
    uri: string;
    name: string;
    type: string;
    size?: number;
};
export interface DownloadedFileObject {
    file: string;
    type: string;
    documentType: string;
}

export interface Document {
    documentType: DocumentType;
    isDeleted: boolean;
    isReviewd: boolean | ApprovalStatus;
    key: string;
    id?: string;
    fileInfo?: {
        documentType: DocumentType;
        name: string;
        type: string;
        uploadedDate: number;
    };
    storageInfo?: {
        Bucket: string;
        Key: string;
        Location: string;
        key: string;
    }
}

export interface BusinessLogoMetadata extends Document {
    documentType: "businessLogo";
}

export type FileUploadApiResponse = { body: { imageTitle: string }, message: string }
export type FileDownloadApiResponse = { result: DownloadedFileObject[] }

export interface PickedFile {
    uri: string;
    name: string;
    type: string;
    base64?: string;
    size?: number;
}

export interface DocumentViewModelProps {
    documentType: DocumentType;
}
export interface UploadProgressState {
    percentage: number;
    loaded: number;
    total: number;
    status: 'idle' | 'uploading' | 'success' | 'error' | 'cancelled';
    error?: string;
}

export type DocumentsRequestData = {
    merchantInfo: {
        merchantAccountType: AccountType;
        documents: Document[];
    },
}