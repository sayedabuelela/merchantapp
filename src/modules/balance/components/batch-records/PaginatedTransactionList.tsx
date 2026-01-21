import { View, FlatList, ActivityIndicator } from "react-native";
import { Transaction } from "@/src/modules/payments/payments.model";
import TransactionCard from "@/src/modules/payments/components/transactions-list/TransactionCard";

interface PaginatedTransactionListProps {
  transactions: Transaction[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const PaginatedTransactionList = ({
  transactions,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: PaginatedTransactionListProps) => {
  const renderItem = ({ item }: { item: Transaction }) => {
    return <TransactionCard key={item._id} transaction={item} />;
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
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id}-${item.transactionId}-${index}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default PaginatedTransactionList;
