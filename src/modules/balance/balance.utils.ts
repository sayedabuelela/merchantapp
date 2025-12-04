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
    if (paramTab === 'transfer' || paramTab === 'payout' || paramTab === 'all') {
        return paramTab as ActivityType;
    }
    return 'overview';
};