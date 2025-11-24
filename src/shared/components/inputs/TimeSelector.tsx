import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { COMMON_STYLES } from "@/src/shared/styles/main";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { memo, useCallback, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { ClockIcon } from "react-native-heroicons/outline";

interface TimeSelectorProps {
    label: string;
    date: Date | undefined;
    onPress: () => void;
    t: any;
    className?: string;
}

const TimeSelector = memo(
    ({ label, date, onPress, t, className }: TimeSelectorProps) => {
        return (
            <View className={className}>
                <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label)}>
                    {label}
                </FontText>
                <Pressable
                    onPress={onPress}
                    className={cn("flex-row items-center w-full px-3 h-11 bg-white border border-stroke-input rounded")}
                >
                    <ClockIcon size={18} color="#556767" />
                    <FontText
                        type="body"
                        weight="regular"
                        className={cn(
                            "self-center ml-2",
                            date ? "text-content-primary text-sm" : "text-placeholder-color text-sm"
                        )}
                    >
                        {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t("Select time")}
                    </FontText>
                </Pressable>
            </View>
        );
    }
);

export default TimeSelector;
