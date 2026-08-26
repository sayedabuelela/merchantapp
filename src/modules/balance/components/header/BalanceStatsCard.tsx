import React from 'react'
import { Pressable, View } from 'react-native'
import BalanceHeaderItem from './BalanceHeaderItem'
import { useRouter, useSegments } from 'expo-router'
import { useEnvironmentStore, selectMode } from '@/src/core/environment/environments.store'
import { Mode } from '@/src/core/environment/environments'
interface BalanceStatsCardProps {
    mainBalance: {
        title: string
        value: number | string
        currency: string
        /** Only the payments card follows the currency picker, so only it can be virtual. */
        isVirtual?: boolean
    }
    leftDetail: {
        title: string
        value: number | string
        currency: string
    }
    rightDetail: {
        title: string
        value: number | string
        currency: string
    }
    /**
     * Abbreviate the currency on all three figures ("ج.م" rather than "جنيه مصري").
     * On by default nowhere: only the home carousel opts in, where the card is narrow
     * enough that the full Arabic name wraps the headline figure onto two lines. The
     * balance screen has the room and keeps the full name.
     */
    shortCurrency?: boolean
    onPress?: () => void
}

const BalanceStatsCard = ({ mainBalance, leftDetail, rightDetail, shortCurrency = false, onPress }: BalanceStatsCardProps) => {
    const mode = useEnvironmentStore(selectMode);
    const router = useRouter();
    const segments = useSegments();
    const current = segments[segments.length - 1];

    const handleNavigateToBalance = () => {
        if (current !== 'balance' && mode === Mode.LIVE) {
            router.push('/balance');
        }
    }

    const handlePress = onPress ?? handleNavigateToBalance;

    return (
        <Pressable
            onPress={handlePress}
            className="px-4 pt-4 pb-9 bg-[#F1F6FF] rounded">
            {/* Main Balance */}
            <BalanceHeaderItem
                title={mainBalance.title}
                value={mainBalance.value}
                currency={mainBalance.currency}
                isVirtual={mainBalance.isVirtual}
                shortCurrency={shortCurrency}
                mainBalance
            />

            {/* Divider */}
            <View className="h-[1.5px] bg-[#F1F6FF] my-2 rounded" />

            {/* Balance details */}
            <View className="flex-row justify-between items-center">
                {/* Left Detail */}
                <BalanceHeaderItem
                    title={leftDetail.title}
                    value={leftDetail.value}
                    currency={leftDetail.currency}
                    shortCurrency={shortCurrency}
                />

                {/* Right Detail */}
                <BalanceHeaderItem
                    title={rightDetail.title}
                    value={rightDetail.value}
                    currency={rightDetail.currency}
                    shortCurrency={shortCurrency}
                />
            </View>
        </Pressable>
    )
}

export default BalanceStatsCard