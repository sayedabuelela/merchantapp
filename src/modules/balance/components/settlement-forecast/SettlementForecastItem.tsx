import { currencyNumber } from '@/src/core/utils/number-fields'
import FontText from '@/src/shared/components/FontText'
import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { formatRelativeDate } from '@/src/core/utils/dateUtils'

const SettlementForecastItem = ({ amount, date }: { amount: number; date: string }) => {
    const { t } = useTranslation();
    return (
        <View className='border border-stroke-main p-4 rounded w-[200px] mr-3'>
            <FontText type="body" weight="bold" className="text-base text-content-primary">
                {currencyNumber(amount)} {t('EGP')}
            </FontText>
            <FontText type="body" weight="regular" className="text-xs text-content-secondary mt-1">
                {formatRelativeDate(date)}
            </FontText>
        </View>
    )
}

export default SettlementForecastItem