import FontText from '@/src/shared/components/FontText';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StickyHeaderList from '../../payment-links/components/StickyHeaderList';
import HeaderRow from '../../payment-links/components/StickyHeaderList/HeaderRow';
import { Activity, ActivityType, FetchActivitiesParams } from '../balance.model';
import ActivitiesTabs from '../components/ActivitiesTabs';
import ActivityCard from '../components/ActivityCard';
import ActivityFilterModal from '../components/ActivityFilterModal';
import ActivitiesHeader from '../components/header/activities/ActivitiesHeader';
import { useActivitiesVM } from '../viewmodels/useActivitiesVM';
import { cn } from '@/src/core/utils/cn';
import { GroupedRow } from '@/src/core/utils/groupData';

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
    } = useActivitiesVM(filters);
    console.log('listData', listData);
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderItem = useCallback(({ item }: { item: GroupedRow<Activity> }) => {
        if (item.type === 'header') {
            return <HeaderRow title={item.date} />;
        }
        // For activity items, pass fromBalance based on active tab
        return <ActivityCard {...item} fromBalance={type === 'all'} />;
    }, [type]);
    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View className="py-4">
                <ActivityIndicator size="small" color="#00A19B" />
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View className="flex-1 items-center justify-center py-8">
                    <ActivityIndicator size="large" color="#00A19B" />
                </View>
            );
        }
        return (
            <View className="flex-1 items-center justify-center py-8">
                <FontText type="body" weight="regular" className="text-content-secondary">
                    {t('No activities found')}
                </FontText>
            </View>
        );
    };
    console.log('type', type);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ActivitiesHeader
                onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
                onSubmitSearch={() => { setSearchValue('') }}
                isFilterOpen={isFiltersOpen}
                isListEmpty={listData.length === 0}
                hasFilters={hasActiveFilters}
                handleClearSearch={() => { setSearchValue('') }}
                searchValue={search}
            />
            <ActivitiesTabs value={type} onSelectType={setType}
                // isListEmpty={listData.length === 0} 
                isListEmpty={false}
            />

            <View className={cn("flex-1 px-6 ", type === 'payout' && "mt-6")}>
                <StickyHeaderList
                    listData={listData}
                    stickyHeaderIndices={stickyHeaderIndices}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    // handleShowCreatePLModal={handleToggleCreateNew}
                    // handleOpenActions={handleOpenActions}
                    renderItem={renderItem}
                // ListEmptyComponent={
                //     <PaymentLinksListEmpty
                //         search={search}
                //         hasFilters={hasActiveFilters}
                //         hasPaymentStatus={hasPaymentStatus}
                //         handleClearSearch={handleClearSearch}
                //         handleClearFilters={handleClearFilters}
                //         handleToggleCreateNew={handleToggleCreateNew}
                //     />
                // }
                />
            </View>

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
