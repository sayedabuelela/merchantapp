import { AxiosInstance } from "axios";
import { FetchPaymentLinksParams, PaymentLinksResponse } from "../payment-links.model";

export const getPaymentLinks = async (api: AxiosInstance, params: FetchPaymentLinksParams): Promise<PaymentLinksResponse> => {
    const response = await api.get<PaymentLinksResponse>(
        "/v2/payment-link",
        { params }
    );
    return response.data;
}