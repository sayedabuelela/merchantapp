import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuthStore } from "@/src/modules/auth/auth.store"
import useStatistics from "../balance/viewmodels/useStatistics"
import NotificationBell from "@/src/shared/components/NotificationBell"
import { useRecentBalanceActivities, useActivitiesVM } from "../balance/viewmodels/useActivitiesVM"
import GreetingUser from "./components/GreetingUser"
import HomeStatsCarousel from "./components/HomeStatsCarousel"
import ServicesList from "./components/services-section/ServicesList"
import React, { useState } from "react"
import useAccounts from "../balance/viewmodels/useAccounts"
import AccountsModal from "../balance/components/AccountsModal"
import AccountsBtn from "../balance/components/header/AccountsBtn"
import CreatePaymentModal from "../payment-links/components/modals/CreatePaymentModal"
import HomeTabs from "./components/HomeTabs"
import { HomeTabType } from "./home.model"
import ActivityCard from "../balance/components/ActivityCard"
import OrderCard from "../payments/components/orders-list/OrderCard"
import { useOrdersVM } from "../payments/viewmodels/useOrdersVM"
import { Activity } from "../balance/balance.model"
import { PaymentSession } from "../payments/payments.model"
import { Link } from "expo-router"
import FontText from "@/src/shared/components/FontText"
import HomeListEmpty from "./components/HomeListEmpty"
import FadeInDownView from "@/src/shared/components/wrappers/animated-wrappers/FadeInDownView"
import FadeInUpView from "@/src/shared/components/wrappers/animated-wrappers/FadeInUpView"
import ScaleFadeIn from "@/src/shared/components/wrappers/animated-wrappers/ScaleView"
import StaggerChildrenView from "@/src/shared/components/wrappers/animated-wrappers/StaggerChildrenView"

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
    const [isCreatePLModalVisible, setCreatePLModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<HomeTabType>('all');

    const handleAddPress = () => {
        setCreatePLModalVisible(!isCreatePLModalVisible);
    };
    const { accounts } = useAccounts();

    // Fetch data based on active tab (limit to 5 items for home preview)
    const allActivitiesQuery = useActivitiesVM({
        limit: 5,
        operation: undefined
    });

    const payoutsQuery = useActivitiesVM({
        limit: 5,
        operation: 'payout'
    });

    const transfersQuery = useActivitiesVM({
        limit: 5,
        operation: 'transfer'
    });

    const ordersQuery = useOrdersVM({
        limit: 5
    });

    // Get the appropriate data based on active tab (limited to 5 items)
    const getListData = () => {
        switch (activeTab) {
            case 'all':
                return (allActivitiesQuery.data?.pages.flatMap((p) => p.data) ?? []).slice(0, 3);
            case 'payouts':
                return (payoutsQuery.data?.pages.flatMap((p) => p.data) ?? []).slice(0, 3);
            case 'transfers':
                return (transfersQuery.data?.pages.flatMap((p) => p.data) ?? []).slice(0, 3);
            case 'orders':
                return (ordersQuery.data?.pages.flatMap((p) => p.data) ?? []).slice(0, 3);
            default:
                return [];
        }
    };

    const listData = getListData();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[2]}
                >
                    <FadeInDownView className="px-6 mb-2" delay={100} duration={600}>
                        {/* Header row */}
                        <View className="flex-row justify-between items-start">
                            {userName && (
                                <GreetingUser userName={userName} />
                            )}
                            <NotificationBell notificationsCount={notificationsCount || 0} />
                        </View>
                        <ServicesList qrCodeActionPress={handleAddPress} />
                        {(accounts !== undefined && accounts?.length > 1) && (
                            <AccountsBtn
                                onPress={() => setShowAccountsModal(true)}
                                className="self-start"
                            />
                        )}
                    </FadeInDownView>
                    <ScaleFadeIn delay={200} duration={600}>
                        <View className="mb-2">
                            <HomeStatsCarousel
                                accountStats={accountStats}
                                transfersStats={transfersStats}
                                dashboardStats={dashboardStats}
                            />
                        </View>
                    </ScaleFadeIn>
                    {/* Home tabs */}
                    <FadeInUpView className="bg-white" delay={300} duration={600}>
                        <HomeTabs value={activeTab} onSelectType={setActiveTab} />
                    </FadeInUpView>
                    {/* <Link href="/balance">
                        <FontText>Balance</FontText>
                    </Link> */}
                    {/* List */}
                    {listData.length > 0 ? (
                        <StaggerChildrenView
                            className="px-6 mt-4 pb-6"
                            delay={300}
                            staggerDelay={100}
                            animationType="fadeInUp"
                            duration={600}
                        >
                            {activeTab === 'orders' ? (
                                listData.map((item) => {
                                    const payment = item as PaymentSession;
                                    return <OrderCard key={payment._id} payment={payment} />;
                                })
                            ) : (
                                listData.map((item) => {
                                    const activity = item as Activity;
                                    return <ActivityCard key={activity._id} {...activity} fromBalance={activeTab === 'all'}
                                    />;
                                })
                            )}
                        </StaggerChildrenView>
                    ) : (
                        <FadeInDownView className="px-6 mt-4 pb-6" delay={300} duration={600}>
                            <HomeListEmpty activeTab={activeTab} />
                        </FadeInDownView>
                    )}
                </ScrollView>
            </View>
            {accounts !== undefined && accounts?.length > 1 && (
                <AccountsModal
                    isVisible={showAccountsModal}
                    onClose={() => setShowAccountsModal(false)}
                    accounts={accounts}
                />
            )}
            <CreatePaymentModal
                isVisible={isCreatePLModalVisible}
                onClose={handleAddPress}
                qrCode={true}
            />
        </SafeAreaView>
    )
}

export default HomeScreen