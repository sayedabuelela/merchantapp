// hooks/useDateSelect.ts
import { formatDateString } from "@/src/core/utils/dateUtils";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "./useDateRangePicker";
const MARKING_COLORS = {
    background: '#001F5F',
    text: '#FFFFFF',
} as const;

export const useDateSelect = () => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    const handleDayPress = useCallback((day: DateObject) => {
        setSelectedDate(new Date(day.dateString));
    }, []);

    const handleClear = useCallback(() => {
        setSelectedDate(undefined);
    }, []);

    const resetToSaved = useCallback((date?: Date) => {
        setSelectedDate(date);
    }, []);

    const displayText = selectedDate
        ? formatDateString(selectedDate)
        : t("Select a date");

    const markedDates = selectedDate
        ? {
            [selectedDate.toISOString().split("T")[0]]: {
                selected: true,
                selectedColor: MARKING_COLORS.background,
                textColor: MARKING_COLORS.text,
            },
        }
        : {};

    return {
        selectedDate,
        markedDates,
        displayText,
        handleDayPress,
        handleClear,
        resetToSaved,
    };
};
