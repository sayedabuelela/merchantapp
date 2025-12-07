import { I18nManager } from "react-native";
import { ActivityType, GroupedUpcomingDates, UpcomingValueDate } from "./balance.model";

export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
        return I18nManager.isRTL ? "صباح الخير" : "Good morning";
    } else if (hour < 18) {
        return I18nManager.isRTL ? "مساء الخير" : "Good afternoon";
    } else {
        return I18nManager.isRTL ? "مساء الخير" : "Good evening";
    }
};

export const groupUpcomingDates = (
    upcomingValueDates: UpcomingValueDate[]
): GroupedUpcomingDates => {
    const today = new Date();
    const normalize = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const t = normalize(today);

    return upcomingValueDates.reduce<GroupedUpcomingDates>(
        (acc, item) => {
            const d = normalize(new Date(item.date));
            const diff = (d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);

            if (diff === 0) acc.today = item;
            else if (diff === 1) acc.tomorrow = item;
            else if (diff > 1) acc.later.push(item);

            return acc;
        },
        { later: [] }
    );
};

export const getInitialTab = (paramTab: string): ActivityType => {
    const validTabs: ActivityType[] = ['overview', 'payout', 'upcoming_balance', 'all'];
    if (validTabs.includes(paramTab as ActivityType)) {
        return paramTab as ActivityType;
    }
    return 'overview';
};

export const getActivityInfoMessage = (type: ActivityType, t: (key: string) => string): string => {
    switch (type) {
        case 'payout':
            return t('Scheduled automatic transfers of your earnings to your bank account.');
        case 'upcoming_balance':
            return t('Funds pending settlement that will be added to your available balance.');
        default:
            return '';
    }
};