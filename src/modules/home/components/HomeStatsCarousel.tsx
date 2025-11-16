import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { MotiView } from 'moti'
import BalanceStatsCard from '../../balance/components/header/BalanceStatsCard'
import { AccountStatistics, FlattenedDashboardStatistics, TransfersStatistics } from '../../balance/balance.model'
import { useTranslation } from 'react-i18next'

const { width } = Dimensions.get('window')
const CARD_PADDING = 24
const CARD_WIDTH = width - (CARD_PADDING * 2)

interface HomeStatsCarouselProps {
    accountStats?: AccountStatistics
    transfersStats?: TransfersStatistics
    dashboardStats?: FlattenedDashboardStatistics
}

const HomeStatsCarousel = ({ accountStats, transfersStats, dashboardStats }: HomeStatsCarouselProps) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList>(null)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x
        const index = Math.round(scrollPosition / CARD_WIDTH)
        setCurrentIndex(index)
    }

    const cardsData = [
        {
            id: 'card-1',
            mainBalance: {
                title: t('Available Balance'),
                value: accountStats?.balanceOverview?.availableBalance || 0,
                currency: 'EGP'
            },
            leftDetail: {
                title: t('Total Balance'),
                value: accountStats?.balanceOverview?.totalBalance || 0,
                currency: 'EGP'
            },
            rightDetail: {
                title: t('Held funds'),
                value: transfersStats?.onGoingTransfersAmount || 0,
                currency: 'EGP'
            }
        },
        {
            id: 'card-2',
            mainBalance: {
                title: t('Today\'s total payments'),
                value: dashboardStats?.currentStatistic?.totalPaymentAmount || 0,
                currency: 'EGP'
            },
            leftDetail: {
                title: t('Transactions'),
                value: dashboardStats?.currentStatistic?.totalTransactionsCount || 0,
                currency: ''
            },
            rightDetail: {
                title: t('Top Method'),
                value: dashboardStats?.topMethod || '--',
                currency: ''
            }
        }
    ];

    return (
        <View>
            {/* Carousel Container with Overflow Hidden */}
            <View style={{ overflow: 'hidden', marginHorizontal: CARD_PADDING, position: 'relative' }}>
                <FlatList
                    ref={flatListRef}
                    data={cardsData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    renderItem={({ item }) => (
                        <View style={{ width: CARD_WIDTH }}>
                            <BalanceStatsCard
                                mainBalance={item.mainBalance}
                                leftDetail={item.leftDetail}
                                rightDetail={item.rightDetail}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />

                {/* Page Indicator - Inside Card */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 0,
                        right: 0,
                    }}
                    className="flex-row justify-center items-center gap-2"
                >
                    {cardsData.map((_, index) => (
                        <MotiView
                            key={index}
                            animate={{
                                width: currentIndex === index ? 16 : 8,
                                backgroundColor: currentIndex === index ? '#1E40AF' : '#D1D5DB',
                            }}
                            transition={{
                                type: 'timing',
                                duration: 300,
                            }}
                            className="h-1 rounded-full"
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

export default HomeStatsCarousel