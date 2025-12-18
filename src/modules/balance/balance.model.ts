import { Transaction } from "../payments/payments.model"

export interface AccountStatistics {
    balanceOverview: {
        availableBalance: number,
        lastPayoutAmount: number,
        totalBalance: number,
        upcomingPayouts: number,
    },
    upcomingValueDates: {
        amount: number,
        date: string
    }[]
}

export interface TransfersStatistics {
    onGoingTransfersAmount: number,
    totalTransfersCount: number,
    totalTransfersAmount: number,
    recentTransfers: {
        amount: number,
        transfersCount: number,
        date: string
    }[]
}
export interface PaymentsStatistics {
    amount: number,
    count: number,
    topMethod: string
}
export interface PayoutStatistics {
    amount: number,
    lastPayout: number,
    upcomingPayouts: number,
}
export interface DashboardStatistics {
    _id: string | null;
    transactionDays: string[];
    successfullTransactionsCount: number[];
    failedTransactionsCount: number[];
    transactionPaymentAmount: number[];
    refundedTransactionsAmount: number[];
    totalTrxCountArray: number[];
    totalSuccessTrx: number;
    totalFailedTrx: number;
    totalPaymentAmount: number;
    totalRefundAmount: number;
    totalTransactionsCount: number;
    avgSuccessToFailureTrxs: number;
}
export interface DashboardGrowthRatio {
    successfullRatio: string;
    failedRatio: string;
    amountRatio: string;
    refundRatio: string;
    countTrxRatio: string;
}
export interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface DashboardStatisticsResponse {
    status: string;
    response: {
        responseTransactions: Transaction[];
        currentStatistic: DashboardStatistics;
        prevStatistic: DashboardStatistics;
        growthRatio: DashboardGrowthRatio;
        paginationData: PaginationData;
    };
    messages: {
        en: string;
        ar: string;
    };
}

export interface FlattenedDashboardStatistics {
    currentStatistic: DashboardStatistics;
    latestTransaction: Transaction | null;
    topMethod: string;
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
export type ActivityType = 'overview' | 'payout' | 'upcoming_balance' | 'all';

export interface Activity {
    id: string;
    origin: string;
    amount: number;
    currency: string;
    accountName: string;
    accountId: string;
    destination?: string; // For payouts (bank account)
    source?: string; // For transfers
    date: string;
    status: string;
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
    isReflected: boolean;
    comment: string;
    fees: string;
}

export interface Transfer {
    isReconcileFailed: boolean,
    transferId: string,
    amount: number,
    method: string,
    recipientName: string,
    recipientNumber: string,
    recipientBank: string,
    merchantId: string,
    status: string,
    merchantDetails: {
        email: string,
        businessEmail: string,
        storeName: string
    },
    createdBy: {
        id: string,
        name: string,
        email: string
    },
    batch: {
        _id: string,
        name: string,
        id: string,
        method: string,
        transfersCount: number,
        webhookReconcile: string
    },
    history?: {
        watchDogCron: boolean,
        _id: string,
        status: string,
        date: string,
        source: string,
        webhookReconcile: string
    }[],
    apmTraceId: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
    fees: {
        PCC_selling_rate: number,
        PCC_selling_flat: number,
        total_selling_rate: string,
        total_selling_fees: string
    },
    accountId: string
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

export interface ActivityDetailsResponse {
    message: string;
    data: Activity;
}

export interface TransferDetailsResponse {
    data: Transfer;
}

export interface PaymentDetailsResponse {
    data: {
        body: Transfer
    };
}

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
    search?: string;
}

export interface SettlementWindowParams {
    accountId: string;
    limit?: number;
    sortType?: number;
    page?: number;
    dateFrom?: string;
    dateTo?: string;
}
