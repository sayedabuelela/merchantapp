import { cn } from "@/src/core/utils/cn"
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store"
import FontText from "@/src/shared/components/FontText"
import NotificationBell from "@/src/shared/components/NotificationBell"
import FadeInDownView from "@/src/shared/components/wrappers/animated-wrappers/FadeInDownView"
import FadeInUpView from "@/src/shared/components/wrappers/animated-wrappers/FadeInUpView"
import ScaleFadeIn from "@/src/shared/components/wrappers/animated-wrappers/ScaleView"
import StaggerChildrenView from "@/src/shared/components/wrappers/animated-wrappers/StaggerChildrenView"
import { PressableScale } from 'pressto'
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native"
import { ArrowRightIcon, ChevronDownIcon } from "react-native-heroicons/outline"
import { SafeAreaView } from "react-native-safe-area-context"
import { Activity } from "../balance/balance.model"
import AccountsModal from "../balance/components/AccountsModal"
import ActivityCard from "../balance/components/ActivityCard"
import AccountsBtn from "../balance/components/header/AccountsBtn"
import useAccounts from "../balance/viewmodels/useAccounts"
import { useActivitiesVM } from "../balance/viewmodels/useActivitiesVM"
import useStatistics from "../balance/viewmodels/useStatistics"
import { useNotificationsVM } from "../notifications/viewmodels/useNotificationsVM"
import CreatePaymentModal from "../payment-links/components/modals/CreatePaymentModal"
import OrderCard from "../payments/components/orders-list/OrderCard"
import { PaymentSession } from "../payments/payments.model"
import { useOrdersVM } from "../payments/viewmodels/useOrdersVM"
import GreetingUser from "./components/GreetingUser"
import HomeDateFilterModal from "./components/HomeDateFilterModal"
import HomeListEmpty from "./components/HomeListEmpty"
import HomeStatsCarousel from "./components/HomeStatsCarousel"
import HomeTabs from "./components/HomeTabs"
import ServicesList from "./components/services-section/ServicesList"
import { HomeDateFilters, HomeTabType } from "./home.model"
import { getDateFilterDisplayText, getDateRangeForFilter } from "./utils/dateFilterHelpers"
import { Link, Route } from "expo-router"
import { ROUTES } from "@/src/core/navigation/routes"
const HomeScreen = () => {
    const { t } = useTranslation();

    const user = useAuthStore(selectUser);

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

    // const { data: recentActivities } = useRecentBalanceActivities();
    const {
        accountStatistics: { data: accountStats },
        transfersStatistics: { data: transfersStats },
        paymentsStatistics: { data: paymentsStats },
        payoutStatistics: { data: payoutStats }
    } = useStatistics({
        dateFrom: dateFilters.dateFrom,
        dateTo: dateFilters.dateTo,
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
    const getRouteForTab = (tab: HomeTabType): Route => {
        switch (tab) {
            case 'all':
                return "/balance" as Route;
            case 'payouts':
                return (ROUTES.BALANCE.ROOT + '?tab=payout') as Route;
            case 'transfers':
                return (ROUTES.BALANCE.ROOT + '?tab=transfers') as Route;
            case 'orders':
                return ROUTES.TABS.PAYMENTS as Route;
            default:
                return "/balance" as Route;
        }
    };

    // Helper function to get button text based on active tab
    const getButtonTextForTab = (tab: HomeTabType): string => {
        switch (tab) {
            case 'all':
                return t("Go to balance");
            case 'payouts':
                return t("Go to payouts");
            case 'transfers':
                return t("Go to transfers");
            case 'orders':
                return t("Go to payments");
            default:
                return t("Go to balance");
        }
    };
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className={cn("flex-1 ", Platform.OS === 'android' ? 'pt-4' : 'pt-0')}>
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
                                paymentsStats={paymentsStats}
                                payoutStats={payoutStats}
                                setHomeActiveTab={setActiveTab}
                                activeTab={activeTab}
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
                        <>
                            <StaggerChildrenView
                                className="px-6 mt-4 pb-4"
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
                                        return <ActivityCard key={activity._id} {...activity} fromBalance={activeTab === 'all'} />;
                                    })
                                )}
                            </StaggerChildrenView>
                            <Link href={getRouteForTab(activeTab)} asChild>
                                <PressableScale style={styles.goToBtn}>
                                    <FontText type="body" weight="semi" className="text-sm text-primary capitalize">
                                        {getButtonTextForTab(activeTab)}
                                    </FontText>
                                    <ArrowRightIcon size={16} color="#001F5F" style={{ transform: [{ rotate: I18nManager.isRTL ? '180deg' : '0deg' }] }} />
                                </PressableScale>
                            </Link>
                        </>
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

const styles = StyleSheet.create({
    goToBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#001F5F',
        borderRadius: 4,
        height: 46,
        marginHorizontal: 24,
        marginBottom: 24,
    }
});
export default HomeScreen