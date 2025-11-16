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
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <View className=" px-6">
                    {/* Header row */}
                    <View className="flex-row justify-between items-start">
                        {userName && (
                            <GreetingUser userName={userName} />
                        )}
                        {/* Notifications */}
                        <NotificationBell notificationsCount={notificationsCount || 0} />
                    </View>
                </View>
                <HomeStatsCarousel
                    accountStats={accountStats}
                    transfersStats={transfersStats}
                    dashboardStats={dashboardStats}
                />
                <Link href="/balance">Balance</Link>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen