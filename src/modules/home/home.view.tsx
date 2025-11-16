import { ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { View } from "react-native"
import { useAuthStore } from "@/src/modules/auth/auth.store"
import useStatistics from "../balance/viewmodels/useStatistics"
import NotificationBell from "@/src/shared/components/NotificationBell"
import { useRecentBalanceActivities } from "../balance/viewmodels/useActivitiesVM"
import GreetingUser from "./components/GreetingUser"
import HomeStatsCarousel from "./components/HomeStatsCarousel"
import { Link } from "expo-router"
import ServicesList from "./components/services-section/ServicesList"
import React, { useState } from "react"
import useAccounts from "../balance/viewmodels/useAccounts"
import AccountsModal from "../balance/components/AccountsModal"
import AccountsBtn from "../balance/components/header/AccountsBtn"

const HomeScreen = () => {
    const { user } = useAuthStore();
    const { data: recentActivities } = useRecentBalanceActivities();
    const {
        accountStatistics: { data: accountStats },
        transfersStatistics: { data: transfersStats },
        dashboardStatistics: { data: dashboardStats }
    } = useStatistics();
    const notificationsCount = recentActivities?.data?.length || 0;
    const userName = user?.userName || user?.fullName;
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const { accounts } = useAccounts();
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-1"
            >
                <View className="px-6 mb-2">
                    {/* Header row */}
                    <View className="flex-row justify-between items-start">
                        {userName && (
                            <GreetingUser userName={userName} />
                        )}
                        <NotificationBell notificationsCount={notificationsCount || 0} />
                    </View>
                    <ServicesList />
                    {(accounts !== undefined && accounts?.length > 1) && (
                        <AccountsBtn
                            onPress={() => setShowAccountsModal(true)}
                            className="self-start"
                        />
                    )}
                </View>
                <HomeStatsCarousel
                    accountStats={accountStats}
                    transfersStats={transfersStats}
                    dashboardStats={dashboardStats}
                />
                <Link href="/balance">Balance</Link>

            </ScrollView>
            {accounts !== undefined && accounts?.length > 1 && (
                <AccountsModal
                    isVisible={showAccountsModal}
                    onClose={() => setShowAccountsModal(false)}
                    accounts={accounts}
                />
            )}
        </SafeAreaView>
    )
}

export default HomeScreen