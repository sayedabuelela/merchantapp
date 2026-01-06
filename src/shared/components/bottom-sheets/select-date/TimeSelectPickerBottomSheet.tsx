import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, View } from "react-native";
import { ClockIcon, XMarkIcon } from "react-native-heroicons/outline";

export interface TimeSelectPickerRef {
    expand: () => void;
    close: () => void;
}

interface Props {
    title: string;
    onTimeSelected: (date: Date) => void;
    onClose?: () => void;
    savedDate?: Date;
}

const TimeSelectPickerBottomSheet = forwardRef<TimeSelectPickerRef, Props>(
    ({ title, onTimeSelected, onClose, savedDate }, ref) => {
        const { t } = useTranslation();
        const snapPoints = useMemo(() => ["45%"], []);
        const bottomSheetRef = useRef<BottomSheet | null>(null);
        const [tempDate, setTempDate] = useState<Date>(savedDate || new Date());
        const [showAndroidPicker, setShowAndroidPicker] = useState(false);

        useImperativeHandle(
            ref,
            () => ({
                expand: () => {
                    bottomSheetRef.current?.expand();
                    setTempDate(savedDate || new Date());
                },
                close: () => {
                    bottomSheetRef.current?.close();
                    setShowAndroidPicker(false);
                },
            }),
            [savedDate]
        );

        const handleChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
            // On Android, hide picker after selection or dismissal
            if (Platform.OS === 'android') {
                setShowAndroidPicker(false);
            }
            if (event.type === 'set' && selectedDate) {
                setTempDate(selectedDate);
            }
        }, []);

        const handleConfirm = useCallback(() => {
            onTimeSelected(tempDate);
            // bottomSheetRef.current?.close(); // Handled by parent or manually
        }, [onTimeSelected, tempDate]);

        const handleCloseBottomSheet = useCallback(() => {
            bottomSheetRef.current?.close();
            setShowAndroidPicker(false);
        }, []);

        const handleSheetChange = useCallback((index: number) => {
            if (index === -1) {
                setShowAndroidPicker(false);
            }
        }, []);

        const formatTime = (date: Date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                enablePanDownToClose
                onClose={onClose}
                onChange={handleSheetChange}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1}
                        appearsOnIndex={0}
                        pressBehavior="close"
                        opacity={0.5}
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

                    <View className="flex-1 justify-center items-center">
                        {Platform.OS === 'ios' ? (
                            // iOS: Show inline spinner picker
                            <RNDateTimePicker
                                value={tempDate}
                                mode="time"
                                display="spinner"
                                onChange={handleChange}
                                textColor="black"
                                style={{ width: '100%' }}
                            />
                        ) : (
                            // Android: Show a button to open native time picker
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowAndroidPicker(true)}
                                    className="flex-row items-center justify-center px-6 py-4 bg-gray-100 rounded-xl"
                                >
                                    <ClockIcon size={24} color="#556767" />
                                    <FontText type="head" weight="semi" className="text-content-primary text-2xl ml-3">
                                        {formatTime(tempDate)}
                                    </FontText>
                                </TouchableOpacity>
                                <FontText type="body" weight="regular" className="text-content-secondary text-sm mt-2">
                                    {t("Tap to change time")}
                                </FontText>
                                {showAndroidPicker && (
                                    <RNDateTimePicker
                                        value={tempDate}
                                        mode="time"
                                        display="default"
                                        onChange={handleChange}
                                    />
                                )}
                            </>
                        )}
                    </View>

                    <Button
                        title={t("Confirm")}
                        onPress={handleConfirm}
                        className="mt-4 mb-8"
                    />
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

TimeSelectPickerBottomSheet.displayName = 'TimeSelectPickerBottomSheet';

export default memo(TimeSelectPickerBottomSheet);
