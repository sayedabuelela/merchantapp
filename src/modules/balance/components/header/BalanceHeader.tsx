import NotificationBell from "@/src/shared/components/NotificationBell";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import AccountsBtn from "./AccountsBtn";
import BalanceStatsCard from "./BalanceStatsCard";
interface Props {
    notificationsCount?: number;
    userName?: string;
    ongoingTransfers?: number;
    balanceOverview?: {
        availableBalance: number;
        totalBalance: number;
    },
    onPressAccounts: () => void,
    showAccountsBtn?: boolean
}
const BalanceHeader = ({ notificationsCount, userName, balanceOverview, ongoingTransfers, onPressAccounts, showAccountsBtn }: Props) => {
    const {t} = useTranslation();
    return (
        <View className="mb-8 px-6">
            {/* Header row */}
            <View className="flex-row justify-between items-center mb-6">
                {showAccountsBtn && (
                    <AccountsBtn onPress={onPressAccounts}
                    //  activeAccount={activeAccount}
                    />
                )}
                {/* Notifications */}
                <NotificationBell notificationsCount={notificationsCount || 0} />
            </View>
            <BalanceStatsCard
                mainBalance={{
                    title: t('Available Balance'),
                    value: balanceOverview?.availableBalance || 0,
                    currency: 'EGP'
                }}
                leftDetail={{
                    title: t('Total Balance'),
                    value: balanceOverview?.totalBalance || 0,
                    currency: 'EGP'
                }}
                rightDetail={{
                    title: t('Held funds'),
                    value: ongoingTransfers || 0,
                    currency: 'EGP'
                }}
            />

        </View>
    );
}

export default BalanceHeader;