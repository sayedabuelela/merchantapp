import { cn } from "@/src/core/utils/cn";
import { GroupedRow } from "@/src/core/utils/groupData";
import { currencyNumber } from "@/src/core/utils/number-fields";
import { FadeInDownView } from "@/src/shared/components/wrappers/animated-wrappers";
import ScaleFadeIn from "@/src/shared/components/wrappers/animated-wrappers/ScaleView";
import AnimatedListItem from "@/src/shared/components/wrappers/animated-wrappers/AnimatedListItem";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import AnimatedSuccessMsg from "@/src/shared/components/animated-messages/AnimatedSuccessMsg";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo, useRef, useState } from "react";
import { I18nManager, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentLinkCardSkeleton from "../../payment-links/components/PaymentLinkCardSkeleton";
import { InstantSettlementInquiryResponse, SettlementTransaction } from "../instant-settlement.model";
import { useSettlementTransactionsVM } from "../viewmodels/useSettlementTransactionsVM";
import { useInstantSettlementActionsVM } from "../viewmodels/useInstantSettlementActionsVM";
import InstantSettlementHeader from "./components/header/InstantSettlementHeader";
import InstantSettlementCard from "./components/InstantSettlementCard";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import Button from "@/src/shared/components/Buttons/Button";
import { ArrowSmallUpIcon, XCircleIcon, BanknotesIcon, ExclamationTriangleIcon } from "react-native-heroicons/outline";
import InstantInquiryModal from "./components/InstantInquiryModal";
import { selectUser, useAuthStore } from "../../auth/auth.store";
import usePermissions from "../../auth/hooks/usePermissions";
import AnimatedInfoMsg from "@/src/shared/components/animated-messages/AnimatedInfoMsg";
import { isInstantSettlementUnavailable } from "@/src/core/utils/serviceAvailability";

type RequestStatus = 'idle' | 'success' | 'error';

const InstantSettlementScreen = () => {
  const { t } = useTranslation();
  const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<SettlementTransaction>>>>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearchValue] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<Map<string, string>>(new Map());
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryData, setInquiryData] = useState<InstantSettlementInquiryResponse | null>(null);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle');
  const user = useAuthStore(selectUser);
  const { canEditBalance } = usePermissions(user?.actions!);
  const isUnavailable = isInstantSettlementUnavailable();

  const {
    listData,
    stickyHeaderIndices,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    instantSummary
  } = useSettlementTransactionsVM({
    search: search || undefined,
  }, !isUnavailable);

  const {
    inquireSettlementAsync,
    isInquiring,
    requestSettlementAsync,
    isRequesting,
  } = useInstantSettlementActionsVM();

  const hasActiveFilters = false;

  const isListEmpty = useMemo(() =>
    listData.length === 0 && !isLoading && !search && !hasActiveFilters,
    [listData.length, isLoading, search, hasActiveFilters]
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  const handleToggleSelect = useCallback((transaction: SettlementTransaction) => {
    if (transaction.status === 'Approved') {
      setSelectedTransactions(prev => {
        const next = new Map(prev);
        if (next.has(transaction.transactionId)) {
          next.delete(transaction.transactionId);
        } else {
          next.set(transaction.transactionId, transaction.pcc?.account_id ?? '');
        }
        return next;
      });
    }
  }, []);

  const handleUnselectAll = useCallback(() => {
    setSelectedTransactions(new Map());
  }, []);

  const buildTransactionsPayload = useCallback(() => {
    return Array.from(selectedTransactions.entries()).map(([transactionId, accountId]) => ({
      transactionId,
      accountId,
    }));
  }, [selectedTransactions]);

  const handlePayoutNow = useCallback(async () => {
    if (selectedTransactions.size === 0) return;
    setRequestStatus('idle');
    try {
      const data = await inquireSettlementAsync({ transactions: buildTransactionsPayload() });
      setInquiryData(data);
      setShowInquiryModal(true);
    } catch {
      // Error toast already handled by the VM
    }
  }, [selectedTransactions, inquireSettlementAsync, buildTransactionsPayload]);

  const handleRequestPayout = useCallback(async () => {
    try {
      await requestSettlementAsync({ transactions: buildTransactionsPayload() });
      setShowInquiryModal(false);
      setRequestStatus('success');
      setSelectedTransactions(new Map());
    } catch (error: any) {
      setShowInquiryModal(false);
      setRequestStatus('error');
    }
  }, [selectedTransactions, requestSettlementAsync, buildTransactionsPayload, t]);

  const renderItem = useCallback(({ item, index }: { item: GroupedRow<SettlementTransaction>; index: number }) => {
    if (item.type === 'header') return <HeaderRow title={item.date} />;

    const itemsBefore = listData.slice(0, index).filter(i => i.type !== 'header').length;
    const transaction: SettlementTransaction = item;

    return (
      <AnimatedListItem index={itemsBefore} delay={250} staggerDelay={40} duration={400}>
        <InstantSettlementCard
          transaction={transaction}
          isSelected={selectedTransactions.has(transaction.transactionId)}
          onToggleSelect={handleToggleSelect}
        />
      </AnimatedListItem>
    );
  }, [listData, selectedTransactions, handleToggleSelect]);
  const infoMsg = isUnavailable
    ? t('Settlement services during the Eid holiday period suspended and will work normally after this period')
    : t('Now you could instantly settle Card and Wallet transactions, Select transaction and click Payout.')
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FadeInDownView delay={0} duration={300}>
        <InstantSettlementHeader
          onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
          onSubmitSearch={handleSearchChange}
          isFilterOpen={isFiltersOpen}
          isListEmpty={isListEmpty}
          hasFilters={hasActiveFilters}
          handleClearSearch={handleClearSearch}
          searchValue={search}
          showFilters={false}
          backBtn
        />
      </FadeInDownView>
      <View className="px-6">
        <AnimatedInfoMsg className="mt-0" infoMsg={infoMsg} />
      </View>
      <View className="flex-row items-center px-6 gap-x-5 mb-6">
        <ScaleFadeIn delay={0} duration={400} className="flex-1">
          <View className="items-center justify-center border rounded border-stroke-main bg-surface-secondary py-3">
            <FontText
              type="body"
              weight="regular"
              className='text-xxs text-content-secondary mb-1 uppercase'
            >
              {t('Total amount')}
            </FontText>
            <FontText
              type="body"
              weight="semi"
              className='text-sm text-content-primary uppercase'
            >
              {currencyNumber(instantSummary?.totalAmount ?? 0)} {t('EGP')}
            </FontText>
          </View>
        </ScaleFadeIn>
        <ScaleFadeIn delay={0} duration={400} className="flex-1">
          <View className="items-center justify-center border rounded border-stroke-main bg-surface-secondary py-3 ">
            <FontText
              type="body"
              weight="regular"
              className='text-xxs text-content-secondary mb-1 uppercase'
            >
              {t('Orders')}
            </FontText>
            <FontText
              type="body"
              weight="semi"
              className='text-sm text-content-primary uppercase'
            >
              {instantSummary?.orderCount}
            </FontText>
          </View>
        </ScaleFadeIn>
      </View>

      <View className="flex-row items-center gap-x-5 px-6 mb-6">
        <View className="flex-1">
          <Button
            title={t('Payout now')}
            onPress={handlePayoutNow}
            disabled={selectedTransactions.size === 0 || isInquiring || !canEditBalance}
            isLoading={isInquiring}
            icon={<ArrowSmallUpIcon size={18} color={'#919C9C'} />}
            className="flex-row gap-x-1 w-full"
            titleClasses='text-sm'
          />
        </View>
        <View className="flex-1">
          <Button
            variant='outline'
            title={t('Unselect all')}
            onPress={handleUnselectAll}
            icon={<XCircleIcon size={18} color={selectedTransactions.size === 0 ? '#919C9C' : '#001F5F'} />}
            className="flex-row gap-x-1 border-0 w-full bg-white"
            titleClasses='text-sm'
            disabled={selectedTransactions.size === 0}
          />
        </View>
      </View>

      {/* Success / Error banners */}
      <View className="px-6">
        <AnimatedSuccessMsg
          successMsg={requestStatus === 'success' ? t('Your instant settlement request has been submitted successfully') : ''}
        />
      </View>
      {isUnavailable ? null : isLoading ? (
        <View className={cn("flex-1 px-6 mt-6")}>
          <PaymentLinkCardSkeleton />
        </View>
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
            ListEmptyComponent={
              <EmptyDataList
                icon={<BanknotesIcon size={48} color="#919C9C" />}
                title={t('No transactions')}
                description={t('No settlement transactions found')}
                buttonLabel={search ? t('Clear search') : undefined}
                onButtonPress={search ? handleClearSearch : undefined}
                buttonIconType="xicon"
                buttonVariant="outline"
              />
            }
          />
        </View>
      )}
      <InstantInquiryModal
        isVisible={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        inquiryData={inquiryData}
        onRequestPayout={handleRequestPayout}
        isRequesting={isRequesting}
      />
    </SafeAreaView>
  )
}

export default InstantSettlementScreen
