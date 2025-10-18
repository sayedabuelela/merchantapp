import { MerchantInfo } from "../onboarding/data/onboarding-data.model";

export enum PaymentStatus {
    UNPAID = "unpaid",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    INITIATED = "initiated",
    AWAITING_APPROVAL = "awaiting_approval",
    REJECTED = "rejected"
}

export enum PaymentType {
    SIMPLE = "simple",
    PROFESSIONAL = "professional"
}

export interface LastShareStatus {
    email: {
        error: string | null;
        isClicked: boolean;
        isOpened: boolean;
        key: string | null;
        sendGridWebhookId: string | null;
        status: string | null;
        xMessageId: string | null;
    },
    lastShareGeneratedId: string | null;
    sms: {
        error: string | null;
        isClicked: boolean;
        isOpened: boolean;
        key: string | null;
        requestId: string | null;
        smsDeliveryStatusId: string | null;
        status: string | null;
    }
}

export interface ExtraFee {
    name: string;
    flatFee: number;
    rate: number;
}

export interface InvoiceItem {
    _id: string;
    description: string;
    unitPrice: number;
    quantity: number;
    subTotal: number;
}


export interface PaymentLinkResponse {
    message: string;
    data: PaymentLink;
}
export interface PaymentLink {
    _id: string;
    description: string;
    paymentStatus: PaymentStatus; // extend if more statuses
    dueDate: string;
    isSuspendedPayment: boolean;
    currency: string;
    paymentLinkId: string;
    isDeleted: boolean;
    customer: { name: string };
    needApproval?: boolean;
    merchantId: string;
    paymentType: PaymentType; // extend if more
    totalAmountWithoutFees: number;
    totalAmount: number;
    availableAmountForRefund: number;
    state: string;
    customerName: string;
    paymentRequestId: string;
    creationDate: string; // ISO string
    merchantInfo: MerchantInfo;
    createdByUserId: string;
    extraFees: ExtraFee[];
    invoiceItems: InvoiceItem[];
    invoiceReferenceId?: string;
    referenceId?: string;
    isChecker?: boolean;
    lastShareStatus: LastShareStatus;
}

export interface PaymentLinksPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaymentLinksResponse {
    message: string;
    data: PaymentLink[];
    pagination: PaymentLinksPagination;
}
// {"pageParams": [1], "pages": [{"data": [Array], "message": "Payment links retrieved successfully", "pagination": [Object]}]}
export interface PaymentLinksInfinityResponse {
    pageParams: number;
    pages: {
        data: PaymentLink[];
        message: string;
        pagination: PaymentLinksPagination;
    }[]
}

export interface FetchPaymentLinksParams {
    currency?: string;
    state?: string;
    startDueDate?: string;
    endDueDate?: string;
    startAmountRange?: number;
    endAmountRange?: number;
    startDate?: string;
    endDate?: string;
    paymentStatus?: string | null;
    paymentType?: string | null;
    search?: string;
    labels?: string | null;
    page?: number;
    limit?: number;
}

export interface MarkAsPaidParams {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    customerName: string;
    createdUserId: string;
}

export type ShareOperation = "email" | "phone";

export interface ShareRequestBase {
    operation: ShareOperation;
    urlIdentifier: string;
    key: string;
}

export interface ShareEmailRequest extends ShareRequestBase {
    operation: "email";
    key: string; // email
}

export interface SharePhoneRequest extends ShareRequestBase {
    operation: "phone";
    key: string; // phone number
    countryCode: string;
}

export type ShareRequest = ShareEmailRequest | SharePhoneRequest;

export interface ShareResponse {
    success: boolean;
    message?: string;
}