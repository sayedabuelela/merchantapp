import { View, ActivityIndicator, Pressable } from "react-native";
import { Transaction } from "@/src/modules/payments/payments.model";
import TransactionCard from "@/src/modules/payments/components/transactions-list/TransactionCard";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <View className="mt-5">
      {transactions.map((item, index) => (
        <TransactionCard key={`${item._id}-${item.transactionId}-${index}`} transaction={item} />
      ))}
      {isFetchingNextPage && (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#556767" />
        </View>
      )}
      {hasNextPage && !isFetchingNextPage && onLoadMore && (
        <Pressable onPress={onLoadMore} className="py-4 items-center">
          <FontText type="body" weight="semibold" className="text-primary text-sm">
            {t("Load more")}
          </FontText>
        </Pressable>
      )}
    </View>
  );
};

export default PaginatedTransactionList;
