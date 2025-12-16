import { cn } from '@/src/core/utils/cn';
import DetailsTab from "@/src/modules/payments/components/detail/details-tabs/DetailsTab";
import HistoryTab from "@/src/modules/payments/components/detail/details-tabs/HistoryTab";
import SettlementTab from "@/src/modules/payments/components/detail/details-tabs/SettlementTab";
import DetailsTabs from "@/src/modules/payments/components/detail/DetailsTabs";
import Button from '@/src/shared/components/Buttons/Button';
import ConfirmationModal from '@/src/shared/components/ConfirmationModal/ConfirmationModal';
import FailedToLoad from '@/src/shared/components/errors/FailedToLoad';
import MainHeader from '@/src/shared/components/headers/MainHeader';
import FadeInDownView from '@/src/shared/components/wrappers/animated-wrappers/FadeInDownView';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';
import ScaleView from '@/src/shared/components/wrappers/animated-wrappers/ScaleView';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CaptureConfirmation from '../components/modals/CaptureConfirmation';
import RefundConfirmation from '../components/modals/RefundConfirmation';
import VoidConfirmation from '../components/modals/VoidConfirmation';
import { OrderSummaryCard, } from '../components/order-detail';
import { OrderDetailsTabType } from '../payments.model';
import { isCaptureAvailable, isRefundAvailable, isVoidAvailable } from '../utils/action-validators';
import { useOrderDetailVM } from '../viewmodels';
import { useOrderActionsVM } from '../viewmodels/useOrderActionsVM';
import SimpleLoader from '@/src/shared/components/loaders/SimpleLoader';

// Sticky tab threshold offset
const STICKY_TAB_OFFSET = 10;

const OrderDetailsScreen = () => {
    const { _id } = useLocalSearchParams<{ _id: string }>();
    const { t } = useTranslation();
    const { order, isLoading, isError, error, refetch } = useOrderDetailVM(_id || '');
    const [activeTab, setActiveTab] = useState<OrderDetailsTabType>('details');
    const [isTabsSticky, setIsTabsSticky] = useState(false);
    const [summaryHeight, setSummaryHeight] = useState(0);

    // Action modals state
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showCaptureModal, setShowCaptureModal] = useState(false);

    // Actions viewmodel
    const {
        voidOrder,
        isVoidingOrder,
        refundOrder: refundOrderMutation,
        isRefundingOrder,
        captureOrder: captureOrderMutation,
        isCapturingOrder,
    } = useOrderActionsVM(_id || '');

    // Determine button visibility
    const canVoid = order ? isVoidAvailable(order) : false;
    const canRefund = order ? isRefundAvailable(order) : false;
    const canCapture = order ? isCaptureAvailable(order) : false;
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

    // Capture handlers
    const handleCapturePress = () => {
        setShowCaptureModal(true);
    };

    const handleCaptureConfirm = () => {
        if (!order) return;
        captureOrderMutation(
            { orderId: order.orderId },
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
                <MainHeader title={t('Order Details')} />
                <FadeInDownView className="justify-center items-center flex-1" delay={200} duration={500}>
                    <SimpleLoader size={100} />
                </FadeInDownView>
            </SafeAreaView>
        );
    }
    if (isError || !order) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <MainHeader title={t('Order Details')} />
                <FailedToLoad refetch={refetch} title={t('Failed to load order')}
                    message={error?.message || t('An error occurred while loading the order details')} />
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView className="flex-1 bg-white">
            <FadeInDownView delay={0} duration={600}>
                <MainHeader title={t('Order Details')}
                    className={cn(isTabsSticky ? "mb-0 border-0 pb-0" : "mb-6 border-b")}
                />
            </FadeInDownView>
            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View className="px-4">
                        {/* Order Summary Card - Measure height */}
                        <ScaleView delay={150} duration={600}>
                            <View
                                onLayout={(event) => {
                                    const { height } = event.nativeEvent.layout;
                                    setSummaryHeight(height);
                                }}
                            >
                                <OrderSummaryCard order={order} />
                            </View>
                        </ScaleView>

                        {/* Tabs - Normal position (hidden when sticky to prevent duplicate) */}
                        <View style={{ opacity: isTabsSticky ? 0 : 1, }}>
                            <ScaleView delay={300} duration={600}>
                                <DetailsTabs
                                    value={activeTab}
                                    onSelectType={setActiveTab}
                                    className={cn(isTabsSticky ? "mt-0" : "my-4")}
                                />
                            </ScaleView>
                        </View>

                        {/* Tab Content */}
                        <FadeInUpView key={activeTab} delay={400} duration={400}>
                            {activeTab === 'details' && <DetailsTab order={order} />}
                            {activeTab === 'settlement' && <SettlementTab order={order} />}
                            {activeTab === 'history' && <HistoryTab order={order} />}
                        </FadeInUpView>

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

            {/* Capture Confirmation Modal */}
            {order && (
                <ConfirmationModal
                    isVisible={showCaptureModal}
                    onClose={handleCaptureCancel}
                    title={t('Capture Transaction')}
                >
                    <CaptureConfirmation
                        order={order}
                        onConfirm={handleCaptureConfirm}
                        onCancel={handleCaptureCancel}
                        isCapturing={isCapturingOrder}
                    />
                </ConfirmationModal>
            )}
        </SafeAreaView>
    )
}

export default OrderDetailsScreen