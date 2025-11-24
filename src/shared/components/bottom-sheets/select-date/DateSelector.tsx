// components/date/DateSelector.tsx
import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/outline";

interface DateSelectorProps {
    label: string;
    date: Date | undefined;
    onPress: () => void;
    t: any;
    className?: string;
}

const DateSelector = memo(
    ({ label, date, onPress, t, className }: DateSelectorProps) => (
        <View className={className}>
            <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label)}>
                {label}
            </FontText>
            <Pressable
                onPress={onPress}
                className={cn("flex-row items-center w-full px-3 h-11 bg-white border border-stroke-input rounded")}
            >
                <CalendarDaysIcon size={18} color="#556767" />
                <FontText
                    type="body"
                    weight="regular"
                    className={cn(
                        "self-center ml-2",
                        date ? "text-content-primary text-sm" : "text-placeholder-color text-sm"
                    )}
                >
                    {date ? date.toLocaleDateString() : t("Select a date")}
                </FontText>
            </Pressable>
        </View>
    )
);

export default DateSelector;