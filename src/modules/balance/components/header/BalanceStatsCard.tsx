import React from 'react'
import { View } from 'react-native'
import BalanceHeaderItem from './BalanceHeaderItem'

interface BalanceStatsCardProps {
    mainBalance: {
        title: string
        value: number | string
        currency: string
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
}

const BalanceStatsCard = ({ mainBalance, leftDetail, rightDetail }: BalanceStatsCardProps) => {
    return (
        <View className="px-6 pt-6 pb-9 bg-[#F1F6FF] rounded">
            {/* Main Balance */}
            <BalanceHeaderItem
                title={mainBalance.title}
                value={mainBalance.value}
                currency={mainBalance.currency}
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
                />

                {/* Right Detail */}
                <BalanceHeaderItem
                    title={rightDetail.title}
                    value={rightDetail.value}
                    currency={rightDetail.currency}
                />
            </View>
        </View>
    )
}

export default BalanceStatsCard