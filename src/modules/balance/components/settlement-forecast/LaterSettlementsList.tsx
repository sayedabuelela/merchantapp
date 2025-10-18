import React from 'react'
import { View } from 'react-native'
import { GroupedUpcomingDates } from '../../balance.model'
import FontText from '@/src/shared/components/FontText'
import { formatRelativeDate } from '@/src/core/utils/dateUtils'
import { currencyNumber } from '@/src/core/utils/number-fields'

const LaterSettlementsList = ({ laterSettlements, currency }: { laterSettlements: GroupedUpcomingDates, currency: string }) => {
    return (
        laterSettlements.later.map((item) => (
            <View className="flex flex-row items-center justify-between mb-1"
                key={item.date}
            >
                <FontText
                    type="body"
                    weight="bold"
                    className="text-base text-content-primary uppercase"
                >
                    {formatRelativeDate(item.date, false, true)}
                </FontText>
                <FontText
                    type="body"
                    weight="bold"
                    className="text-base text-content-primary uppercase"
                >
                    {currencyNumber(item.amount || 0) + " " + currency}
                </FontText>
            </View>
        ))
    )
}

export default LaterSettlementsList