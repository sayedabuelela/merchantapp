import {ARABIC_LOCALE, CALENDAR_THEME} from '@/src/core/constants/calendar';
import {cn} from "@/src/core/utils/cn";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef} from "react";
import {useTranslation} from "react-i18next";
import {I18nManager, Pressable, TouchableOpacity, View} from "react-native";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon} from "react-native-heroicons/outline";
import {useDateRangePicker} from '../../../hooks/useDateRangePicker';

export interface DateRangePickerRef {
    expand: () => void;
    close: () => void;
}

interface DateRangeData {
    from: Date | undefined;
    to: Date | undefined;
}

interface Props {
    title: string;
    type: 'creationDate' | 'dueDate' | 'valueDate' | 'entryDate' | 'paymentDate';
    onDateRangeSelected: (range: DateRangeData) => void;
    onClose?: () => void;
    savedRange?: DateRangeData;
}

const {isRTL} = I18nManager;

// Configure locale once
if (isRTL) {
    LocaleConfig.locales['ar'] = ARABIC_LOCALE;
    LocaleConfig.defaultLocale = 'ar';
}

const DateRangePickerBottomSheet = forwardRef<DateRangePickerRef, Props>(
    ({title, type, onDateRangeSelected, onClose, savedRange}, ref) => {
        const {t} = useTranslation();
        const snapPoints = useMemo(() => ['85%'], []);
        const bottomSheetRef = useRef<BottomSheet | null>(null);

        const {
            startDate,
            endDate,
            markedDates,
            displayText,
            handleDayPress,
            handleClear,
            resetToSaved,
            getDateRange,
        } = useDateRangePicker();

        useImperativeHandle(ref, () => ({
            expand: () => {
                bottomSheetRef.current?.expand();
                resetToSaved(savedRange);
            },
            close: () => {
                bottomSheetRef.current?.close();
            }
        }), [savedRange, resetToSaved]);

        const handleSave = useCallback(() => {
            const range = getDateRange();
            if (range) {
                onDateRangeSelected(range);
                bottomSheetRef.current?.close();
            }
        }, [getDateRange, onDateRangeSelected]);

        const handleClearRange = useCallback(() => {
            handleClear();
            onDateRangeSelected({from: undefined, to: undefined});
        }, [handleClear, onDateRangeSelected]);

        const handleCloseBottomSheet = useCallback(() => {
            bottomSheetRef.current?.close();
        }, []);

        const renderArrow = useCallback((direction: 'left' | 'right') => {
            const ArrowIcon = direction === 'left' ? ChevronLeftIcon : ChevronRightIcon;
            return (
                <View className="p-2">
                    <ArrowIcon
                        size={20}
                        color="#3B82F6"
                        style={isRTL ? {transform: [{scaleX: -1}]} : {}}
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
                            <XMarkIcon size={18} color="#EF4444"/>
                        </TouchableOpacity>
                    </View>

                    <View className="mb-4">
                        <FontText type="body" weight="semi" className="text-content-primary mb-2">
                            {t('Selected Range')}
                        </FontText>
                        <Pressable
                            onPress={handleClearRange}
                            className="flex-row items-center justify-between w-full px-3 py-3 bg-white border border-stroke-input rounded-lg"
                        >
                            <View className="flex-row items-center flex-1">
                                <CalendarDaysIcon size={18} color="#6B7280"/>
                                <FontText
                                    type="body"
                                    weight="regular"
                                    className={cn(
                                        'ml-3 flex-1',
                                        startDate && endDate ? 'text-content-primary' : 'text-placeholder-color'
                                    )}
                                >
                                    {displayText}
                                </FontText>
                            </View>
                            {(startDate || endDate) && (
                                <TouchableOpacity onPress={handleClearRange} className="p-1">
                                    <XMarkIcon size={16} color="#6B7280"/>
                                </TouchableOpacity>
                            )}
                        </Pressable>
                    </View>

                    <View className="flex-1">
                        <Calendar
                            onDayPress={handleDayPress}
                            markedDates={markedDates}
                            markingType="period"
                            enableSwipeMonths
                            renderArrow={renderArrow}
                            theme={CALENDAR_THEME}
                        />
                    </View>

                    <View className="pb-8 pt-4">
                        <Button
                            title={t('Save Range')}
                            onPress={handleSave}
                            disabled={!startDate || !endDate}
                            className={cn('mb-3', (!startDate || !endDate) && 'opacity-50')}
                        />
                        <Button
                            variant="outline"
                            title={t('Clear')}
                            onPress={handleClearRange}
                            className="border-0"
                            titleClasses="text-gray-500"
                        />
                    </View>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

DateRangePickerBottomSheet.displayName = 'DateRangePickerBottomSheet';

export default memo(DateRangePickerBottomSheet);