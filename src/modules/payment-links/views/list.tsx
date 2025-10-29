import { cn } from '@/src/core/utils/cn';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreatePaymentModal from '../components/modals/CreatePaymentModal';
import FiltersModal from '../components/modals/FiltersModal';
import PaymentLinkCardSkeleton from '../components/PaymentLinkCardSkeleton';
import PaymentLinksHeader from '../components/PaymentLinksHeader';
import PaymentLinksTabs from '../components/PaymentLinksTabs';
import StickyHeaderList from '../components/StickyHeaderList';
import PaymentLinksListEmpty from '../components/StickyHeaderList/list-empty/PaymentLinksListEmpty';
import { FetchPaymentLinksParams, PaymentLink, PaymentStatus } from '../payment-links.model';
import usePaymentLinksVM from '../viewmodels/usePaymentLinksVM';
import ActionsModal from '../components/modals/ActionsModal';
import { AnimatePresence } from 'moti';
import HeaderRow from '../components/StickyHeaderList/HeaderRow';
import PaymentLinkCard from '../components/PaymentLinkCard';
import useCountries from '@/src/shared/hooks/useCountries';
import CountyCodeBottomSheet, { CountyCodeBottomSheetRef } from '@/src/shared/components/bottom-sheets/phone-code-selector/CountyCodeBottomSheet';

// Constants
const INITIAL_FILTERS: FetchPaymentLinksParams = {
    startDate: undefined,
    endDate: undefined,
    startDueDate: undefined,
    endDueDate: undefined,
    startAmountRange: undefined,
    endAmountRange: undefined,
};

const PaymentLinksScreen = () => {
    const { t } = useTranslation();
    const countyCodeBottomSheetRef = useRef<CountyCodeBottomSheetRef>(null);
    // State Management
    const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [search, setSearchValue] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | string>("");
    const [filters, setFilters] = useState<FetchPaymentLinksParams>(INITIAL_FILTERS);
    const [selectedPaymentLink, setSelectedPaymentLink] = useState<PaymentLink | null>(null);
    const { countries } = useCountries();
    // Function to handle opening the modal
    const handleOpenActions = useCallback((paymentLink: PaymentLink) => {
        setSelectedPaymentLink(paymentLink);
    }, []);
    const handleCloseActions = useCallback(() => {
        setSelectedPaymentLink(null);
    }, []);
    // Memoized values
    const hasActiveFilters = useMemo(() => {
        const filterKeysToIgnore = ['page', 'limit', 'search', 'paymentStatus'];
        return Object.entries(filters).some(([key, value]) => {
            if (filterKeysToIgnore.includes(key)) return false;
            return value !== undefined && value !== '';
        });
    }, [filters]);
    const hasPaymentStatus = useMemo(() => {
        return paymentStatus !== undefined && paymentStatus !== '';
    }, [paymentStatus]);
    console.log("hasPaymentStatus : ", hasPaymentStatus);
    // Data fetching
    const {
        isLoading,
        stickyHeaderIndices,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        listData
    } = usePaymentLinksVM({
        search,
        paymentStatus,
        ...filters
    });

    const isListEmpty = useMemo(() =>
        listData.length === 0 && !isLoading && !search && !paymentStatus && !hasActiveFilters,
        [listData.length, isLoading, search, paymentStatus, hasActiveFilters]
    );

    // Handlers
    const handleSearchChange = useCallback((text: string) => {
        setSearchValue(text);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchValue('');
    }, []);

    const handleToggleCreateNew = useCallback(() => {
        setIsCreateNewOpen(prev => !prev);
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    const handleToggleFilters = useCallback(() => {
        setIsFiltersOpen(prev => !prev);
    }, []);
    const renderItem = useCallback(({ item }: { item: any }) => {
        if (item?.type === 'header') return <HeaderRow title={item.date} />;
        return <PaymentLinkCard paymentLink={item} onOpenActions={handleOpenActions} />;
    }, [handleOpenActions]);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <PaymentLinksHeader
                isFilterOpen={isFiltersOpen}
                onPlusPress={handleToggleCreateNew}
                onSubmitSearch={handleSearchChange}
                onFilterPress={handleToggleFilters}
                isListEmpty={isListEmpty}
                hasFilters={hasActiveFilters}
                handleClearSearch={handleClearSearch}
                searchValue={search}
            />

            <PaymentLinksTabs
                value={paymentStatus}
                onSelectStatus={setPaymentStatus}
                isListEmpty={isListEmpty}
            />

            <View className={cn("flex-1 px-6")}>
                {isLoading ? (
                    <PaymentLinkCardSkeleton />
                ) : (
                    <StickyHeaderList
                        listData={listData}
                        stickyHeaderIndices={stickyHeaderIndices}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        handleShowCreatePLModal={handleToggleCreateNew}
                        // handleOpenActions={handleOpenActions}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <PaymentLinksListEmpty
                                search={search}
                                hasFilters={hasActiveFilters}
                                hasPaymentStatus={hasPaymentStatus}
                                handleClearSearch={handleClearSearch}
                                handleClearFilters={handleClearFilters}
                                handleToggleCreateNew={handleToggleCreateNew}
                            />
                        }
                    />
                )}
            </View>
            <AnimatePresence>
                {selectedPaymentLink && (
                    <ActionsModal
                        // key={selectedPaymentLink._id}
                        isVisible={!!selectedPaymentLink}
                        onClose={handleCloseActions}
                        paymentLink={selectedPaymentLink}
                        countries={countries}
                    />
                )}
            </AnimatePresence>
            <CreatePaymentModal
                isVisible={isCreateNewOpen}
                onClose={handleToggleCreateNew}
            />

            <FiltersModal
                isVisible={isFiltersOpen}
                onClose={handleToggleFilters}
                filters={filters}
                setFilters={setFilters}
            />
            <CountyCodeBottomSheet
                onClose={() => { countyCodeBottomSheetRef.current?.close() }}
                ref={countyCodeBottomSheetRef}
                countries={countries}
            />
        </SafeAreaView>
    );
};

export default memo(PaymentLinksScreen);