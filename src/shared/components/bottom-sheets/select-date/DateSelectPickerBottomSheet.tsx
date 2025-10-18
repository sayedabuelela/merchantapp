// components/date/DateSelectPickerBottomSheet.tsx
import { ARABIC_LOCALE, CALENDAR_THEME } from "@/src/core/constants/calendar";
import { cn } from "@/src/core/utils/cn";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { useDateSelect } from "@/src/shared/hooks/useDateSelect";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import {
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
    CalendarDaysIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from "react-native-heroicons/outline";

export interface DateSelectPickerRef {
    expand: () => void;
    close: () => void;
}

interface Props {
    title: string;
    onDateSelected: (date?: Date) => void;
    onClose?: () => void;
    savedDate?: Date;
}

const { isRTL } = I18nManager;

if (isRTL) {
    LocaleConfig.locales["ar"] = ARABIC_LOCALE;
    LocaleConfig.defaultLocale = "ar";
}

const DateSelectPickerBottomSheet = forwardRef<DateSelectPickerRef, Props>(
    ({ title, onDateSelected, onClose, savedDate }, ref) => {
        const { t } = useTranslation();
        const snapPoints = useMemo(() => ["85%"], []);
        const bottomSheetRef = useRef<BottomSheet | null>(null);

        const {
            selectedDate,
            markedDates,
            displayText,
            handleDayPress,
            handleClear,
            resetToSaved,
        } = useDateSelect();

        useImperativeHandle(
            ref,
            () => ({
                expand: () => {
                    bottomSheetRef.current?.expand();
                    resetToSaved(savedDate);
                },
                close: () => {
                    bottomSheetRef.current?.close();
                },
            }),
            [savedDate, resetToSaved]
        );

        const handleSave = useCallback(() => {
            onDateSelected(selectedDate);
            bottomSheetRef.current?.close();
        }, [selectedDate, onDateSelected]);

        const handleClearDate = useCallback(() => {
            handleClear();
            onDateSelected(undefined);
        }, [handleClear, onDateSelected]);

        const handleCloseBottomSheet = useCallback(() => {
            bottomSheetRef.current?.close();
        }, []);

        const renderArrow = useCallback((direction: "left" | "right") => {
            const ArrowIcon =
                direction === "left" ? ChevronLeftIcon : ChevronRightIcon;
            return (
                <View className="p-2">
                    <ArrowIcon
                        size={20}
                        color="#3B82F6"
                        style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
                    />
                </View>
            );
        }, []);

        return (
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                enablePanDownToClose
                onClose={onClose}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1} // hide when closed
                        appearsOnIndex={0}     // show when open
                        pressBehavior="close"  // tap backdrop to close
                        opacity={0.5} // default 0.5
                        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    />
                )}
            >
                <BottomSheetView className="flex-1 px-6 pt-2">

                    <View className="flex-row justify-between items-center mb-6">
                        <FontText type="head" weight="bold" className="text-content-primary text-xl">
                            {title}
                        </FontText>
                        <TouchableOpacity
                            onPress={handleCloseBottomSheet}
                            className="w-8 h-8 bg-red-50 rounded-full items-center justify-center"
                        >
                            <XMarkIcon size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    <View className="mb-4">
                        <FontText type="body" weight="semi" className="text-content-primary mb-2">
                            {t("Selected Date")}
                        </FontText>
                        <Pressable
                            onPress={handleClearDate}
                            className="flex-row items-center justify-between w-full px-3 py-3 bg-white border border-stroke-input rounded-lg"
                        >
                            <View className="flex-row items-center flex-1">
                                <CalendarDaysIcon size={18} color="#6B7280" />
                                <FontText
                                    type="body"
                                    weight="regular"
                                    className={cn(
                                        "ml-3 flex-1",
                                        selectedDate ? "text-content-primary" : "text-placeholder-color"
                                    )}
                                >
                                    {displayText}
                                </FontText>
                            </View>
                            {selectedDate && (
                                <TouchableOpacity onPress={handleClearDate} className="p-1">
                                    <XMarkIcon size={16} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        </Pressable>
                    </View>

                    <View className="flex-1">
                        <Calendar
                            onDayPress={handleDayPress}
                            markedDates={markedDates}
                            enableSwipeMonths
                            renderArrow={renderArrow}
                            theme={CALENDAR_THEME}
                        />
                    </View>

                    <View className=" pt-4">
                        <Button
                            title={t("Save Date")}
                            onPress={handleSave}
                            disabled={!selectedDate}
                            className={cn("mb-3", !selectedDate && "opacity-50")}
                        />
                        <Button
                            variant="outline"
                            title={t("Clear")}
                            onPress={handleClearDate}
                            className="border-0"
                            titleClasses="text-gray-500"
                        />
                    </View>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

export default memo(DateSelectPickerBottomSheet);
