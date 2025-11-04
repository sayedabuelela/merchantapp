import { formatDateByLocale } from "@/src/core/utils/dateUtils";
import FontText from "@/src/shared/components/FontText";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { ImageBackground, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { BellAlertIcon } from "react-native-heroicons/outline";
import { getGreeting } from "../../balance.utils";
import BalanceHeaderItem from "./BalanceHeaderItem";
import AccountsBtn from "./AccountsBtn";
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
                <Link href="/notifications" asChild>
                    <TouchableOpacity
                        className="w-10 items-center justify-center relative ml-auto">
                        <BellAlertIcon size={24} color="#001F5F" />
                        {(notificationsCount && notificationsCount > 0) && (
                            <View className="absolute top-0 right-1 w-4 h-4 rounded-full bg-danger items-center justify-center">
                                <FontText type="body" weight="bold" className="text-[8px] text-white">
                                    {notificationsCount}
                                </FontText>
                            </View>
                        )}
                    </TouchableOpacity>
                </Link>

            </View>
            {/* Greeting */}
            {/* <View>
                <FontText type="head" weight="regular" className="text-xl text-content-primary">
                    {getGreeting()},
                </FontText>
                <FontText type="head" weight="bold" className="text-2xl text-content-primary capitalize">
                    {userName}!
                </FontText>
                <FontText type="body" weight="regular" className="text-xs text-content-secondary mt-0.5">
                    {formatDateByLocale(new Date())}
                </FontText>
            </View> */}
            {/* Balance card */}
            <View className="px-6 pt-6 pb-4 bg-[##F1F6FF] rounded mt-6">
                {/* Available Balance */}
                <BalanceHeaderItem
                    title="Available Balance"
                    value={balanceOverview?.availableBalance || 0}
                    currency="EGP"
                    mainBalance
                />

                {/* Divider */}
                <View className="h-[1.5px] bg-[#F1F6FF] my-2 rounded" />

                {/* Balance details */}
                <View className="flex-row justify-between items-center">
                    {/* Total Balance */}
                    <BalanceHeaderItem
                        title="Total Balance"
                        value={balanceOverview?.totalBalance || 0}
                        currency="EGP"
                    />

                    {/* Ongoing Transfers */}
                    <BalanceHeaderItem
                        title="Held funds"
                        value={ongoingTransfers || 0}
                        currency="EGP"
                    />
                </View>
            </View>
        </View>
    );
}

export default BalanceHeader;