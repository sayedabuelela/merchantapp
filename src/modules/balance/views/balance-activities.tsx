import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import StickyHeaderList from '../../../shared/components/StickyHeaderList';
import HeaderRow from '../../../shared/components/StickyHeaderList/HeaderRow';
import { Activity, ActivityType } from '../balance.model';
import ActivitiesTabs from '../components/ActivitiesTabs';
import ActivityCard from '../components/ActivityCard';
import ActivityFilterModal from '../components/ActivityFilterModal';
import ActivitiesHeader from '../components/header/activities/ActivitiesHeader';
import { useActivitiesVM } from '../viewmodels/useActivitiesVM';
import { cn } from '@/src/core/utils/cn';
import { GroupedRow } from '@/src/core/utils/groupData';
import ActivitiesListEmpty from '@/src/shared/components/StickyHeaderList/list-empty/ActivitiesListEmpty';
import useAccounts from '../viewmodels/useAccounts';
import AccountsBtn from '../components/header/AccountsBtn';
import AccountsModal from '../components/AccountsModal';
import AnimatedInfoMsg from '@/src/shared/components/animated-messages/AnimatedInfoMsg';
import { FlashList } from '@shopify/flash-list';
import { getInitialTab, getActivityInfoMessage } from '../balance.utils';
import { useActivityFilters } from '../hooks/useActivityFilters';

const BalanceActivitiesScreen = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams<{ tab?: string }>();
    const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<Activity>>>>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [search, setSearchValue] = useState('');
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
        clearFilters();
    }, [clearFilters]);

    const handleSearchChange = useCallback((text: string) => {
        setSearchValue(text);
    }, []);

    const infoMsg = getActivityInfoMessage(type, t);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ActivitiesHeader
                type={type}
                notificationsCount={0}
                onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
                onSubmitSearch={handleSearchChange}
                isFilterOpen={isFiltersOpen}
                isListEmpty={listData.length === 0}
                hasFilters={hasActiveFilters}
                handleClearSearch={handleClearSearch}
                searchValue={search}
            />
            <ActivitiesTabs value={type} onSelectType={setType} />

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
                        <View className="justify-between items-start my-2">
                            {accounts !== undefined && accounts.length > 1 && (
                                <AccountsBtn
                                    className="mt-4"
                                    onPress={() => setShowAccountsModal(true)}
                                />
                            )}
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
};

export default BalanceActivitiesScreen;
