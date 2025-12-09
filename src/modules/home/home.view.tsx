import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store"
import { formatDateString } from "@/src/core/utils/dateUtils"
import FontText from "@/src/shared/components/FontText"
import NotificationBell from "@/src/shared/components/NotificationBell"
import FadeInDownView from "@/src/shared/components/wrappers/animated-wrappers/FadeInDownView"
import FadeInUpView from "@/src/shared/components/wrappers/animated-wrappers/FadeInUpView"
import ScaleFadeIn from "@/src/shared/components/wrappers/animated-wrappers/ScaleView"
import StaggerChildrenView from "@/src/shared/components/wrappers/animated-wrappers/StaggerChildrenView"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, ScrollView, View } from "react-native"
import { ChevronDownIcon } from "react-native-heroicons/outline"
import { SafeAreaView } from "react-native-safe-area-context"
import { Activity } from "../balance/balance.model"
import AccountsModal from "../balance/components/AccountsModal"
import ActivityCard from "../balance/components/ActivityCard"
import AccountsBtn from "../balance/components/header/AccountsBtn"
import useAccounts from "../balance/viewmodels/useAccounts"
import { useActivitiesVM, useRecentBalanceActivities } from "../balance/viewmodels/useActivitiesVM"
import useStatistics from "../balance/viewmodels/useStatistics"
import CreatePaymentModal from "../payment-links/components/modals/CreatePaymentModal"
import OrderCard from "../payments/components/orders-list/OrderCard"
import { PaymentSession } from "../payments/payments.model"
import { useOrdersVM } from "../payments/viewmodels/useOrdersVM"
import { useNotificationsVM } from "../notifications/viewmodels/useNotificationsVM"
import GreetingUser from "./components/GreetingUser"
import HomeDateFilterModal from "./components/HomeDateFilterModal"
import HomeListEmpty from "./components/HomeListEmpty"
import HomeStatsCarousel from "./components/HomeStatsCarousel"
import HomeTabs from "./components/HomeTabs"
import ServicesList from "./components/services-section/ServicesList"
import { HomeDateFilters, HomeTabType } from "./home.model"
import { getDateFilterDisplayText, getDateRangeForFilter } from "./utils/dateFilterHelpers"

const HomeScreen = () => {
    const { t } = useTranslation();

    const user = useAuthStore(selectUser);

    const { data: recentActivities } = useRecentBalanceActivities();
    const {
        accountStatistics: { data: accountStats },
        transfersStatistics: { data: transfersStats },
        dashboardStatistics: { data: dashboardStats }
    } = useStatistics();
    const { unSeenCount } = useNotificationsVM();
    const notificationsCount = unSeenCount;
    const userName = user?.userName || user?.fullName;
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const [isCreatePLModalVisible, setCreatePLModalVisible] = useState(false);
    const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<HomeTabType>('all');

    // Date filter state - default to 'today'
    const todayRange = getDateRangeForFilter('today');
    const [dateFilters, setDateFilters] = useState<HomeDateFilters>({
        dateFrom: todayRange.dateFrom,
        dateTo: todayRange.dateTo,
        filterType: 'today'
    });

    const handleAddPress = () => {
        setCreatePLModalVisible(!isCreatePLModalVisible);
    };

    const handleDateFilter = () => {
        setIsDateFilterVisible(!isDateFilterVisible);
    };
    const { accounts } = useAccounts();

    // Fetch data based on active tab (limit to 5 items for home preview)
    const allActivitiesQuery = useActivitiesVM({
        limit: 5,
        operation: undefined,
        creationDateFrom: dateFilters.dateFrom,
        creationDateTo: dateFilters.dateTo
    });

    const payoutsQuery = useActivitiesVM({
        limit: 5,
        operation: 'payout',
        creationDateFrom: dateFilters.dateFrom,
        creationDateTo: dateFilters.dateTo
    });

    const transfersQuery = useActivitiesVM({
        limit: 5,
        operation: 'transfer',
        creationDateFrom: dateFilters.dateFrom,
        creationDateTo: dateFilters.dateTo
    });

    const ordersQuery = useOrdersVM({
        limit: 5,
        dateFrom: dateFilters.dateFrom,
        dateTo: dateFilters.dateTo
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
                        <FadeInUpView delay={350} duration={600}>
                            <View className="flex-row items-center justify-between mb-4">
                                <FontText type="head" weight="bold" className="text-xl text-content-primary">
                                    {t("Reports")}
                                </FontText>
                                <Pressable className="flex-row items-center" onPress={handleDateFilter}>
                                    <FontText type="body" weight="regular" className="text-xs text-primary mr-2">
                                        {getDateFilterDisplayText(
                                            dateFilters.filterType,
                                            dateFilters.customFrom,
                                            dateFilters.customTo,
                                            t
                                        )}
                                    </FontText>
                                    <ChevronDownIcon size={14} color="#001F5F" />
                                </Pressable>
                            </View>
                        </FadeInUpView>
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
                                setHomeActiveTab={setActiveTab}
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
            <HomeDateFilterModal
                isVisible={isDateFilterVisible}
                onClose={handleDateFilter}
                filters={dateFilters}
                setFilters={setDateFilters}
            />
        </SafeAreaView>
    )
}

export default HomeScreen