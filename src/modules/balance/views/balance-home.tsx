import { useAuthStore } from '@/src/modules/auth/auth.store';
import FontText from '@/src/shared/components/FontText';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActivityCard from '../components/ActivityCard';
import AccountsModal from '../components/AccountsModal';
import BalanceHeader from '../components/header/BalanceHeader';
import SectionHeader from '../components/SectionHeader';
import SettlementForecast from '../components/settlement-forecast/UpcomingBalanceSection';
import useAccounts from '../viewmodels/useAccounts';
import { useRecentBalanceActivities } from '../viewmodels/useActivitiesVM';
import useStatistics from '../viewmodels/useStatistics';
import { ROUTES } from '@/src/core/navigation/routes';
import { NoActivitiesIcon, NoActivitiesSmallIcon } from '@/src/shared/assets/svgs';
import { getInitialTab } from '../balance.utils';
import { useLocalSearchParams } from 'expo-router';
import { ActivityType } from '../balance.model';
import ActivitiesTabs from '../components/ActivitiesTabs';
import { cn } from '@/src/core/utils/cn';
import StickyHeaderList from '@/src/shared/components/StickyHeaderList';
import { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import { GroupedRow } from '@/src/core/utils/groupData';
import { Activity } from '../balance.model';
import { FetchActivitiesParams } from '../balance.model';
import { useMemo, useCallback } from 'react';
import { useActivitiesVM } from '../viewmodels/useActivitiesVM';
import AnimatedInfoMsg from '@/src/shared/components/animated-messages/AnimatedInfoMsg';
import HeaderRow from '@/src/shared/components/StickyHeaderList/HeaderRow';
import AccountsBtn from '../components/header/AccountsBtn';
import ActivitiesListEmpty from '@/src/shared/components/StickyHeaderList/list-empty/ActivitiesListEmpty';
import NotificationBell from '@/src/shared/components/NotificationBell';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import ActivitiesHeader from '../components/header/activities/ActivitiesHeader';
import ActivityFilterModal from '../components/ActivityFilterModal';
const INITIAL_FILTERS: FetchActivitiesParams = {
    operation: undefined,
    isReflected: undefined,
    origin: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    creationDateFrom: undefined,
    creationDateTo: undefined,
}
const BalancesScreen = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    console.log('user : ', user);
    const { data: recentActivities } = useRecentBalanceActivities();
    const { accountStatistics: { data: accountStats }, transfersStatistics: { data: transfersStats } } = useStatistics();
    const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<Activity>>>>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [search, setSearchValue] = useState('');
    const params = useLocalSearchParams<{ tab?: string }>();
    const [type, setType] = useState<ActivityType>(getInitialTab(params.tab || ''));
    const [filters, setFilters] = useState<FetchActivitiesParams>(INITIAL_FILTERS);
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const { accounts } = useAccounts();

    // Scroll to top when tab changes
    useEffect(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [type]);

    // Update operation filter based on active tab
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            // For 'all' tab, remove operation filter (undefined)
            // For specific tabs (payout/transfer), set operation to tab value
            operation: type === 'all' ? undefined : type
        }));
    }, [type]);

    const hasActiveFilters = useMemo(() => {
        const filterKeysToIgnore = ['page', 'limit', 'search', 'operation', 'accountId'];
        return Object.entries(filters).some(([key, value]) => {
            if (filterKeysToIgnore.includes(key)) return false;
            return value !== undefined && value !== '';
        });
    }, [filters]);

    // Fetch activities with filters
    const {
        listData,
        stickyHeaderIndices,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useActivitiesVM({ ...filters, search });

    // console.log('listData', listData);

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderItem = useCallback(({ item }: { item: GroupedRow<Activity> }) => {
        if (item.type === 'header') {
            return <HeaderRow title={item.date} />;
        }
        return <ActivityCard {...item} fromBalance={type === 'all'} />;
    }, [type]);

    const handleClearSearch = useCallback(() => {
        setSearchValue('');
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    const handleSearchChange = useCallback((text: string) => {
        setSearchValue(text);
    }, []);

    const payoutInfoMsg = type === 'payout' ? t('Scheduled automatic transfers of your earnings to your bank account.') : '';
    const transferInfoMsg = type === 'transfer' ? t('On-demand transfers to bank accounts, cards, or mobile wallets.') : '';
    const infoMsg = payoutInfoMsg || transferInfoMsg;
    const RecentActivitiesEmpty = () => {
        return (
            <View className="items-center justify-center py-8">
                <NoActivitiesSmallIcon />
                <FontText type="body" weight="bold" className="text-content-primary text-base text-center mt-4">
                    {t('No balance activities yet!')}
                </FontText>
                <FontText type="body" weight="regular" className="text-content-secondary text-base text-center mt-2">
                    {t('When funds move in or out of your account, the details will be listed here.')}
                </FontText>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 flex-row ">
                {(accounts !== undefined && accounts?.length > 1) && (
                    <AccountsBtn onPress={() => setShowAccountsModal(true)}
                    //  activeAccount={activeAccount}
                    />
                )}
            </View>
            {/* <View className="flex-row justify-between items-center px-6 mt-2">
                <FontText type="head" weight="bold" className="text-xl text-content-primary">
                    {t('Balances')}
                </FontText>
                <NotificationBell notificationsCount={0} />
            </View> */}
            <ActivitiesHeader
                className="mt-2"
                onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
                onSubmitSearch={handleSearchChange}
                isFilterOpen={isFiltersOpen}
                isListEmpty={listData.length === 0}
                hasFilters={hasActiveFilters}
                handleClearSearch={handleClearSearch}
                searchValue={search}
            />
            <View className="">
                <ActivitiesTabs value={type} onSelectType={setType} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} >
                {type === 'overview' ? (
                    <View className="px-6 mt-6">
                        <BalanceHeader
                            userName={user?.fullName || user?.userName}
                            balanceOverview={accountStats?.balanceOverview}
                            ongoingTransfers={transfersStats?.onGoingTransfersAmount}
                            onPressAccounts={() => setShowAccountsModal(true)}
                            showAccountsBtn={(accounts !== undefined && accounts?.length > 1)}
                        />
                        {accountStats?.upcomingValueDates && accountStats?.upcomingValueDates.length > 0 && (
                            <SettlementForecast
                                upcomingValueDates={accountStats?.upcomingValueDates}
                                currency={t("EGP")}
                                nextRoute={ROUTES.BALANCE.ACTIVITIES}
                            />
                        )}
                        <View>
                            <View className="flex-row items-center justify-between mb-4">
                                <FontText type="head" weight="bold" className="text-xl text-content-primary">
                                    {t("Recent activities")}
                                </FontText>
                                <Pressable className="flex-row items-center" onPress={() => setType('all')}>
                                    <FontText type="body" weight="regular" className="text-xs text-primary mr-2">
                                        {t("All activities")}
                                    </FontText>
                                    <ArrowRightIcon size={16} color="#001F5F" />
                                </Pressable>
                            </View>
                            {recentActivities?.data && recentActivities.data.length > 0 ? (
                                recentActivities.data.map((item) => (
                                    <ActivityCard
                                        key={item._id}
                                        {...item}
                                        fromBalance
                                    />
                                ))
                            ) : (<RecentActivitiesEmpty />)}
                        </View>
                    </View>) : (
                    <View className={cn("flex-1 px-6 ")}>
                        <StickyHeaderList
                            ref={listRef}
                            listData={listData}
                            stickyHeaderIndices={stickyHeaderIndices}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            renderItem={renderItem}
                            ListHeaderComponent={
                                <View className="">
                                    {type !== 'all' && <AnimatedInfoMsg infoMsg={infoMsg} />}
                                </View>
                            }
                            ListEmptyComponent={
                                <ActivitiesListEmpty
                                    search={search}
                                    type={type}
                                    hasFilters={hasActiveFilters}
                                    handleClearSearch={handleClearSearch}
                                    handleClearFilters={handleClearFilters}
                                />
                            }
                        />
                    </View>
                )}

            </ScrollView>
            {accounts !== undefined && (
                <AccountsModal
                    isVisible={showAccountsModal}
                    onClose={() => setShowAccountsModal(false)}
                    accounts={accounts}
                />
            )}
            <ActivityFilterModal
                isVisible={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                filters={filters}
                setFilters={setFilters}
                currentTab={type}
            />
        </SafeAreaView>
    )
}

export default BalancesScreen