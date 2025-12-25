import React from 'react'
import FontText from '../FontText'
import { I18nManager, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { cn } from '@/src/core/utils/cn'

const isRTL = I18nManager.isRTL;
const ComingSoonBadge = ({ className }: { className?: string }) => {
    const { t } = useTranslation()
    return (
    <View className={cn("w-28 h-6 items-center justify-center border border-[#FFD8C4] bg-[#FFF5F0]", className)}>
            <FontText weight="semi" className={cn("text-[#FF9D6C] uppercase text-center flex-1", isRTL ? 'text-xs leading-5 w-full mt-0.5' : 'text-[7px]')} type="body">
                {t('Coming Soon')}
            </FontText>
        </View>
    )
}

export default ComingSoonBadge