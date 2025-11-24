import { cn } from "@/src/core/utils/cn";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

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

        useImperativeHandle(
            ref,
            () => ({
                expand: () => {
                    bottomSheetRef.current?.expand();
                    setTempDate(savedDate || new Date());
                },
                close: () => {
                    bottomSheetRef.current?.close();
                },
            }),
            [savedDate]
        );

        const handleChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }, []);

        const handleConfirm = useCallback(() => {
            onTimeSelected(tempDate);
            // bottomSheetRef.current?.close(); // Handled by parent or manually
        }, [onTimeSelected, tempDate]);

        const handleCloseBottomSheet = useCallback(() => {
            bottomSheetRef.current?.close();
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
                        <RNDateTimePicker
                            value={tempDate}
                            mode="time"
                            display="spinner"
                            onChange={handleChange}
                            textColor="black"
                            style={{ width: '100%' }}
                        />
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

export default memo(TimeSelectPickerBottomSheet);
