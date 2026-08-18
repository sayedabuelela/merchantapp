import { cn } from '@/src/core/utils/cn'
import React from 'react'
import { I18nManager, View } from 'react-native'
import FontText from '../FontText'

// React Native auto-flips flexDirection in RTL but never textAlign, so the
// end-alignment has to be resolved explicitly.
const END_ALIGN = { textAlign: I18nManager.isRTL ? 'left' : 'right' } as const;

interface Props {
    title: string;
    value?: string;
    /** Muted run appended inline after the value, e.g. a status code */
    valueSuffix?: string;
    /** Muted second line under the value, e.g. "≈ 4,950.00 EGP" */
    secondaryValue?: string;
    /** Summing row: hairline rule above it */
    total?: boolean;
    labelWeight?: 'regular' | 'semi' | 'bold';
    labelClassName?: string;
    valueClassName?: string;
    className?: string;
}


const SectionRowItem = ({
    title,
    value,
    valueSuffix,
    secondaryValue,
    total,
    labelWeight = 'regular',
    labelClassName,
    valueClassName,
    className,
}: Props) => {
    if (!value) return null;
    return (
        <View className={cn(
            'flex-row items-start justify-between gap-x-4',
            total && 'mt-1 pt-3 border-t border-tertiary',
            className,
        )}>
            <FontText type="body" weight={labelWeight}
                className={cn("text-content-secondary text-sm shrink", labelClassName)}>{title}</FontText>
            <View className="flex-1 items-end">
                <FontText type="body" weight="bold"
                    className={cn("text-content-primary text-sm", valueClassName)}
                    style={END_ALIGN}>
                    {value}
                    {!!valueSuffix && (
                        <FontText type="body" weight="regular" className="text-light-gray text-sm">
                            {` ${valueSuffix}`}
                        </FontText>
                    )}
                </FontText>
                {!!secondaryValue && (
                    <FontText type="body" weight="regular" className="text-light-gray text-xs">
                        {secondaryValue}
                    </FontText>
                )}
            </View>
        </View>
    )
}

export default SectionRowItem
