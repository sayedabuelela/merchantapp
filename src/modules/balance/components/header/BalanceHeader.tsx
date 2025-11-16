import { formatDateByLocale } from "@/src/core/utils/dateUtils";
import FontText from "@/src/shared/components/FontText";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { ImageBackground, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { getGreeting } from "../../balance.utils";
import BalanceHeaderItem from "./BalanceHeaderItem";
import AccountsBtn from "./AccountsBtn";
import NotificationBell from "@/src/shared/components/NotificationBell";
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

    return (
        <View className="mb-8 px-6">
            {/* Header row */}
            <View className="flex-row justify-between items-center">
                {showAccountsBtn && (
                    <AccountsBtn onPress={onPressAccounts}
                    //  activeAccount={activeAccount}
                    />
                )}
                {/* Notifications */}
                <NotificationBell notificationsCount={notificationsCount || 0} />
            </View>
                
        </View>
    );
}

export default BalanceHeader;