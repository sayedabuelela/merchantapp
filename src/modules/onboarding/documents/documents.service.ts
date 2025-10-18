import { AxiosInstance, AxiosProgressEvent } from "axios";
import { DocumentsRequestData, FileDownloadApiResponse, FileUploadApiResponse, PickedFile } from "./documents.model";


export const getDocumentFileData = async (api: AxiosInstance, fileKey: string): Promise<FileDownloadApiResponse> => {
    console.log('getDocumentFileData fileKey : ', fileKey);

    const response = await api.get<FileDownloadApiResponse>(`/v2/merchants/files/download?${fileKey}`)

    return response.data;
}

export const uploadDocumentFileApi = async (
    api: AxiosInstance,
    merchantId: string,
    documentType: string,
    file: PickedFile,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<FileUploadApiResponse> => {
    const formData = new FormData();
    formData.append('image', {
        uri: file.uri,
        name: file.name,
        type: file.type,
    } as any);

    const endpoint = `/v2/merchants/upload?documentType=${encodeURIComponent(documentType)}`;

    console.log(`API CALL: Uploading to ${endpoint} for merchant ${merchantId}`);
    const response = await api.post(endpoint, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress
    });
    return response.data;
};

export const submitDocumentsApi = async (api: AxiosInstance, merchantId: string, data: DocumentsRequestData) => {
    const response = await api.post(`/v2/merchants/${merchantId}/onborad`, data);
    return response.data;
};