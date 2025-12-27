import { formatDateString } from "@/src/core/utils/dateUtils";
import DateRangePickerBottomSheet, { DateRangePickerRef } from "@/src/shared/components/bottom-sheets/date-range/DateRangePickerBottomSheet";
import { DateRangeSelector } from "@/src/shared/components/bottom-sheets/date-range/DateRangeSelector";
import Button from "@/src/shared/components/Buttons/Button";
import GeneralModalHeader from "@/src/shared/components/GeneralModal/GeneralModalHeader";
import { AnimatePresence, MotiView } from "moti";
import { memo, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import { ActivityType, FetchActivitiesParams } from "../balance.model";
import DropDownUI from "@/src/shared/components/dropdown/DropDownUI";
import { ArrowsUpDownIcon, CheckCircleIcon, CubeTransparentIcon } from "react-native-heroicons/outline";
import { BlurView } from "expo-blur";

interface FiltersModalProps {
    isVisible: boolean;
    onClose: () => void;
    filters: FetchActivitiesParams;
    setFilters: (filters: SetStateAction<FetchActivitiesParams>) => void;
    currentTab: ActivityType;
}

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

const ActivityFilterModal = ({ isVisible, onClose, filters, setFilters, currentTab }: FiltersModalProps) => {
    const { t } = useTranslation();

    // Only show activity type dropdown when "All Activities" tab is active
    const showActivityTypeDropdown = currentTab === 'all';

    const [showModal, setShowModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [valueDate, setValueDate] = useState<DateRange | undefined>(undefined);
    const [entryDate, setEntryDate] = useState<DateRange | undefined>(undefined);
    const [operation, setOperation] = useState<string | null | undefined>(null);
    const [isReflected, setIsReflected] = useState<boolean | null | undefined>(null);
    const [origin, setOrigin] = useState<string | null | undefined>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const valueDateRef = useRef<DateRangePickerRef>(null);
    const entryDateRef = useRef<DateRangePickerRef>(null);


    const activityTypesFilters = [
        { label: t('Payout'), value: 'Payout' },
        { label: t('Transfer'), value: 'transfer' },
        { label: t('Adjustment'), value: 'Adjustment' },
        { label: t('Opening balance'), value: 'Opening balance' },
        { label: t('Cancel transfer'), value: 'cancel transfer' },
        { label: t('Deduct'), value: 'deduct' },
        { label: t('Hold'), value: 'hold' },
        { label: t('Rate adjustment'), value: 'rate adjustment' },
        { label: t('Refund'), value: 'refund' },
        { label: t('Refund cancel'), value: 'refund cancel' },
        { label: t('Release'), value: 'release' },
        { label: t('Settlement'), value: 'settlement' },
        { label: t('Topup'), value: 'topup' },
        { label: t('All types'), value: null as string | null },
    ];

    const statusFilters = [
        { label: t('Reflected'), value: true },
        { label: t('Not Reflected'), value: false },
        { label: t('All status'), value: null as boolean | null },
    ];

    const originFilters = [
        { label: t('Settlement window'), value: 'Settlement window' },
        { label: t('Opening balance'), value: 'Opening balance' },
        { label: t('Operations team'), value: 'Operations team' },
        { label: t('Payments'), value: 'Payments' },
        { label: t('Transfers'), value: 'Transfers' },
        { label: t('All origins'), value: null as string | null },
    ];

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);
            setValueDate({
                from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
                to: filters.dateTo ? new Date(filters.dateTo) : undefined
            });
            setEntryDate({
                from: filters.creationDateFrom ? new Date(filters.creationDateFrom) : undefined,
                to: filters.creationDateTo ? new Date(filters.creationDateTo) : undefined
            });
            // If filter is undefined (not set), default to null (All selected)
            setOperation(filters.operation ?? null);
            setIsReflected(filters.isReflected ?? null);
            setOrigin(filters.origin ?? null);
        } else {
            setIsAnimating(false);
        }
    }, [isVisible, filters]);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        // Let the animation complete before calling onClose
        onClose();
        // setTimeout(() => {
        // }, 550);
    }, [onClose]);

    const handleSaveClick = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            creationDateFrom: entryDate?.from ? formatDateString(entryDate.from) : undefined,
            creationDateTo: entryDate?.to ? formatDateString(entryDate.to) : undefined,
            dateFrom: valueDate?.from ? formatDateString(valueDate.from) : undefined,
            dateTo: valueDate?.to ? formatDateString(valueDate.to) : undefined,
            // Only update operation if "All Activities" tab is active, otherwise keep tab-based operation
            operation: currentTab === 'all' ? (operation === null ? undefined : operation) : currentTab,
            isReflected: isReflected === null ? undefined : isReflected,
            origin: origin === null ? undefined : origin
        }));
        handleClose();
    }, [entryDate, valueDate, operation, isReflected, origin, currentTab, setFilters, handleClose]);

    const handleClearAll = useCallback(() => {
        setValueDate({ from: undefined, to: undefined });
        setEntryDate({ from: undefined, to: undefined });
        // Reset to null (All selected) instead of undefined
        setOperation(null);
        setIsReflected(null);
        setOrigin(null);
        setFilters(prev => ({
            ...prev,
            // Keep operation based on current tab when clearing
            operation: currentTab === 'all' ? undefined : currentTab,
            isReflected: undefined,
            origin: undefined,
            dateFrom: undefined,
            dateTo: undefined,
            creationDateFrom: undefined,
            creationDateTo: undefined,
        }));
    }, [currentTab, setFilters]);

    const handleOpenEntryDatePicker = useCallback(() => {
        setIsDatePickerOpen(true);
        entryDateRef.current?.expand();
    }, []);

    const handleOpenValueDatePicker = useCallback(() => {
        setIsDatePickerOpen(true);
        valueDateRef.current?.expand();
    }, []);

    const handleDatePickerClose = useCallback(() => {
        setIsDatePickerOpen(false);
    }, []);


    // Button is disabled if no actual filters are selected (null = "All" selected, not a real filter)
    // When activity type dropdown is hidden (payout/transfer tabs), ignore operation in validation
    const isDisabled = !entryDate?.from && !entryDate?.to &&
        !valueDate?.from && !valueDate?.to &&
        (showActivityTypeDropdown ? (operation === null || operation === undefined) : true) &&
        (isReflected === null || isReflected === undefined) &&
        (origin === null || origin === undefined);

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
                                   experimentalBlurMethod="dimezisBlurView"
                                style={{ flex: 1 }}
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
                                    // Add damping for smoother animation
                                    // damping: 20,
                                    // stiffness: 90
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
                                    title={t('Filters')}
                                    onClose={handleClose}
                                />

                                {/* Amount Range */}
                                <View className="mb-6">
                                    {/* <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label)}>
                                        {t('Amount')}
                                    </FontText> */}
                                    <View className="flex-row items-center justify-between">
                                    </View>
                                </View>

                                {/* Date Range Selectors */}
                                <DateRangeSelector
                                    label={t('Select entry date range')}
                                    from={entryDate?.from}
                                    to={entryDate?.to}
                                    onPress={handleOpenEntryDatePicker}
                                    t={t}
                                />

                                <DateRangeSelector
                                    label={t('Select value date range')}
                                    from={valueDate?.from}
                                    to={valueDate?.to}
                                    onPress={handleOpenValueDatePicker}
                                    t={t}
                                />

                                {/* Dropdowns - disabled when date picker is open (Android fix) */}
                                <View pointerEvents={isDatePickerOpen ? 'none' : 'auto'}>
                                    {/* Only show activity type dropdown for "All Activities" tab */}
                                    {showActivityTypeDropdown && (
                                        <DropDownUI
                                            options={activityTypesFilters}
                                            selected={operation}
                                            onChange={setOperation}
                                            label={t('Activity type')}
                                            icon={<ArrowsUpDownIcon size={24} color="#556767" />}
                                            placeholder={t('Activity type')}
                                            dropdownKey="activity"
                                            variant="filter"
                                        />
                                    )}

                                    <DropDownUI
                                        options={statusFilters}
                                        selected={isReflected}
                                        onChange={setIsReflected}
                                        label={t('Activity status')}
                                        icon={<CheckCircleIcon size={24} color="#556767" />}
                                        placeholder={t('Activity status')}
                                        dropdownKey="status"
                                        variant="filter"
                                    />

                                    <DropDownUI
                                        options={originFilters}
                                        selected={origin}
                                        onChange={setOrigin}
                                        label={t('All origins')}
                                        icon={<CubeTransparentIcon size={24} color="#556767" />}
                                        placeholder={t('All origins')}
                                        dropdownKey="origin"
                                        variant="filter"
                                    />
                                </View>

                                {/* Action Buttons */}
                                <View className="mt-8">
                                    <Button
                                        disabled={isDisabled}
                                        title={t('Apply Filters')}
                                        onPress={handleSaveClick}
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
                            ref={entryDateRef}
                            title={t('Entry Date')}
                            type="entryDate"
                            savedRange={entryDate}
                            onDateRangeSelected={(range) => setEntryDate(range)}
                            onClose={handleDatePickerClose}
                        />

                        <DateRangePickerBottomSheet
                            ref={valueDateRef}
                            title={t('Value Date')}
                            type="valueDate"
                            savedRange={valueDate}
                            onDateRangeSelected={(range) => setValueDate(range)}
                            onClose={handleDatePickerClose}
                        />
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default memo(ActivityFilterModal);