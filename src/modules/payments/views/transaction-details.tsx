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
import Button from '@/src/shared/components/Buttons/Button';
import { useTransactionActionsVM } from '../viewmodels/useTransactionActionsVM';
import { isVoidAvailableForTransaction, isRefundAvailableForTransaction, isCaptureAvailableForTransaction } from '../utils/action-validators';
import VoidConfirmationTransaction from '../components/modals/VoidConfirmationTransaction';
import RefundConfirmationTransaction from '../components/modals/RefundConfirmationTransaction';
import CaptureConfirmationTransaction from '../components/modals/CaptureConfirmationTransaction';
import ConfirmationModal from '@/src/shared/components/ConfirmationModal/ConfirmationModal';
import FadeInDownView from '@/src/shared/components/wrappers/animated-wrappers/FadeInDownView';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';
import ScaleView from '@/src/shared/components/wrappers/animated-wrappers/ScaleView';
import DetailsSkeleton from '../components/DetailsSkeleton';
import { ArrowUturnLeftIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { cn } from '@/src/core/utils/cn';
import { selectUser, useAuthStore } from '../../auth/auth.store';
import usePermissions from '../../auth/hooks/usePermissions';

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
    console.log('transaction : ', transaction);
    // Action modals state
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showCaptureModal, setShowCaptureModal] = useState(false);
    const user = useAuthStore(selectUser);
    const { canRefundTransactions } = usePermissions(user?.actions || {});
    // Actions viewmodel
    const {
        voidTransaction,
        isVoidingTransaction,
        refundTransaction: refundTransactionMutation,
        isRefundingTransaction,
        captureTransaction: captureTransactionMutation,
        isCapturingTransaction,
    } = useTransactionActionsVM(transactionId || '');

    // Determine button visibility
    const canVoid = transaction ? isVoidAvailableForTransaction(transaction) : false;
    const canRefund = transaction ? isRefundAvailableForTransaction(transaction) : false;
    const canCapture = transaction ? isCaptureAvailableForTransaction(transaction) : false;
    const showActionButtons = canVoid || canRefund || canCapture;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setIsTabsSticky(scrollY > summaryHeight - STICKY_TAB_OFFSET);
    };

    // Void handlers
    const handleVoidPress = () => {
        setShowVoidModal(true);
    };

    const handleVoidConfirm = () => {
        if (!transaction || !transaction.order?.orderId) return;
        voidTransaction(
            { orderId: transaction.order.orderId },
            {
                onSuccess: () => {
                    setShowVoidModal(false);
                },
            }
        );
    };

    const handleVoidCancel = () => {
        setShowVoidModal(false);
    };

    // Refund handlers
    const handleRefundPress = () => {
        setShowRefundModal(true);
    };

    const handleRefundConfirm = (amount: number) => {
        if (!transaction || !transaction.order?.orderId) return;

        // Get cardDataToken from either flat structure or nested cardInfo
        const cardDataToken =
            transaction.sourceOfFunds?.cardDataToken ||
            transaction.sourceOfFunds?.cardInfo?.cardDataToken;

        // Check if POS refund
        const isPosRefund =
            transaction.paymentChannel?.toLowerCase() === 'pos' &&
            transaction.method === 'card' &&
            !!cardDataToken;

        // POS refunds use transaction.id (UUID) in the URL, regular refunds use order.orderId
        const refundOrderId = isPosRefund && transaction.id
            ? transaction.id
            : transaction.order.orderId;

        refundTransactionMutation(
            {
                orderId: refundOrderId,
                amount,
                currency: transaction.currency,
                isPosRefund,
                merchantId: isPosRefund ? transaction.merchantId : undefined,
                terminalId: isPosRefund ? transaction.posTerminal?.terminalId : undefined,
                cardDataToken: isPosRefund ? cardDataToken : undefined,
                // Include targetTransactionId for transaction POS refunds
                targetTransactionId: isPosRefund ? transaction.transactionId : undefined,
            },
            {
                onSuccess: () => {
                    setShowRefundModal(false);
                },
            }
        );
    };

    const handleRefundCancel = () => {
        setShowRefundModal(false);
    };

    // Capture handlers
    const handleCapturePress = () => {
        setShowCaptureModal(true);
    };

    const handleCaptureConfirm = () => {
        if (!transaction || !transaction.order?.orderId) return;
        captureTransactionMutation(
            { orderId: transaction.order.orderId },
            {
                onSuccess: () => {
                    setShowCaptureModal(false);
                },
            }
        );
    };

    const handleCaptureCancel = () => {
        setShowCaptureModal(false);
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white ">
                <MainHeader title={t('Transaction Details')} />
                <FadeInDownView className="flex-1" delay={0} duration={500}>
                    <DetailsSkeleton />
                </FadeInDownView>
            </SafeAreaView>
        );
    }
    if (isError || !transaction) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <MainHeader title={t('Transaction Details')} />
                <FaildToLoad
                    refetch={refetch}
                    title={t('Failed to load transaction')}
                    message={
                        error?.message ||
                        t('An error occurred while loading the transaction details')
                    }
                />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <FadeInDownView delay={0} duration={600}>
                <MainHeader title={t('Transaction Details')}
                    className={cn(isTabsSticky ? "mb-0 border-0 pb-0" : "mb-0 border-b")}
                />
            </FadeInDownView>
            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View className="px-6">
                        {/* Transaction Summary Card - Measure height */}
                        <ScaleView delay={150} duration={600}>
                            <View
                                onLayout={(event) => {
                                    const { height } = event.nativeEvent.layout;
                                    setSummaryHeight(height);
                                }}
                            >
                                <TransactionSummaryCard transaction={transaction} />
                            </View>
                        </ScaleView>

                        {/* Tabs - Normal position (hidden when sticky to prevent duplicate) */}
                        <View style={{ opacity: isTabsSticky ? 0 : 1 }}>
                            <FadeInUpView delay={300} duration={600}>
                                <DetailsTabs
                                    value={activeTab}
                                    onSelectType={setActiveTab}
                                    contentContainerClassName={cn(isTabsSticky ? 'px-6' : 'px-0')}
                                />
                            </FadeInUpView>
                        </View>

                        {/* Tab Content */}
                        <FadeInUpView key={activeTab} delay={0} duration={400}>
                            {activeTab === 'details' && <DetailsTab transaction={transaction} />}
                            {activeTab === 'settlement' && (<SettlementTab transaction={transaction} />)}
                            {activeTab === 'history' && <HistoryTab transaction={transaction} />}
                        </FadeInUpView>

                        {/* Extra padding at bottom to prevent content from being hidden by action buttons */}
                        <View className={showActionButtons ? "h-20" : "h-6"} />
                    </View>
                </ScrollView>

                {/* Sticky Tabs - Fixed position at top when scrolled */}
                {isTabsSticky && (
                    <View
                        className="absolute top-0 left-0 right-0 px-4 bg-white"
                        style={{
                            zIndex: 10,
                            // shadowColor: '#000',
                            // shadowOffset: { width: 0, height: 2 },
                            // shadowOpacity: 0.1,
                            // shadowRadius: 3,
                            // elevation: 3,
                        }}
                    >
                        <DetailsTabs value={activeTab} onSelectType={setActiveTab} className='mb-0' contentContainerClassName={cn(isTabsSticky ? 'px-6' : 'px-0')} />
                    </View>
                )}

                {/* Fixed Bottom Action Buttons */}
                {canRefundTransactions && showActionButtons && (
                    <View className="p-4 border-t border-stroke-divider bg-white">
                        <View className="flex-row gap-x-3">
                            {canVoid && (
                                <View className="flex-1">
                                    <Button
                                        title={t('Void')}
                                        variant="danger"
                                        onPress={handleVoidPress}
                                        className="bg-feedback-error flex-row items-center justify-center gap-x-2 h-10"
                                        titleClasses="text-white text-sm"
                                        icon={<XMarkIcon size={20} color="white" />}
                                    />
                                </View>
                            )}
                            {canRefund && (
                                <View className="flex-1">
                                    <Button
                                        title={t('Refund')}
                                        variant="outline"
                                        className="border-feedback-error flex-row items-center justify-center gap-x-2 h-10"
                                        titleClasses="text-feedback-error text-sm"
                                        onPress={handleRefundPress}
                                        icon={<ArrowUturnLeftIcon size={20} color="#D32F2F" />}
                                    />
                                </View>
                            )}
                            {canCapture && (
                                <View className="flex-1">
                                    <Button
                                        title={t('Capture')}
                                        variant="primary"
                                        onPress={handleCapturePress}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>

            {/* Void Confirmation Modal */}
            {transaction && (
                <ConfirmationModal
                    isVisible={showVoidModal}
                    onClose={handleVoidCancel}
                    title={t('Void Transaction')}
                >
                    <VoidConfirmationTransaction
                        transaction={transaction}
                        onConfirm={handleVoidConfirm}
                        onCancel={handleVoidCancel}
                        isVoiding={isVoidingTransaction}
                    />
                </ConfirmationModal>
            )}

            {/* Refund Confirmation Modal */}
            {transaction && (
                <ConfirmationModal
                    isVisible={showRefundModal}
                    onClose={handleRefundCancel}
                    title={t('Refund Transaction')}
                >
                    <RefundConfirmationTransaction
                        transaction={transaction}
                        onConfirm={handleRefundConfirm}
                        onCancel={handleRefundCancel}
                        isRefunding={isRefundingTransaction}
                        transactionId={transactionId || ''}
                    />
                </ConfirmationModal>
            )}

            {/* Capture Confirmation Modal */}
            {transaction && (
                <ConfirmationModal
                    isVisible={showCaptureModal}
                    onClose={handleCaptureCancel}
                    title={t('Capture Transaction')}
                >
                    <CaptureConfirmationTransaction
                        transaction={transaction}
                        onConfirm={handleCaptureConfirm}
                        onCancel={handleCaptureCancel}
                        isCapturing={isCapturingTransaction}
                    />
                </ConfirmationModal>
            )}
        </SafeAreaView>
    );
};

export default TransactionDetailsScreen;