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