import React from 'react'
import FontText from '../FontText'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { cn } from '@/src/core/utils/cn'

const ComingSoonBadge = ({ className }: { className?: string }) => {
    const { t } = useTranslation()
    return (
    <View className={cn("px-5 py-1.5 border border-[#FFD8C4] bg-[#FFF5F0]", className)}>
            <FontText weight="semi" className="text-[8px] text-[#FF9D6C] uppercase" type="body">
                {t('Coming Soon')}
            </FontText>
        </View>
    )
}

export default ComingSoonBadge