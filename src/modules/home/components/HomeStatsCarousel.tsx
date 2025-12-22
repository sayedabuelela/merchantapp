import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { MotiView } from 'moti'
import BalanceStatsCard from '../../balance/components/header/BalanceStatsCard'
import { AccountStatistics, PaymentsStatistics, PayoutStatistics, TransfersStatistics } from '../../balance/balance.model'
import { useTranslation } from 'react-i18next'
import { HomeTabType } from '../home.model'
import { Mode } from '@/src/core/environment/environments'
import { useEnvironmentStore, selectMode } from '@/src/core/environment/environments.store' 
const { width } = Dimensions.get('window')
const CARD_PADDING = 24
const CARD_WIDTH = width - (CARD_PADDING * 2)

interface HomeStatsCarouselProps {
    accountStats?: AccountStatistics
    transfersStats?: TransfersStatistics
    paymentsStats?: PaymentsStatistics
    payoutStats?: PayoutStatistics
    setHomeActiveTab: (tab: HomeTabType) => void
    activeTab: HomeTabType
}
type CardItem = {
    id: 'balance-card' | 'payments-card' | 'payouts-card' | 'transfers-card'
    tab: HomeTabType
    mainBalance: { title: string; value: number; currency: string }
    leftDetail: { title: string; value: number | string; currency: string }
    rightDetail: { title: string; value: number | string; currency: string }
}
const HomeStatsCarousel = ({ accountStats, transfersStats, paymentsStats, payoutStats, setHomeActiveTab, activeTab }: HomeStatsCarouselProps) => {
    const { t } = useTranslation()
    const [currentIndex, setCurrentIndex] = useState(0)
    const mode = useEnvironmentStore(selectMode)
    const flatListRef = useRef<FlatList<CardItem>>(null)
    const isProgrammaticScroll = useRef(false)
    // const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    //     const scrollPosition = event.nativeEvent.contentOffset.x
    //     const index = Math.round(scrollPosition / CARD_WIDTH)
    //     setCurrentIndex(index)
    //     setHomeActiveTab(Object.keys(CARD_IDS)[index] as HomeTabType)
    // }
    // console.log('mode : ', accountStats?.balanceOverview?.availableBalance);
    const cardsData: CardItem[] = useMemo(() => ([
        {
            id: 'balance-card',
            tab: 'all',
            mainBalance: { title: t('Available Balance'), value: mode === Mode.LIVE ? accountStats?.balanceOverview?.availableBalance || 0 : 0, currency: 'EGP' },
            leftDetail: { title: t('Last settlement'), value: mode === Mode.LIVE ? accountStats?.balanceOverview?.lastPayoutAmount || 0 : 0, currency: 'EGP' },
            rightDetail: { title: t('Upcoming settlement'), value: mode === Mode.LIVE ? accountStats?.balanceOverview?.lastPayoutAmount || 0 : 0, currency: 'EGP' },
        },
        {
            id: 'payments-card',
            tab: 'orders',
            mainBalance: { title: t('total payments'), value: paymentsStats?.amount || 0, currency: 'EGP' },
            leftDetail: { title: t('Payments No.'), value: paymentsStats?.count || 0, currency: '' },
            rightDetail: { title: t('Top Method'), value: paymentsStats?.topMethod || '--', currency: '' },
        },
        {
            id: 'payouts-card',
            tab: 'payouts',
            mainBalance: { title: t('Payout'), value: payoutStats?.amount || 0, currency: 'EGP' },
            leftDetail: { title: t('Last Payout'), value: payoutStats?.lastPayout || 0, currency: '' },
            rightDetail: { title: t('Upcoming Payout'), value: payoutStats?.upcomingPayouts || 0, currency: '' },
        },
        {
            id: 'transfers-card',
            tab: 'transfers',
            mainBalance: { title: t('total trasfers'), value: transfersStats?.totalTransfersAmount || 0, currency: 'EGP' },
            leftDetail: { title: t('transfers no.'), value: transfersStats?.totalTransfersCount || 0, currency: '' },
            rightDetail: { title: t('Transfers Vol.'), value: transfersStats?.totalTransfersAmount || 0, currency: '' },
        },
    ]), [t, accountStats, paymentsStats, payoutStats, transfersStats, mode])

    const tabToIndex = useMemo(() => {
        return cardsData.reduce<Record<HomeTabType, number>>((acc, card, idx) => {
            acc[card.tab] = idx
            return acc
        }, {} as Record<HomeTabType, number>)
    }, [cardsData])

    const scrollToCardIndex = useCallback((index: number) => {
        const clamped = Math.max(0, Math.min(index, cardsData.length - 1))
        isProgrammaticScroll.current = true
        setCurrentIndex(clamped)
        flatListRef.current?.scrollToIndex({ index: clamped, animated: true })
    }, [cardsData.length])

    // ✅ include deps; stable now because cardsData/tabToIndex are stable
    useEffect(() => {
        const nextIndex = tabToIndex[activeTab] ?? 0
        if (nextIndex !== currentIndex) scrollToCardIndex(nextIndex)
    }, [activeTab, tabToIndex, currentIndex, scrollToCardIndex])

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollX = event.nativeEvent.contentOffset.x
        const index = Math.round(scrollX / CARD_WIDTH)

        setCurrentIndex(index)

        if (isProgrammaticScroll.current) {
            isProgrammaticScroll.current = false
            return
        }

        setHomeActiveTab(cardsData[index]?.tab ?? 'all')
    }
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
                    getItemLayout={(_, index) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * index, index })}
                    // onScroll={handleScroll}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
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