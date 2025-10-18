import { AxiosInstance } from "axios";
import { MarkAsPaidParams, ShareRequest, ShareResponse } from "../payment-links.model";

export const deletePaymentLink = async (api: AxiosInstance, id: string) => {
    return await api.delete(`v2/payment-link/${id}`);
}

export const cancelPaymentLink = async (api: AxiosInstance, id: string) => {
    return await api.post(`payment-links/${id}/cancel`);
}


export const sharePaymentLink = async (api: AxiosInstance, req: ShareRequest): Promise<ShareResponse> => {
    const res = await api.post("v2/payment-link/share", { ...req });
    return res.data;
}

export const markAsPaid = async (api: AxiosInstance, { id, reference, amount, currency, customerName, createdUserId }: MarkAsPaidParams) => {

    return await api.post(`v3/orders`, {
        apiOperation: "PAY",
        interactionSource: "ECOMMERCE",
        origin: {
            id
        },
        order: {
            reference,
            amount,
            currency,
        },
        paymentMethod: {
            type: "cash"
        },
        metaData: {
            kashierOriginType: "paymentLink",
            kashierOriginDetails: {
                name: "",
                id,
                customerName,
                createdUserId,
            }
        }
    });
}