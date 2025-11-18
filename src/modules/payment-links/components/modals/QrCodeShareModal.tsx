import { cn } from "@/src/core/utils/cn";
import { formatDateString } from "@/src/core/utils/dateUtils";
import { decimalNumber, formatInputCurrency } from "@/src/core/utils/number-fields";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import Input from "@/src/shared/components/inputs/Input";
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { AnimatePresence, MotiView } from "moti";
import { memo, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { KeyboardAvoidingView, KeyboardController } from "react-native-keyboard-controller";
import DateRangePickerBottomSheet, { DateRangePickerRef } from "../../../../../shared/components/bottom-sheets/date-range/DateRangePickerBottomSheet";
import GeneralModalHeader from "@/src/shared/components/GeneralModal/GeneralModalHeader";
import ShareQrCode from "../ShareQrCode";

interface QrCodeShareModalProps {
    qrCodeUrl: string;
    isVisible: boolean;
    onClose: () => void;
}

const QrCodeShareModal = ({ isVisible, onClose, qrCodeUrl }: QrCodeShareModalProps) => {
    const { t } = useTranslation();

    const [showModal, setShowModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
        }
    }, [isVisible]);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        // Let the animation complete before calling onClose
        onClose();
        // setTimeout(() => {
        // }, 550);
    }, [onClose]);


    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <View className="flex-1">
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
                                <Pressable style={{ flex: 1 }} onPress={handleClose} />
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
                                        title={t('Share with QR code')}
                                        onClose={onClose}
                                    />

                                    <ShareQrCode
                                        fromModal={true}
                                        qrValue={qrCodeUrl}
                                    />

                                </MotiView>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </AnimatePresence>
            </View>
        </Modal>
    );
};

export default QrCodeShareModal;