import FaildToLoad from '@/src/shared/components/errors/FailedToLoad';
import MainHeader from '@/src/shared/components/headers/MainHeader';
import SimpleLoader from '@/src/shared/components/loaders/SimpleLoader';
import { useLocalSearchParams } from 'expo-router';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native'
import { TransactionSummaryCard, TransactionMethodCard, TransactionCustomerCard, TransactionAdditionalCard } from '../components/transaction-detail';
import { useTransactionDetailVM } from '../viewmodels';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionDetailsScreen = () => {
    const { t } = useTranslation();
    const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
    const { transaction, isLoading, isError, error, refetch } = useTransactionDetailVM(transactionId || '');

    if (isLoading) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title={t('Transaction Details')} />
                <SimpleLoader />
            </View>
        );
    }

    if (isError || !transaction) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title={t('Transaction Details')} />
                <FaildToLoad refetch={refetch} title={t('Failed to load transaction')} message={error?.message || t('An error occurred while loading the transaction details')} />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader title={t('Transaction Details')} />
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                <TransactionSummaryCard transaction={transaction} />
                <TransactionMethodCard transaction={transaction} />
                <TransactionCustomerCard transaction={transaction} />
                <TransactionAdditionalCard transaction={transaction} />
                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}
export default TransactionDetailsScreen;