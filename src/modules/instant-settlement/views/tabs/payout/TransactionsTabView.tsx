import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { formatAMPM } from "@/src/core/utils/dateUtils";
import { cn } from "@/src/core/utils/cn";
import { GroupedRow, groupByDate } from "@/src/core/utils/groupData";
import { currencyNumber } from "@/src/core/utils/number-fields";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import FontText from "@/src/shared/components/FontText";
import IconBox from "@/src/shared/components/wrappers/IconBox";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import PaymentLinkCardSkeleton from "@/src/modules/payment-links/components/PaymentLinkCardSkeleton";
import { Link } from "expo-router";
import { PressableScale } from "pressto";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { ArrowSmallDownIcon, ArrowSmallUpIcon, BanknotesIcon } from "react-native-heroicons/outline";
import type { EligibleTransaction } from "../../../domain/instant-settlement.models";
import { useInstantRequestTransactionsVM } from "../../../viewmodels/useInstantRequestTransactionsVM";

interface Props {
    uuid: string;
}

const CURRENCY = 'EGP';

/** `pay` is the backend enum for an inbound payment — surface it as "Payment". */
const isPaymentOperation = (operation: string) =>
    ['pay', 'payment'].includes((operation || '').toLowerCase());

const TransactionRow = ({ tx }: { tx: EligibleTransaction }) => {
    const { t } = useTranslation();
    const isPayment = isPaymentOperation(tx.operation);
    const operationLabel = isPayment ? t('Payment') : tx.operation;
    const methodLine = [tx.method, tx.channel].filter(Boolean).join(' - ');

    return (
        <Link href={`/payments/transaction/${tx.id}`} asChild>
            <PressableScale>
                <View className="border-[1.5px] rounded border-tertiary p-4 mb-2">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-x-2">
                            <IconBox className={cn(isPayment ? 'bg-[#D1FFD3] border border-[#AEFFB2]' : 'bg-[#FFEAED] border border-[#FEE4E7]')}>
                                {isPayment ? (
                                    <ArrowSmallDownIcon size={10} color="#1A541D" />
                                ) : (
                                    <ArrowSmallUpIcon size={10} color="#A50017" />
                                )}
                            </IconBox>
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs capitalize">
                                {operationLabel || t('Payment')}
                            </FontText>
                        </View>
                        <FontText type="body" weight="bold" className="text-[#4AAB4E] text-sm">
                            +{currencyNumber(tx.amount)} {t(CURRENCY)}
                        </FontText>
                    </View>
                    <View className="flex-row items-center justify-between">
                        {!!methodLine && (
                            <FontText type="body" weight="regular" className="text-content-primary text-xs capitalize">
                                {methodLine}
                            </FontText>
                        )}
                        {!!tx.status && <StatusBox status={tx.status} />}
                    </View>
                    {!!tx.accountId && (
                        <FontText type="body" weight="regular" className="text-content-primary text-xs mt-1 self-start">
                            {tx.accountId}
                        </FontText>
                    )}
                    <FontText type="body" weight="regular" className="text-content-secondary text-[10px] mt-1 self-start">
                        {formatAMPM(tx.createdAt)}
                    </FontText>
                    {!!tx.orderId && (
                        <View className="flex-row items-center mt-2">
                            <FontText type="body" weight="regular" className="text-content-secondary text-[10px] uppercase bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary">
                                {tx.orderId}
                            </FontText>
                        </View>
                    )}
                </View>
            </PressableScale>
        </Link>
    );
};

/** Transactions tab — member txns (`/{uuid}/transactions`, paginated). */
const TransactionsTabView = ({ uuid }: Props) => {
    const { t } = useTranslation();

    const {
        transactions,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isRefetching,
        refetch,
    } = useInstantRequestTransactionsVM(uuid);

    const grouped = useMemo(() => groupByDate(transactions, 'createdAt'), [transactions]);
    const { listData, stickyHeaderIndices } = useGroupedData(transactions.length ? grouped : []);

    const renderItem = useCallback(
        ({ item }: { item: GroupedRow<EligibleTransaction> }) => {
            if (item.type === 'header') return <HeaderRow title={item.date} />;
            return <TransactionRow tx={item} />;
        },
        [],
    );

    if (isLoading) {
        return (
            <View className="flex-1 px-6 mt-6">
                <PaymentLinkCardSkeleton />
            </View>
        );
    }

    return (
        <View className="flex-1 px-6 mt-2">
            <StickyHeaderList<EligibleTransaction>
                listData={listData}
                stickyHeaderIndices={stickyHeaderIndices}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={renderItem}
                refreshing={isRefetching}
                onRefresh={refetch}
                keyExtractor={(item) => (item.type === 'header' ? `header-${item.date}` : item.id)}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4">
                            <ActivityIndicator color="#001F5F" />
                        </View>
                    ) : undefined
                }
                ListEmptyComponent={
                    <EmptyDataList
                        icon={<BanknotesIcon size={48} color="#919C9C" />}
                        title={t('No transactions')}
                        description={t('No transactions for this request')}
                    />
                }
            />
        </View>
    );
};

export default TransactionsTabView;
