import { formatDateString } from "@/src/core/utils/dateUtils";
import DateRangePickerBottomSheet, { DateRangePickerRef } from "@/src/shared/components/bottom-sheets/date-range/DateRangePickerBottomSheet";
import { DateRangeSelector } from "@/src/shared/components/bottom-sheets/date-range/DateRangeSelector";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import GeneralModalHeader from "@/src/shared/components/GeneralModal/GeneralModalHeader";
import { AnimatePresence, MotiView } from "moti";
import { memo, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { KeyboardController } from "react-native-keyboard-controller";
import { DateFilterType, HomeDateFilters } from "../home.model";
import { getDateRangeForFilter } from "../utils/dateFilterHelpers";
import { BlurView } from "expo-blur";

interface HomeDateFilterModalProps {
    isVisible: boolean;
    onClose: () => void;
    filters: HomeDateFilters;
    setFilters: (filters: SetStateAction<HomeDateFilters>) => void;
}

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

const HomeDateFilterModal = ({ isVisible, onClose, filters, setFilters }: HomeDateFilterModalProps) => {
    const { t } = useTranslation();

    const [showModal, setShowModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedType, setSelectedType] = useState<DateFilterType>('today');
    const [customDateRange, setCustomDateRange] = useState<DateRange>({ from: undefined, to: undefined });
    const dateRangeRef = useRef<DateRangePickerRef>(null);

    // Filter options with labels
    const filterOptions: { type: DateFilterType; label: string }[] = [
        { type: 'today', label: t('Today') },
        { type: 'yesterday', label: t('Yesterday') },
        { type: '7days', label: t('Last 7 Days') },
        { type: '30days', label: t('Last 30 Days') },
        { type: 'custom', label: t('Custom Range') },
    ];

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);
            // Sync with parent filters
            setSelectedType(filters.filterType);
            setCustomDateRange({
                from: filters.customFrom,
                to: filters.customTo
            });
        } else {
            setIsAnimating(false);
        }
    }, [isVisible, filters]);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        onClose();
    }, [onClose]);

    const handleApplyFilters = useCallback(() => {
        let dateFrom: string | undefined;
        let dateTo: string | undefined;

        if (selectedType === 'custom') {
            // Use custom date range
            dateFrom = customDateRange.from ? formatDateString(customDateRange.from) : undefined;
            dateTo = customDateRange.to ? formatDateString(customDateRange.to) : undefined;
        } else {
            // Calculate predefined range
            const range = getDateRangeForFilter(selectedType);
            dateFrom = range.dateFrom;
            dateTo = range.dateTo;
        }

        setFilters({
            dateFrom,
            dateTo,
            filterType: selectedType,
            customFrom: selectedType === 'custom' ? customDateRange.from : undefined,
            customTo: selectedType === 'custom' ? customDateRange.to : undefined,
        });

        handleClose();
    }, [selectedType, customDateRange, setFilters, handleClose]);

    const handleClearAll = useCallback(() => {
        // Reset to 'today' default
        setSelectedType('today');
        setCustomDateRange({ from: undefined, to: undefined });

        const todayRange = getDateRangeForFilter('today');
        setFilters({
            dateFrom: todayRange.dateFrom,
            dateTo: todayRange.dateTo,
            filterType: 'today',
            customFrom: undefined,
            customTo: undefined,
        });
    }, [setFilters]);

    const handleOptionPress = (type: DateFilterType) => {
        setSelectedType(type);
        // If switching away from custom, clear custom dates
        if (type !== 'custom') {
            setCustomDateRange({ from: undefined, to: undefined });
        }
    };

    // Disable apply button if custom is selected but dates are not set
    const isApplyDisabled = selectedType === 'custom' && (!customDateRange.from || !customDateRange.to);

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <AnimatePresence onExitComplete={() => {
                setShowModal(false);
            }}>
                {isAnimating && (
                    <View className="flex-1 justify-end">
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'timing', duration: 300 }}
                            className="absolute inset-0 bg-content-secondary/30"
                        >
                            <BlurView
                                intensity={15}
                                tint="dark"
                                style={{ flex: 1 }}
                                experimentalBlurMethod="dimezisBlurView"
                            >
                                <Pressable style={{ flex: 1 }} onPress={handleClose} />
                            </BlurView>
                        </MotiView>

                        <TouchableWithoutFeedback onPress={() => KeyboardController?.dismiss()}>
                            <MotiView
                                from={{ translateY: 550 }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: 550 }}
                                transition={{
                                    type: 'timing',
                                    duration: 500,
                                }}
                                className="bg-white w-full rounded-t-3xl pt-4 shadow-lg pb-12 px-6"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: -2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 5,
                                }}
                            >
                                <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-8" />
                                <GeneralModalHeader
                                    title={t('Date Filter')}
                                    onClose={handleClose}
                                />

                                {/* Filter Options */}
                                <View className="mb-6">
                                    {filterOptions.map((option) => (
                                        <View key={option.type} className="mb-3">
                                            <BouncyCheckbox
                                                size={20}
                                                fillColor="#001F5F"
                                                textComponent={
                                                    <FontText
                                                        type="body"
                                                        weight="regular"
                                                        className="text-content-primary text-base ml-2"
                                                    >
                                                        {option.label}
                                                    </FontText>
                                                }
                                                iconStyle={{
                                                    borderColor: "#001F5F",
                                                    borderRadius: 4,
                                                }}
                                                innerIconStyle={{
                                                    borderColor: "#D5D9D9",
                                                    borderRadius: 4,
                                                }}
                                                textStyle={{
                                                    textDecorationLine: "none",
                                                }}
                                                onPress={() => handleOptionPress(option.type)}
                                                isChecked={selectedType === option.type}
                                            />
                                        </View>
                                    ))}
                                </View>

                                {/* Custom Date Range Selectors - Show only when Custom is selected */}
                                {selectedType === 'custom' && (
                                    <View className="mb-6">
                                        <DateRangeSelector
                                            label={t('Select date range')}
                                            from={customDateRange.from}
                                            to={customDateRange.to}
                                            onPress={() => dateRangeRef.current?.expand()}
                                            t={t}
                                        />
                                    </View>
                                )}

                                {/* Action Buttons */}
                                <View className="mt-8">
                                    <Button
                                        disabled={isApplyDisabled}
                                        title={t('Apply Filters')}
                                        onPress={handleApplyFilters}
                                    />
                                    <Button
                                        variant="outline"
                                        title={t('Clear All')}
                                        onPress={handleClearAll}
                                        className="border-0 mt-4"
                                        titleClasses="text-placeholder-color"
                                    />
                                </View>
                            </MotiView>
                        </TouchableWithoutFeedback>

                        <DateRangePickerBottomSheet
                            ref={dateRangeRef}
                            title={t('Select Date Range')}
                            type="creationDate"
                            savedRange={customDateRange}
                            onDateRangeSelected={(range) => setCustomDateRange(range)}
                        />
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default memo(HomeDateFilterModal);
