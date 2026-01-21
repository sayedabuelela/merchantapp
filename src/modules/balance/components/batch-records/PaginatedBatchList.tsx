import { View, FlatList, ActivityIndicator } from "react-native";
import { ActivityRecord, TransactionRecord } from "../../balance.model";
import ActivityCard from "../ActivityCard";
import TransactionCard from "@/src/modules/payments/components/transactions-list/TransactionCard";
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
  const renderItem = ({ item }: { item: ActivityRecord | TransactionRecord }) => {
    if (isActivityRecord(item)) {
      const props = adaptActivityRecordToCardProps(item, accountName);
      return <ActivityCard key={item.recordId} {...props} />;
    }

    if (isTransactionRecord(item)) {
      const transaction = adaptTransactionRecordToTransaction(item);
      return <TransactionCard key={item.transactionId} transaction={transaction} />;
    }

    return null;
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#556767" />
      </View>
    );
  };

  return (
    <View className="mt-5 max-h-[400px]">
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          isActivityRecord(item)
            ? `record-${item.recordId}-${index}`
            : `tx-${item.transactionId}-${index}`
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default PaginatedBatchList;
