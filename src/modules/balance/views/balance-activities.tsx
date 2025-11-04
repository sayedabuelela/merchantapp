import FontText from '@/src/shared/components/FontText';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StickyHeaderList from '../../../shared/components/StickyHeaderList';
import HeaderRow from '../../../shared/components/StickyHeaderList/HeaderRow';
import { Activity, ActivityType, FetchActivitiesParams } from '../balance.model';
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

const INITIAL_FILTERS: FetchActivitiesParams = {
    operation: undefined,
    isReflected: undefined,
    origin: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    creationDateFrom: undefined,
    creationDateTo: undefined,
}

const BalanceActivitiesScreen = () => {
    const { t } = useTranslation();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [search, setSearchValue] = useState('');
    const [type, setType] = useState<ActivityType>("payout");
    const [filters, setFilters] = useState<FetchActivitiesParams>(INITIAL_FILTERS);
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const { accounts } = useAccounts();
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
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ActivitiesHeader
                onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
                onSubmitSearch={handleSearchChange}
                isFilterOpen={isFiltersOpen}
                isListEmpty={listData.length === 0}
                hasFilters={hasActiveFilters}
                handleClearSearch={handleClearSearch}
                searchValue={search}
            />
            <ActivitiesTabs value={type} onSelectType={setType}
            // isListEmpty={listData.length === 0} 
            // isListEmpty={false}
            />

            <View className={cn("flex-1 px-6 ")}>

                <StickyHeaderList
                    listData={listData}
                    stickyHeaderIndices={stickyHeaderIndices}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    renderItem={renderItem}
                    ListHeaderComponent={
                        <View className="justify-between items-start my-2">
                            {accounts !== undefined && accounts.length > 0 && (
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
