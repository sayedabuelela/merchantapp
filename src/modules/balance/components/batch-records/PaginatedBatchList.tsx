import { View, ActivityIndicator, Pressable } from "react-native";
import { ActivityRecord, TransactionRecord } from "../../balance.model";
import ActivityCard from "../ActivityCard";
import TransactionCard from "@/src/modules/payments/components/transactions-list/TransactionCard";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import {
  adaptActivityRecordToCardProps,
  adaptTransactionRecordToTransaction,
  isActivityRecord,
  isTransactionRecord,
} from "./adapters";

interface PaginatedBatchListProps {
  records: (ActivityRecord | TransactionRecord)[];
  accountName?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const PaginatedBatchList = ({
  records,
  accountName,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: PaginatedBatchListProps) => {
  const { t } = useTranslation();

  const renderItem = (item: ActivityRecord | TransactionRecord, index: number) => {
    if (isActivityRecord(item)) {
      const props = adaptActivityRecordToCardProps(item, accountName);
      return <ActivityCard key={`record-${item.recordId}-${index}`} {...props} />;
    }

    if (isTransactionRecord(item)) {
      const transaction = adaptTransactionRecordToTransaction(item);
      return <TransactionCard key={`tx-${item.transactionId}-${index}`} transaction={transaction} />;
    }

    return null;
  };

  return (
    <View className="mt-5">
      {records.map((item, index) => renderItem(item, index))}
      {isFetchingNextPage && (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#556767" />
        </View>
      )}
      {hasNextPage && !isFetchingNextPage && onLoadMore && (
        <Pressable onPress={onLoadMore} className="py-4 items-center">
          <FontText type="body" weight="semi" className="text-primary text-sm">
            {t("Load more")}
          </FontText>
        </Pressable>
      )}
    </View>
  );
};

export default PaginatedBatchList;
