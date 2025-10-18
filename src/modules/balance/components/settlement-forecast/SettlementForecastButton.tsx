import { cn } from '@/src/core/utils/cn'
import { formatRelativeDate } from '@/src/core/utils/dateUtils'
import FontText from '@/src/shared/components/FontText'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const SettlementForecastButton = ({ date, isActive, onPress, t }: { date: string, isActive: boolean, onPress: () => void, t: any }) => {
    return (
        <TouchableOpacity
            className={cn(
                "py-1 px-2 rounded border",
                isActive ? "bg-primary border-primary" : "border-[#F1F6FF] bg-[#F1F6FF]"
            )}
            onPress={onPress}
        >
            <FontText
                type="body"
                weight="regular"
                className={cn("text-sm", isActive ? "text-white" : "text-primary")}
            >
                {date === "later" ? t("Later this month") : formatRelativeDate(date, false, true)}
            </FontText>
        </TouchableOpacity>
    )
}

export default SettlementForecastButton