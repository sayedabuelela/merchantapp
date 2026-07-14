import { cn } from "@/src/core/utils/cn";
import AnimatedInfoMsg from "@/src/shared/components/animated-messages/AnimatedInfoMsg";
import { GroupedRow } from "@/src/core/utils/groupData";
import AnimatedListItem from "@/src/shared/components/wrappers/animated-wrappers/AnimatedListItem";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import {
    ArrowSmallUpIcon,
    BanknotesIcon,
    CheckCircleIcon,
    PencilSquareIcon,
    XCircleIcon,
} from "react-native-heroicons/outline";
import { toast } from "sonner-native";
import PaymentLinkCardSkeleton from "../../../payment-links/components/PaymentLinkCardSkeleton";
import type { EligibleQueryParams } from "../../dto/instant-settlement.dto";
import type { EligibleTransaction } from "../../domain/instant-settlement.models";
import { useEligibleTransactionsVM } from "../../viewmodels/useEligibleTransactionsVM";
import { useFetchAllEligible } from "../../viewmodels/useFetchAllEligible";
import { useInstantSettlementActionsVM } from "../../viewmodels/useInstantSettlementActionsVM";
import InstantSettlementCard from "../components/InstantSettlementCard";
import SettlementSummaryCard from "../components/SettlementSummaryCard";
import DailyLimitCard from "../components/DailyLimitCard";
import ConfirmPayoutSheet, { ConfirmPayoutSheetRef } from "../components/ConfirmPayoutSheet";
import CustomAmountSheet, { CustomAmountSheetRef } from "../components/CustomAmountSheet";

interface Props {
    params: EligibleQueryParams;
    canCreateInstantSettlement: boolean;
    enabled: boolean;
    onRequestSuccess: () => void;
}

const NewRequestTab = ({ params, canCreateInstantSettlement, enabled, onRequestSuccess }: Props) => {
    const { t } = useTranslation();
    const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<EligibleTransaction>>>>(null);
    const confirmSheetRef = useRef<ConfirmPayoutSheetRef>(null);
    const customAmountSheetRef = useRef<CustomAmountSheetRef>(null);

    const [selected, setSelected] = useState<Map<string, string>>(new Map());
    // transaction set currently driving the inquiry/confirm sheet — sourced from
    // either the manual selection or a custom-amount suggestion.
    const [pendingTxIds, setPendingTxIds] = useState<string[]>([]);

    // Reset selection when the search/filter params change — the previous result
    // set is stale, so its transactionIds must not survive into a new query (§5).
    useEffect(() => {
        setSelected(new Map());
    }, [params.requestId, params.dateFrom, params.dateTo]);

    const {
        listData,
        stickyHeaderIndices,
        summary,
        limits,
        totalEligibleCount,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isRefetching,
        refetch,
    } = useEligibleTransactionsVM(params, enabled);

    const { fetchAll, isFetchingAll } = useFetchAllEligible();
    const {
        inquireSettlementAsync,
        isInquiring,
        inquiryData,
        createRequestAsync,
        isRequesting,
    } = useInstantSettlementActionsVM();

    const isAllSelected = totalEligibleCount > 0 && selected.size === totalEligibleCount;

    const handleToggleSelect = useCallback((tx: EligibleTransaction) => {
        setSelected((prev) => {
            const next = new Map(prev);
            if (next.has(tx.id)) next.delete(tx.id);
            else next.set(tx.id, tx.accountId);
            return next;
        });
    }, []);

    const handleSelectAll = useCallback(async () => {
        if (isAllSelected) {
            setSelected(new Map());
            return;
        }
        // fetch ALL eligible pages, then select every row (§5)
        const all = await fetchAll(params);
        if (!all) {
            toast.error(t('Could not select all transactions'), {
                richColors: true,
                style: { borderWidth: 0 },
            });
            return; // selection unchanged on failure
        }
        setSelected(new Map(all.map((tx) => [tx.id, tx.accountId])));
    }, [isAllSelected, fetchAll, params, t]);

    const transactionIds = useMemo(() => Array.from(selected.keys()), [selected]);

    // Run inquiry for a transaction set, then open the confirm sheet. Shared by
    // the manual "Payout now" path and the custom-amount suggestion path.
    const runInquiry = useCallback(async (ids: string[]) => {
        if (ids.length === 0) return;
        setPendingTxIds(ids);
        try {
            await inquireSettlementAsync({ transactionIds: ids });
            confirmSheetRef.current?.expand();
        } catch {
            // error toast handled by the VM
        }
    }, [inquireSettlementAsync]);

    const handlePayoutNow = useCallback(
        () => runInquiry(transactionIds),
        [runInquiry, transactionIds],
    );

    const handleConfirmRequest = useCallback(async () => {
        if (isRequesting) return; // dup-submit guard
        try {
            await createRequestAsync({ transactionIds: pendingTxIds });
            confirmSheetRef.current?.close();
            setSelected(new Map());
            onRequestSuccess();
        } catch {
            // keep the sheet open so the user can retry with context intact (§5).
            // error toast is surfaced by the VM.
        }
    }, [isRequesting, createRequestAsync, pendingTxIds, onRequestSuccess]);

    const renderItem = useCallback(
        ({ item, index }: { item: GroupedRow<EligibleTransaction>; index: number }) => {
            if (item.type === 'header') {
                const isFirstHeader = index === 0;
                return (
                    <View className="flex-row items-center justify-between px-6">
                        <HeaderRow title={item.date} />
                        {isFirstHeader && (
                            <Pressable
                                onPress={handleSelectAll}
                                disabled={isFetchingAll}
                                className="flex-row items-center gap-x-1"
                            >
                                {isAllSelected ? (
                                    <XCircleIcon size={18} color="#001F5F" />
                                ) : (
                                    <CheckCircleIcon size={18} color="#001F5F" />
                                )}
                                <FontText type="body" weight="semi" className="text-primary text-sm">
                                    {isFetchingAll
                                        ? t('Selecting…')
                                        : isAllSelected
                                            ? t('Unselect all')
                                            : t('Select all')}
                                </FontText>
                            </Pressable>
                        )}
                    </View>
                );
            }

            const itemsBefore = listData.slice(0, index).filter((i) => i.type !== 'header').length;
            return (
                <AnimatedListItem index={itemsBefore} delay={250} staggerDelay={40} duration={400}>
                    <View className="px-6">
                        <InstantSettlementCard
                            transaction={item}
                            isSelected={selected.has(item.id)}
                            onToggleSelect={handleToggleSelect}
                        />
                    </View>
                </AnimatedListItem>
            );
        },
        [listData, selected, handleToggleSelect, handleSelectAll, isAllSelected, isFetchingAll, t],
    );

    const listHeader = (
        <View>
            <View className="px-6">
                <AnimatedInfoMsg
                    className="mt-1 mb-4"
                    infoMsg={t('Now you could instantly settle Card and Wallet transactions, Select transaction and click Payout.')}
                />
            </View>

            <SettlementSummaryCard
                totalAmount={summary?.totalAmount ?? 0}
                ordersCount={summary?.count ?? 0}
            />

            <DailyLimitCard limits={limits} />

            <View className="flex-row items-center gap-x-5 px-6 mb-6">
                <View className="flex-1">
                    <Button
                        title={t('Payout now')}
                        onPress={handlePayoutNow}
                        disabled={selected.size === 0 || isInquiring || !canCreateInstantSettlement}
                        isLoading={isInquiring}
                        icon={<ArrowSmallUpIcon size={18} color={'#919C9C'} />}
                        className="flex-row gap-x-1 w-full"
                        titleClasses="text-sm"
                    />
                </View>
                <View className="flex-1">
                    <Button
                        variant="outline"
                        title={t('Custom amount')}
                        onPress={() => customAmountSheetRef.current?.expand()}
                        disabled={!canCreateInstantSettlement}
                        icon={<PencilSquareIcon size={18} color="#001F5F" />}
                        className="flex-row gap-x-1 border-0 w-full bg-white"
                        titleClasses="text-sm"
                    />
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1">
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
                keyExtractor={(item) => (item.type === 'header' ? `header-${item.date}` : item.id)}
                ListHeaderComponent={listHeader}
                ListEmptyComponent={
                    isLoading ? (
                        <View className={cn("px-6")}>
                            <PaymentLinkCardSkeleton />
                        </View>
                    ) : (
                        <EmptyDataList
                            icon={<BanknotesIcon size={48} color="#919C9C" />}
                            title={t('No transactions')}
                            description={t('No settlement transactions found')}
                        />
                    )
                }
            />

            <ConfirmPayoutSheet
                ref={confirmSheetRef}
                inquiry={inquiryData ?? null}
                isRequesting={isRequesting}
                onConfirm={handleConfirmRequest}
                onClose={() => {}}
            />
            <CustomAmountSheet
                ref={customAmountSheetRef}
                params={params}
                onConfirm={runInquiry}
                onClose={() => {}}
            />
        </View>
    );
};

export default NewRequestTab;
