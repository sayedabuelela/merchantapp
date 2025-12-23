import { SafeAreaView } from "react-native-safe-area-context";
import PaymentsHeader from "../components/header/PaymentsHeader";
import PaymentsTabs from "../components/PaymentsTabs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OrderCard from "@/src/modules/payments/components/orders-list/OrderCard";
import TransactionCard from "@/src/modules/payments/components/transactions-list/TransactionCard";
import { cn } from "@/src/core/utils/cn";
import { View } from "react-native";
import { useOrdersVM, useTransactionsVM } from "@/src/modules/payments/viewmodels";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import { GroupedRow } from "@/src/core/utils/groupData";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import { PaymentSession, Transaction, FetchSessionsParams, FetchTransactionsParams } from "@/src/modules/payments/payments.model";
import PaymentFilterModal from "../components/PaymentFilterModal";
import ActionsModal from "../components/modals/ActionsModal";
import { AnimatePresence } from 'moti';
import { FlashList } from "@shopify/flash-list";
import PaymentsListEmpty from "../components/PaymentsListEmpty";
import CreatePaymentModal from "@/src/modules/payment-links/components/modals/CreatePaymentModal";
import SimpleLoader from "@/src/shared/components/loaders/SimpleLoader";
import SkeletonLoader from "@/src/shared/components/loaders/SkeletonLoader";
import PaymentLinkCardSkeleton from "../../payment-links/components/PaymentLinkCardSkeleton";
import FadeInDownView from "@/src/shared/components/wrappers/animated-wrappers/FadeInDownView";
import FadeInUpView from "@/src/shared/components/wrappers/animated-wrappers/FadeInUpView";
import AnimatedListItem from "@/src/shared/components/wrappers/animated-wrappers/AnimatedListItem";
import ScaleFadeIn from "@/src/shared/components/wrappers/animated-wrappers/ScaleView";

const INITIAL_ORDERS_FILTERS: FetchSessionsParams = {
    dateFrom: undefined,
    dateTo: undefined,
    sortType: -1,
    channel: undefined,
    status: undefined,
    method: undefined,
    origin: undefined,
    branchName: undefined,
    filterStatus: undefined,
};

const INITIAL_TRANSACTIONS_FILTERS: FetchTransactionsParams = {
    startDate: undefined,
    endDate: undefined,
    sortType: -1,
    status: undefined,
    channel: undefined,
    method: undefined,
    type: undefined,
    discount: undefined,
    posBranch: undefined,
};

const PaymentsScreen = () => {
    const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<PaymentSession | Transaction>>>>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
    const [search, setSearchValue] = useState('');
    const [status, setStatus] = useState<string>("sessions");
    const [ordersFilters, setOrdersFilters] = useState<FetchSessionsParams>(INITIAL_ORDERS_FILTERS);
    const [transactionsFilters, setTransactionsFilters] = useState<FetchTransactionsParams>(INITIAL_TRANSACTIONS_FILTERS);
    const [selectedPayment, setSelectedPayment] = useState<PaymentSession | Transaction | null>(null);

    const isOrdersTab = status === "sessions";
    const activeFilters = isOrdersTab ? ordersFilters : transactionsFilters;
    const setActiveFilters = isOrdersTab ? setOrdersFilters : setTransactionsFilters;

    // Scroll to top when tab changes
    useEffect(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [status]);

    const hasActiveFilters = useMemo(() => {
        const filterKeysToIgnore = ['page', 'limit', 'search', 'sortType', 'sortBy'];
        return Object.entries(activeFilters).some(([key, value]) => {
            if (filterKeysToIgnore.includes(key)) return false;
            return value !== undefined && value !== '';
        });
    }, [activeFilters]);

    // Fetch Orders (Sessions)
    const ordersQuery = useOrdersVM({
        ...ordersFilters,
        search,
    });

    // Fetch Transactions
    const transactionsQuery = useTransactionsVM({
        ...transactionsFilters,
        search,
    });
    // Use the appropriate query based on active tab
    const activeQuery = isOrdersTab ? ordersQuery : transactionsQuery;

    const {
        listData,
        stickyHeaderIndices,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = activeQuery;

    const isListEmpty = useMemo(() =>
        listData.length === 0 && !isLoading && !search && !hasActiveFilters,
        [listData.length, isLoading, search, hasActiveFilters]
    );

    const handleOpenActions = useCallback((item: PaymentSession | Transaction) => {
        setSelectedPayment(item);
    }, []);

    const handleCloseActions = useCallback(() => {
        setSelectedPayment(null);
    }, []);

    const renderItem = useCallback(({ item, index }: { item: GroupedRow<PaymentSession | Transaction>; index: number }) => {
        console.log('PaymentsScreen item', item);

        if (item.type === 'header') return <HeaderRow title={item.date} />;

        // Calculate the actual item index (excluding headers)
        const itemsBefore = listData.slice(0, index).filter(i => i.type !== 'header').length;

        if (isOrdersTab) {
            return (
                <AnimatedListItem index={itemsBefore} delay={250} staggerDelay={40} duration={400}>
                    <OrderCard payment={item as PaymentSession} onOpenActions={handleOpenActions} />
                </AnimatedListItem>
            );
        } else {
            return (
                <AnimatedListItem index={itemsBefore} delay={250} staggerDelay={40} duration={400}>
                    <TransactionCard transaction={item as Transaction} onOpenActions={handleOpenActions} />
                </AnimatedListItem>
            );
        }
    }, [handleOpenActions, isOrdersTab, listData]);

    const handleClearSearch = useCallback(() => {
        setSearchValue('');
    }, []);

    const handleSearchChange = useCallback((text: string) => {
        setSearchValue(text);
    }, []);

    const handleToggleCreateNew = useCallback(() => {
        setIsCreateNewOpen(prev => !prev);
    }, []);

    const handleClearFilters = useCallback(() => {
        if (isOrdersTab) {
            setOrdersFilters(INITIAL_ORDERS_FILTERS);
        } else {
            setTransactionsFilters(INITIAL_TRANSACTIONS_FILTERS);
        }
    }, [isOrdersTab]);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <FadeInDownView delay={0} duration={300}>
                <PaymentsHeader
                    onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
                    onSubmitSearch={handleSearchChange}
                    isFilterOpen={isFiltersOpen}
                    isListEmpty={isListEmpty}
                    hasFilters={hasActiveFilters}
                    handleClearSearch={handleClearSearch}
                    searchValue={search}
                />
            </FadeInDownView>
            {isLoading ? (
                <View className={cn("flex-1 px-6 mt-6")}>
                    <PaymentLinkCardSkeleton />
                </View>
            ) : (
                <>
                    <ScaleFadeIn delay={200} duration={600}>
                        <PaymentsTabs
                            value={status}
                            onSelectType={setStatus}
                            isListEmpty={isListEmpty}
                            contentContainerClassName="mx-auto"
                        />
                    </ScaleFadeIn>
                    <View className={cn("flex-1 px-6")}>
                        <StickyHeaderList
                            ref={listRef}
                            listData={listData}
                            stickyHeaderIndices={stickyHeaderIndices}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            renderItem={renderItem}
                            refreshing={activeQuery.isRefetching}
                            onRefresh={activeQuery.refetch}
                            ListEmptyComponent={
                                <PaymentsListEmpty
                                    currentTab={isOrdersTab ? 'sessions' : 'transactions'}
                                    search={search}
                                    hasFilters={hasActiveFilters}
                                    handleClearSearch={handleClearSearch}
                                    handleClearFilters={handleClearFilters}
                                    handleCreatePaymentLink={handleToggleCreateNew}
                                />
                            }
                        />
                    </View>
                </>
            )}
            <AnimatePresence>
                {selectedPayment && (
                    <ActionsModal
                        isVisible={!!selectedPayment}
                        onClose={handleCloseActions}
                        payment={selectedPayment}
                        type={isOrdersTab ? "order" : "transaction"}
                    />
                )}
            </AnimatePresence>
            <PaymentFilterModal
                isVisible={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                filters={activeFilters}
                setFilters={setActiveFilters as any}
                currentTab={isOrdersTab ? "sessions" : "transactions"}
            />
            <CreatePaymentModal
                isVisible={isCreateNewOpen}
                onClose={handleToggleCreateNew}
            />
        </SafeAreaView>
    )
}

export default PaymentsScreen;