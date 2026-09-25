// src/modules/notifications/notification.models.ts
export interface PushNotificationData {
    title?: string;
    body?: string;
    data?: {
        [key: string]: any;
        screen?: string;
        id?: string;
    };
}
export interface NotificationData {
    _id: string,
    createdAt: string,
    seen: boolean,
    data: {
        // Payment notifications
        customerName?: string,
        originId?: string,
        paymentType?: string,
        orderId?: string,
        transactionId?: string,
        amount?: string,
        currency?: string,
        // Instant settlement notifications
        type?: 'instantSettlement' | string,
        action?: 'declined' | 'transferred' | string,
        /** UUID — this is what the request details endpoint takes */
        instantSettlementRequestId?: string,
        /** Human ISR-… code, display/search only */
        requestId?: string,
        status?: string,
        declineReason?: string,
    },
    message: {
        ar: { title: string, body: string },
        en: { title: string, body: string },
    },
}

export interface NotificationPermissionStatus {
    granted: boolean;
    status: 'granted' | 'denied' | 'undetermined';
}

// Pagination metadata from API
export interface NotificationsPagination {
    page: number;
    totalPages: number;
    limit: number;
    totalDocs: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    unSeenCount: number;
}

// Inner response wrapper
export interface NotificationsInnerResponse {
    docs: NotificationData[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    unSeenCount: number;
}

// Middle response wrapper
export interface NotificationsBodyResponse {
    response: NotificationsInnerResponse;
    messages: string;
    status: string;
}

// Outer response wrapper
export interface NotificationsAPIResponse {
    response: {
        status: number;
        body: NotificationsBodyResponse;
    };
    messages: string;
    status: string;
}

// Final response type for useInfiniteQuery
export interface NotificationsResponse {
    data: NotificationData[];
    pagination: NotificationsPagination;
    unSeenCount: number;
}

// Infinity response type for React Query
export interface NotificationsInfinityResponse {
    pageParams: number[];
    pages: NotificationsResponse[];
}
