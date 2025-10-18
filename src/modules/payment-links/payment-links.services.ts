import { AxiosInstance } from "axios";
import { FetchPaymentLinksParams, PaymentLink, PaymentLinkResponse, PaymentLinksResponse, ShareRequest, ShareResponse } from "./payment-links.model";
import { CreatePaymentLinkTypes } from "./payment-links.scheme";

export const getPaymentLinks = async (api: AxiosInstance, params: FetchPaymentLinksParams): Promise<PaymentLinksResponse> => {
    const response = await api.get<PaymentLinksResponse>(
        "/v2/payment-link",
        { params }
    );
    return response.data;
}

export const getPaymentLink = async (api: AxiosInstance, paymentId: string): Promise<PaymentLinkResponse> => {
    const response = await api.get<PaymentLinkResponse>(
        `/v2/payment-link/${paymentId}`
    );
    return response.data;
}

export const updatePaymentLink = async (api: AxiosInstance, paymentId: string, data: CreatePaymentLinkTypes): Promise<PaymentLinkResponse> => {
    console.log("Updating payment link", data);
    const response = await api.put<PaymentLinkResponse>(
        `/v2/payment-link/${paymentId}`,
        { paymentLink: { state: "submitted", ...data } }
    );
    return response.data;
}

export const createPaymentLink = async (api: AxiosInstance, data: CreatePaymentLinkTypes): Promise<PaymentLinkResponse> => {
    const response = await api.post<PaymentLinkResponse>(
        "/v2/payment-link",
        {
            isManualCapture: false,
            state: "submitted",
            description: '',
            ...data
        }
    );
    return response.data;   
}

