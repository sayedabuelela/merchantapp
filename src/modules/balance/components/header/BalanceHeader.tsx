import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import FontText from "@/src/shared/components/FontText";
import BalanceHeaderItem from "./BalanceHeaderItem";
import { Link } from "expo-router";
import { BellAlertIcon } from "react-native-heroicons/outline";
import { getGreeting } from "../../balance.utils";
import { formatDateByLocale } from "@/src/core/utils/dateUtils";
interface Props {
    notificationsCount?: number;
    userName?: string;
    ongoingTransfers?: number;
    balanceOverview?:{
        availableBalance: number;
        totalBalance: number;
    }
}
const BalanceHeader = ({ notificationsCount, userName, balanceOverview, ongoingTransfers }: Props) => {
    return (
        <View className="pb-8">
            {/* Background image */}
            <ImageBackground
                source={require("@/src/shared/assets/images/balance-background.png")}
                resizeMode="cover"
                className="w-full h-[280px] pt-8"
            >
                {/* Top gradient overlay */}
                <LinearGradient
                    colors={["rgba(255,255,255,0)", "#FFFFFF"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ ...StyleSheet.absoluteFillObject }}
                />

                {/* Header row */}
                <View className="flex-row justify-between items-start px-6">
                    {/* Greeting */}
                    <View>
                        <FontText type="head" weight="regular" className="text-xl text-content-primary">
                            {getGreeting()},
                        </FontText>
                        <FontText type="head" weight="bold" className="text-2xl text-content-primary capitalize">
                            {userName}!
                        </FontText>
                        <FontText type="body" weight="regular" className="text-xs text-content-secondary mt-0.5">
                            {formatDateByLocale(new Date())}
                        </FontText>
                    </View>

                    {/* Notifications */}
                    <Link href="/notifications" asChild>
                        <TouchableOpacity
                            className="w-10 h-10 items-center justify-center relative"
                        >
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
            </ImageBackground>

            {/* Balance card */}
            <View className="absolute bottom-6 left-0 right-0 px-6 self-center overflow-hidden">
                <LinearGradient
                    colors={["rgba(0,31,95,0)", "rgba(0,31,95,0.08)"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ padding: 16, borderRadius: 6 }}
                >
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
                            title="Ongoing Transfers"
                            value={ongoingTransfers || 0}
                            currency="EGP"
                        />
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
}

export default BalanceHeader;