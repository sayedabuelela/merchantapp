import React from 'react'
import { View } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import { formatDateByLocale } from '@/src/core/utils/dateUtils'
import { getGreeting } from '@/src/modules/balance/balance.utils'

const GreetingUser = ({ userName }: { userName: string }) => {
    return (
        <View>
            <FontText type="head" weight="regular" className="text-xl text-content-primary">
                {getGreeting()},
            </FontText>
            <FontText type="head" weight="bold" className="text-2xl text-content-primary capitalize">
                {userName}!
            </FontText>
            <FontText type="body" weight="regular" className="text-xs text-content-secondary mt-0.5 self-start">
                {formatDateByLocale(new Date())}
            </FontText>
        </View>
    )
}

export default GreetingUser