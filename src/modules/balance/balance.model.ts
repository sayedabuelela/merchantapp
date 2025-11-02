export interface AccountStatistics {
    balanceOverview: {
        availableBalance: number,
        totalBalance: number
    },
    upcomingValueDates: Array<{
        amount: number,
        date: string
    }>
}

export interface TransfersStatistics {
    onGoingTransfersAmount: number,
    recentTransfers: Array<{
        amount: number,
        transfersCount: number,
        date: string
    }>
}

export type UpcomingValueDate = {
    amount: number;
    date: string;
};

export type GroupedUpcomingDates = {
    today?: UpcomingValueDate;
    tomorrow?: UpcomingValueDate;
    later: UpcomingValueDate[];
};

export interface Account {
    availableBalance: number,
    accountsCount: number,
    accountName: string,
    accountId: string
}

export interface AccountsListResponse {
    data: Account[];
    message: string;
    pagination: {
        total: number,
        limit: number,
        page: number,
        pages: number
    }
}

export interface AccountsListParams {
    limit?: number;
    sortBy?: string;
    sortType?: number;
    page?: number;
}

// Activity Types
export type ActivityType = 'payout' | 'transfer' | 'all';

export interface Activity {
    id: string;
    origin: string;
    amount: number;
    currency: string;
    accountName: string;
    destination?: string; // For payouts (bank account)
    source?: string; // For transfers
    date: string;
    status: 'completed' | 'pending' | 'failed';
    merchantId: string;
    operation: string;
    originReference: string;
    originalAmount: number;
    totalBalanceAfter: number;
    totalBalanceBefore: number;
    updatedAt: string;
    valueDate: string;
    __v: number;
    _id: string;
    createdAt: string;
    method: string;
}

export interface ActivitiesPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ActivitiesResponse {
    message: string;
    data: Activity[];
    pagination: ActivitiesPagination;
}
// {"pageParams": [1], "pages": [{"data": [Array], "message": "Payment links retrieved successfully", "pagination": [Object]}]}
export interface ActivitiesInfinityResponse {
    pageParams: number;
    pages: {
        data: Activity[];
        message: string;
        pagination: ActivitiesPagination;
    }[]
}

export interface FetchActivitiesParams {
    operation?: string;
    accountId?: string;
    isReflected?: boolean;
    origin?: string;
    dateFrom?: string;
    dateTo?: string;
    creationDateFrom?: string;
    creationDateTo?: string;
    page?: number;
    limit?: number;
}