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
import OrderDetailsTabs from "@/src/modules/payments/components/detail/OrderDetailsTabs";
import { OrderDetailsTabType } from '../payments.model';
import { useState } from 'react';

const OrderDetailsScreen = () => {
    const {_id} = useLocalSearchParams<{ _id: string }>();
    const {t} = useTranslation();
    const {order, isLoading, isError, error, refetch} = useOrderDetailVM(_id || '');
    const [activeTab, setActiveTab] = useState<OrderDetailsTabType>('details');
    const [isTabsSticky, setIsTabsSticky] = useState(false);
    const [summaryHeight, setSummaryHeight] = useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setIsTabsSticky(scrollY > summaryHeight - 10);
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
            <MainHeader title={t('Order Details')}/>
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
                        <View style={{ opacity: isTabsSticky ? 0 : 1 }}>
                            <OrderDetailsTabs value={activeTab} onSelectType={setActiveTab} />
                        </View>

                        {/* Tab Content */}
                        {activeTab === 'details' && <DetailsTab order={order} />}
                        {activeTab === 'settlement' && <SettlementTab order={order} />}
                        {activeTab === 'history' && <HistoryTab order={order} />}

                        <View className="h-6"/>
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
                            elevation: 3
                        }}
                    >
                        <OrderDetailsTabs value={activeTab} onSelectType={setActiveTab} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default OrderDetailsScreen