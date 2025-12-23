import { ROUTES } from '@/src/core/navigation/routes';
import { cn } from '@/src/core/utils/cn';
import { GroupedRow } from '@/src/core/utils/groupData';
import { useAuthStore } from '@/src/modules/auth/auth.store';
import { NoActivitiesSmallIcon } from '@/src/shared/assets/svgs';
import AnimatedInfoMsg from '@/src/shared/components/animated-messages/AnimatedInfoMsg';
import FontText from '@/src/shared/components/FontText';
import StickyHeaderList from '@/src/shared/components/StickyHeaderList';
import HeaderRow from '@/src/shared/components/StickyHeaderList/HeaderRow';
import ActivitiesListEmpty from '@/src/shared/components/StickyHeaderList/list-empty/ActivitiesListEmpty';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, ActivityType } from '../balance.model';
import { getActivityInfoMessage, getInitialTab } from '../balance.utils';
import AccountsModal from '../components/AccountsModal';
import ActivitiesTabs from '../components/ActivitiesTabs';
import ActivityCard from '../components/ActivityCard';
import ActivityFilterModal from '../components/ActivityFilterModal';
import ActivitiesHeader from '../components/header/activities/ActivitiesHeader';
import BalanceHeader from '../components/header/BalanceHeader';
import { useActivityFilters } from '../hooks/useActivityFilters';
import useAccounts from '../viewmodels/useAccounts';
import { useActivitiesVM, useRecentBalanceActivities } from '../viewmodels/useActivitiesVM';
import useStatistics from '../viewmodels/useStatistics';
import UpcomingBalanceSection from '../components/settlement-forecast/UpcomingBalanceSection';
import FadeInDownView from '@/src/shared/components/wrappers/animated-wrappers/FadeInDownView';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';
import ScaleView from '@/src/shared/components/wrappers/animated-wrappers/ScaleView';
import StaggerChildrenView from '@/src/shared/components/wrappers/animated-wrappers/StaggerChildrenView';
import AnimatedListItem from '@/src/shared/components/wrappers/animated-wrappers/AnimatedListItem';
import PaymentLinkCardSkeleton from '../../payment-links/components/PaymentLinkCardSkeleton';

const BalancesScreen = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const recentActivities = useRecentBalanceActivities();
    const { accountStatistics: accountStats, transfersStatistics: transfersStats } = useStatistics();
    const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<Activity>>>>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [search, setSearchValue] = useState('');
    const params = useLocalSearchParams<{ tab?: string }>();
    const [type, setType] = useState<ActivityType>(getInitialTab(params.tab || ''));
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const { accounts } = useAccounts();
    // Use custom hook for filter management
    const { filters, setFilters, hasActiveFilters, clearFilters } = useActivityFilters(type);
    // Scroll to top when tab changes
    useEffect(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [type]);

    // Fetch activities with filters
    const {
        listData,
        stickyHeaderIndices,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        refetch
    } = useActivitiesVM({ ...filters, search });

    // console.log('listData', listData);

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderItem = useCallback(({ item, index }: { item: GroupedRow<Activity>; index: number }) => {
        if (item.type === 'header') {
            return <HeaderRow title={item.date} />;
        }

        // Calculate the actual item index (excluding headers)
        const itemsBefore = listData.slice(0, index).filter(i => i.type !== 'header').length;

        return (
            <AnimatedListItem index={itemsBefore} delay={250} staggerDelay={40} duration={400}>
                <ActivityCard {...item} fromBalance={type === 'all'} />
            </AnimatedListItem>
        );
    }, [type, listData]);

    const handleClearSearch = useCallback(() => {
        setSearchValue('');
    }, []);

    const handleClearFilters = useCallback(() => {
        clearFilters();
    }, [clearFilters]);

    const handleSearchChange = useCallback((text: string) => {
        setSearchValue(text);
    }, []);

    const infoMsg = getActivityInfoMessage(type, t);
    const RecentActivitiesEmpty = () => {
        return (
            <View className="items-center justify-center pt-6 pb-8">
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
            <FadeInDownView delay={0} duration={600}>
                <ActivitiesHeader
                    type={type}
                    notificationsCount={0}
                    className="mt-2"
                    onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
                    onSubmitSearch={handleSearchChange}
                    isFilterOpen={isFiltersOpen}
                    isListEmpty={listData.length === 0}
                    hasFilters={hasActiveFilters}
                    handleClearSearch={handleClearSearch}
                    searchValue={search}
                    accounts={accounts}
                    setShowAccountsModal={setShowAccountsModal}
                />
            </FadeInDownView>
            <FadeInUpView delay={200} duration={600}>
                <ActivitiesTabs value={type} onSelectType={setType} />
            </FadeInUpView>
            {isLoading ? (
                <View className={cn("flex-1 px-6 mt-6")}>
                    <PaymentLinkCardSkeleton />
                </View>
            ) : type === 'overview' ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                accountStats.isRefetching ||
                                transfersStats.isRefetching ||
                                recentActivities.isRefetching
                            }
                            onRefresh={() => {
                                accountStats.refetch();
                                transfersStats.refetch();
                                recentActivities.refetch();
                            }}
                        />
                    }
                >
                    <View className="px-6 mt-6">
                        <ScaleView delay={150} duration={600}>
                            <BalanceHeader
                                userName={user?.fullName || user?.userName}
                                balanceOverview={accountStats.data?.balanceOverview}
                                ongoingTransfers={transfersStats.data?.onGoingTransfersAmount}
                                onPressAccounts={() => setShowAccountsModal(true)}
                                showAccountsBtn={(accounts !== undefined && accounts?.length > 1)}
                            />
                        </ScaleView>
                        {accountStats.data?.upcomingValueDates && accountStats.data.upcomingValueDates.length > 0 && (
                            <FadeInUpView delay={300} duration={600}>
                                <UpcomingBalanceSection
                                    setType={() => setType('payout')}
                                    upcomingValueDates={accountStats.data.upcomingValueDates}
                                    currency={t("EGP")}
                                />
                            </FadeInUpView>
                        )}
                        <View>
                            <FadeInUpView delay={350} duration={600}>
                                <View className="flex-row items-center justify-between mb-4">
                                    <FontText type="head" weight="bold" className="text-xl text-content-primary">
                                        {t("Recent activities")}
                                    </FontText>
                                    <Pressable className="flex-row items-center" onPress={() => setType('all')}>
                                        <FontText type="body" weight="regular" className="text-xs text-primary mr-2">
                                            {t("All activities")}
                                        </FontText>
                                        <ArrowRightIcon size={16} color="#001F5F" style={{ transform: [{ rotate: I18nManager.isRTL ? '180deg' : '0deg' }] }} />
                                    </Pressable>
                                </View>
                            </FadeInUpView>
                            {recentActivities.data?.data && recentActivities.data.data.length > 0 ? (
                                <StaggerChildrenView
                                    delay={400}
                                    staggerDelay={80}
                                    animationType="fadeInUp"
                                    duration={500}
                                >
                                    {recentActivities.data.data.map((item) => (
                                        <ActivityCard
                                            key={item._id}
                                            {...item}
                                            fromBalance
                                        />
                                    ))}
                                </StaggerChildrenView>
                            ) : (<RecentActivitiesEmpty />)}
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View className={cn("flex-1 px-6")}>
                    <StickyHeaderList
                        ref={listRef}
                        listData={listData}
                        stickyHeaderIndices={stickyHeaderIndices}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        renderItem={renderItem}
                        refreshing={isRefetching}
                        onRefresh={refetch}
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