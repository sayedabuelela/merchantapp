import MainHeader from '@/src/shared/components/headers/MainHeader'
import {useLocalSearchParams} from 'expo-router';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context'
import {useOrderDetailVM} from '../viewmodels';
import SimpleLoader from '@/src/shared/components/loaders/SimpleLoader';
import {ScrollView, View, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {OrderSummaryCard,} from '../components/order-detail';
import FailedToLoad from '@/src/shared/components/errors/FailedToLoad';
import DetailsTab from "@/src/modules/payments/components/detail/details-tabs/DetailsTab";
import SettlementTab from "@/src/modules/payments/components/detail/details-tabs/SettlementTab";
import HistoryTab from "@/src/modules/payments/components/detail/details-tabs/HistoryTab";
import DetailsTabs from "@/src/modules/payments/components/detail/DetailsTabs";
import { OrderDetailsTabType } from '../payments.model';
import { useState } from 'react';
import Button from '@/src/shared/components/Buttons/Button';
import { useOrderActionsVM } from '../viewmodels/useOrderActionsVM';
import { isVoidAvailable, isRefundAvailable } from '../utils/action-validators';
import VoidConfirmation from '../components/modals/VoidConfirmation';
import RefundConfirmation from '../components/modals/RefundConfirmation';
import ConfirmationModal from '@/src/shared/components/ConfirmationModal/ConfirmationModal';
import { cn } from '@/src/core/utils/cn';

// Sticky tab threshold offset
const STICKY_TAB_OFFSET = 10;

const OrderDetailsScreen = () => {
    const {_id} = useLocalSearchParams<{ _id: string }>();
    const {t} = useTranslation();
    const {order, isLoading, isError, error, refetch} = useOrderDetailVM(_id || '');
    const [activeTab, setActiveTab] = useState<OrderDetailsTabType>('details');
    const [isTabsSticky, setIsTabsSticky] = useState(false);
    const [summaryHeight, setSummaryHeight] = useState(0);

    // Action modals state
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);

    // Actions viewmodel
    const {
        voidOrder,
        isVoidingOrder,
        refundOrder: refundOrderMutation,
        isRefundingOrder,
    } = useOrderActionsVM(_id || '');

    // Determine button visibility
    const canVoid = order ? isVoidAvailable(order) : false;
    const canRefund = order ? isRefundAvailable(order) : false;
    const showActionButtons = canVoid || canRefund;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setIsTabsSticky(scrollY > summaryHeight - STICKY_TAB_OFFSET);
    };

    // Void handlers
    const handleVoidPress = () => {
        setShowVoidModal(true);
    };

    const handleVoidConfirm = () => {
        if (!order) return;
        voidOrder(
            { orderId: order.orderId },
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
        if (!order) return;

        // Check if POS refund
        const isPosRefund =
            order.paymentChannel?.toLowerCase() === 'pos' &&
            order.method === 'card' &&
            !!order.sourceOfFunds?.cardDataToken;

        refundOrderMutation(
            {
                orderId: order.orderId,
                amount,
                currency: order.currency,
                isPosRefund,
                merchantId: isPosRefund ? order.merchantId : undefined,
                terminalId: isPosRefund ? order.posTerminal?.terminalId : undefined,
                cardDataToken: isPosRefund ? order.sourceOfFunds?.cardDataToken : undefined,
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

    if (isError || !order) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title={t('Order Details')}/>
                <FailedToLoad refetch={refetch} title={t('Failed to load order')}
                              message={error?.message || t('An error occurred while loading the order details')}/>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title={t('Order Details')}/>
                <SimpleLoader/>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader title={t('Order Details')}
                        className={cn( isTabsSticky ? "mb-0 border-0 pb-0" : "mb-6 border-b")}
            />
            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View className="px-4">
                        {/* Order Summary Card - Measure height */}
                        <View
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                setSummaryHeight(height);
                            }}
                        >
                            <OrderSummaryCard order={order}/>
                        </View>

                        {/* Tabs - Normal position (hidden when sticky to prevent duplicate) */}
                        <View style={{ opacity: isTabsSticky ? 0 : 1,}}>
                            <DetailsTabs 
                            value={activeTab} 
                            onSelectType={setActiveTab} 
                            className={cn(isTabsSticky ? "mt-0" : "my-4")}
                            />
                        </View>

                        {/* Tab Content */}
                        {activeTab === 'details' && <DetailsTab order={order} />}
                        {activeTab === 'settlement' && <SettlementTab order={order} />}
                        {activeTab === 'history' && <HistoryTab order={order} />}

                        {/* Extra padding at bottom to prevent content from being hidden by action buttons */}
                        <View className={showActionButtons ? "h-24" : "h-6"} />
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
                            // elevation: 3
                        }}
                    >
                        <DetailsTabs value={activeTab} onSelectType={setActiveTab} />
                    </View>
                )}

                {/* Fixed Bottom Action Buttons */}
                {showActionButtons && (
                    <View className="px-4 pb-4 pt-3 border-t border-stroke-divider bg-white">
                        <View className="flex-row gap-x-3">
                            {canVoid && (
                                <View className="flex-1">
                                    <Button
                                        title={t('Void')}
                                        variant="outline"
                                        onPress={handleVoidPress}
                                        className="border-feedback-error"
                                        titleClasses="text-feedback-error"
                                    />
                                </View>
                            )}
                            {canRefund && (
                                <View className="flex-1">
                                    <Button
                                        title={t('Refund')}
                                        variant="danger"
                                        onPress={handleRefundPress}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>

            {/* Void Confirmation Modal */}
            {order && (
                <ConfirmationModal
                    isVisible={showVoidModal}
                    onClose={handleVoidCancel}
                    title={t('Void Transaction')}
                >
                    <VoidConfirmation
                        order={order}
                        onConfirm={handleVoidConfirm}
                        onCancel={handleVoidCancel}
                        isVoiding={isVoidingOrder}
                    />
                </ConfirmationModal>
            )}

            {/* Refund Confirmation Modal */}
            {order && (
                <ConfirmationModal
                    isVisible={showRefundModal}
                    onClose={handleRefundCancel}
                    title={t('Refund Transaction')}
                >
                    <RefundConfirmation
                        order={order}
                        onConfirm={handleRefundConfirm}
                        onCancel={handleRefundCancel}
                        isRefunding={isRefundingOrder}
                    />
                </ConfirmationModal>
            )}
        </SafeAreaView>
    )
}

export default OrderDetailsScreen