import { cn } from "@/src/core/utils/cn";
import { GroupedRow } from "@/src/core/utils/groupData";
import { FadeInDownView } from "@/src/shared/components/wrappers/animated-wrappers";
import ScaleFadeIn from "@/src/shared/components/wrappers/animated-wrappers/ScaleView";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentLinkCardSkeleton from "../../payment-links/components/PaymentLinkCardSkeleton";
import { FetchSessionsParams, PaymentSession, Transaction } from "../../payments/payments.model";
import InstantSettlementHeader from "./components/header/InstantSettlementHeader";
import InstantSettlementCard from "./components/InstantSettlementCard";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { currencyNumber } from "@/src/core/utils/number-fields";
import { PressableScale } from "pressto";
import Button from "@/src/shared/components/Buttons/Button";
import { ArrowSmallUpIcon, XCircleIcon } from "react-native-heroicons/outline";
import { selectToken, selectUser, useAuthStore } from "../../auth/auth.store";
const InstantSettlementScreen = () => {
  const { t } = useTranslation();
  const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<PaymentSession | Transaction>>>>(null);
  const isLoading = false;
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const [search, setSearchValue] = useState('');
  const [filters, setFilters] = useState<FetchSessionsParams>();
  const [selectedItem, setSelectedItem] = useState<null>(null);
  const isOrdersTab = status === "sessions";
  const userToken = useAuthStore(selectToken);
  console.log('userToken', userToken);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  // const hasActiveFilters = useMemo(() => {
  //   const filterKeysToIgnore = ['page', 'limit', 'search', 'q', 'sortType', 'sortBy'];
  //   return Object.entries(filters).some(([key, value]) => {
  //     if (filterKeysToIgnore.includes(key)) return false;
  //     return value !== undefined && value !== '';
  //   });
  // }, [filters]);
  const hasActiveFilters = false;
  const listData = [];
  const isListEmpty = useMemo(() =>
    listData.length === 0 && !isLoading && !search && !hasActiveFilters,
    [listData.length, isLoading, search, hasActiveFilters]
  );
  // Fetch Orders (Sessions)
  // const ordersQuery = useOrdersVM({
  //   ...ordersFilters,
  //   q: search,
  // });
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
              {currencyNumber(1212)} {t('EGP')}
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
              {'1212'}
            </FontText>
          </View>
        </ScaleFadeIn>
      </View>

      <View className="flex-row items-center gap-x-5 px-6 mb-6">
        <View className="flex-1">
          <Button
            title={t('Payout now')}
            onPress={() => { }}
            icon={<ArrowSmallUpIcon size={18} color={'#919C9C'} />}
            className="flex-row gap-x-1 w-full"
            titleClasses='text-sm'
          />
        </View>
        <View className="flex-1">
          <Button
            variant='outline'
            title={t('Unselect all')}
            onPress={() => { }}
            icon={<XCircleIcon size={18} color={'#001F5F'} />}
            className="flex-row gap-x-1 border-0 w-full"
            titleClasses='text-sm'
          />
        </View>
      </View>
      {isLoading ? (
        <View className={cn("flex-1 px-6 mt-6")}>
          <PaymentLinkCardSkeleton />
        </View>
      ) : (
        <>
          <ScaleFadeIn delay={200} duration={600}>
            <View>

            </View>
          </ScaleFadeIn>
          <View className={cn("flex-1 px-6")}>
            <InstantSettlementCard />
            {/* <StickyHeaderList
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
            /> */}
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default InstantSettlementScreen