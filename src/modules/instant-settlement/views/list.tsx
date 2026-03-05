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
import { View } from "react-native";
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

type RequestStatus = 'idle' | 'success' | 'error';

const InstantSettlementScreen = () => {
  const { t } = useTranslation();
  const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<SettlementTransaction>>>>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearchValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryData, setInquiryData] = useState<InstantSettlementInquiryResponse | null>(null);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle');
  const [requestErrorMsg, setRequestErrorMsg] = useState('');
  const user = useAuthStore(selectUser);
  const { canEditBalance } = usePermissions(user?.actions!);
  console.log('selectedIds', Array.from(selectedIds));

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
  });

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
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(transaction.transactionId)) {
          next.delete(transaction.transactionId);
        } else {
          next.add(transaction.transactionId);
        }
        return next;
      });
    }
  }, []);

  const handleUnselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handlePayoutNow = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setRequestStatus('idle');
    try {
      const data = await inquireSettlementAsync({ transactionIds: Array.from(selectedIds) });
      setInquiryData(data);
      setShowInquiryModal(true);
    } catch {
      // Error toast already handled by the VM
    }
  }, [selectedIds, inquireSettlementAsync]);

  const handleRequestPayout = useCallback(async () => {
    try {
      await requestSettlementAsync({ transactionIds: Array.from(selectedIds) });
      setShowInquiryModal(false);
      setRequestStatus('success');
      setSelectedIds(new Set());
    } catch (error: any) {
      setShowInquiryModal(false);
      setRequestStatus('error');
      setRequestErrorMsg(
        error.response?.data?.message || t('Failed to submit settlement request')
      );
    }
  }, [selectedIds, requestSettlementAsync, t]);

  const renderItem = useCallback(({ item, index }: { item: GroupedRow<SettlementTransaction>; index: number }) => {
    if (item.type === 'header') return <HeaderRow title={item.date} />;

    const itemsBefore = listData.slice(0, index).filter(i => i.type !== 'header').length;
    const transaction = item as SettlementTransaction;

    return (
      <AnimatedListItem index={itemsBefore} delay={250} staggerDelay={40} duration={400}>
        <InstantSettlementCard
          transaction={transaction}
          isSelected={selectedIds.has(transaction.transactionId)}
          onToggleSelect={handleToggleSelect}
        />
      </AnimatedListItem>
    );
  }, [listData, selectedIds, handleToggleSelect]);

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
        />
      </FadeInDownView>
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
            disabled={selectedIds.size === 0 || isInquiring || !canEditBalance}
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
            icon={<XCircleIcon size={18} color={selectedIds.size === 0 ? '#919C9C' : '#001F5F'} />}
            className="flex-row gap-x-1 border-0 w-full bg-white"
            titleClasses='text-sm'
            disabled={selectedIds.size === 0}
          />
        </View>
      </View>

      {/* Success / Error banners */}
      <View className="px-6">
        <AnimatedSuccessMsg
          successMsg={requestStatus === 'success' ? t('Your instant settlement request has been submitted successfully') : ''}
        />
        {requestStatus === 'error' && (
          <View className="flex-row p-4 mb-6 rounded items-center bg-feedback-error-bg border border-error">
            <ExclamationTriangleIcon size={24} color="#D32F2F" />
            <FontText
              type="body"
              weight="regular"
              className="text-xs text-feedback-error ml-2 flex-1 flex-wrap"
            >
              {requestErrorMsg}
            </FontText>
            <View className="flex-row gap-x-2 ml-2">
              <Button
                variant="outline"
                title={t('Dismiss')}
                onPress={() => setRequestStatus('idle')}
                className="border-0 py-1 px-2"
                titleClasses="text-xs"
              />
            </View>
          </View>
        )}
      </View>

      {isLoading ? (
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
