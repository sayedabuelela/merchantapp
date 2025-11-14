import { cn } from '@/src/core/utils/cn'
import React from 'react'
import { View } from 'react-native'
import FontText from '../FontText'

interface Props {
    title: string;
    value: string;
    labelClassName?: string;
    valueClassName?: string;
    className?: string;
}


const SectionRowItem = ({ title, value, labelClassName, valueClassName, className }: Props) => {
    if (!value) return null;
    return (
        <View className={cn('flex-row items-center justify-between', className)}>
            <FontText type="body" weight="regular"
                className={cn("text-content-secondary text-sm mb-1 self-start", labelClassName)}>{title}</FontText>
            <FontText type="body" weight="semi"
                className={cn("text-content-primary text-sm self-start", valueClassName)}>{value}</FontText>
        </View>
    )
}

export default SectionRowItem