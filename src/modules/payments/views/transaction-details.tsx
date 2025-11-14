import FaildToLoad from '@/src/shared/components/errors/FailedToLoad';
import MainHeader from '@/src/shared/components/headers/MainHeader';
import SimpleLoader from '@/src/shared/components/loaders/SimpleLoader';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { TransactionSummaryCard } from '../components/transaction-detail';
import { useTransactionDetailVM } from '../viewmodels';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailsTab from '../components/detail/transaction-tabs/DetailsTab';
import SettlementTab from '../components/detail/transaction-tabs/SettlementTab';
import HistoryTab from '../components/detail/transaction-tabs/HistoryTab';
import DetailsTabs from '../components/detail/DetailsTabs';
import { TransactionDetailsTabType } from '../payments.model';
import { useState } from 'react';

// Sticky tab threshold offset
const STICKY_TAB_OFFSET = 10;

const TransactionDetailsScreen = () => {
    const { t } = useTranslation();
    const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
    const { transaction, isLoading, isError, error, refetch } = useTransactionDetailVM(
        transactionId || ''
    );
    const [activeTab, setActiveTab] = useState<TransactionDetailsTabType>('details');
    const [isTabsSticky, setIsTabsSticky] = useState(false);
    const [summaryHeight, setSummaryHeight] = useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setIsTabsSticky(scrollY > summaryHeight - STICKY_TAB_OFFSET);
    };

    if (isError || !transaction) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title={t('Transaction Details')} />
                <FaildToLoad
                    refetch={refetch}
                    title={t('Failed to load transaction')}
                    message={
                        error?.message ||
                        t('An error occurred while loading the transaction details')
                    }
                />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title={t('Transaction Details')} />
                <SimpleLoader />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader title={t('Transaction Details')} />
            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View className="px-4">
                        {/* Transaction Summary Card - Measure height */}
                        <View
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                setSummaryHeight(height);
                            }}
                        >
                            <TransactionSummaryCard transaction={transaction} />
                        </View>

                        {/* Tabs - Normal position (hidden when sticky to prevent duplicate) */}
                        <View style={{ opacity: isTabsSticky ? 0 : 1 }}>
                            <DetailsTabs
                                value={activeTab}
                                onSelectType={setActiveTab}
                            />
                        </View>

                        {/* Tab Content */}
                        {activeTab === 'details' && <DetailsTab transaction={transaction} />}
                        {activeTab === 'settlement' && (
                            <SettlementTab transaction={transaction} />
                        )}
                        {activeTab === 'history' && <HistoryTab transaction={transaction} />}

                        <View className="h-6" />
                    </View>
                </ScrollView>

                {/* Sticky Tabs - Fixed position at top when scrolled */}
                {isTabsSticky && (
                    <View
                        className="absolute top-0 left-0 right-0 px-4 bg-white"
                        style={{
                            zIndex: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}
                    >
                        <DetailsTabs value={activeTab} onSelectType={setActiveTab} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default TransactionDetailsScreen;