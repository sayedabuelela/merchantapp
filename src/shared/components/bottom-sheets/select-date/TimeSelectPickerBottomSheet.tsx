import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Platform, Pressable, TouchableOpacity, View } from "react-native";
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
        const [visible, setVisible] = useState(false);
        const [tempDate, setTempDate] = useState<Date>(savedDate || new Date());
        const [showAndroidPicker, setShowAndroidPicker] = useState(false);

        useImperativeHandle(
            ref,
            () => ({
                expand: () => {
                    setTempDate(savedDate || new Date());
                    setVisible(true);
                },
                close: () => {
                    setVisible(false);
                    setShowAndroidPicker(false);
                },
            }),
            [savedDate]
        );

        const handleChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
            if (Platform.OS === 'android') {
                setShowAndroidPicker(false);
            }
            if (event.type === 'set' && selectedDate) {
                setTempDate(selectedDate);
            }
        }, []);

        const handleConfirm = useCallback(() => {
            onTimeSelected(tempDate);
        }, [onTimeSelected, tempDate]);

        const handleClose = useCallback(() => {
            setVisible(false);
            setShowAndroidPicker(false);
            onClose?.();
        }, [onClose]);

        const formatTime = (date: Date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={handleClose}
            >
                <Pressable
                    className="flex-1 bg-black/40 justify-end"
                    onPress={handleClose}
                >
                    <Pressable
                        className="bg-white rounded-t-3xl"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="px-6 pt-4 pb-8">
                            <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

                            <View className="flex-row justify-between items-center mb-6">
                                <FontText type="head" weight="bold" className="text-content-primary text-xl">
                                    {title}
                                </FontText>
                                <TouchableOpacity
                                    onPress={handleClose}
                                    className="w-8 h-8 bg-red-50 rounded-full items-center justify-center"
                                >
                                    <XMarkIcon size={18} color="#EF4444" />
                                </TouchableOpacity>
                            </View>

                            <View className="justify-center items-center py-4">
                                {Platform.OS === 'ios' ? (
                                    <RNDateTimePicker
                                        value={tempDate}
                                        mode="time"
                                        display="spinner"
                                        onChange={handleChange}
                                        textColor="black"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
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
                                className="mt-4"
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        );
    }
);

TimeSelectPickerBottomSheet.displayName = 'TimeSelectPickerBottomSheet';

export default memo(TimeSelectPickerBottomSheet);
