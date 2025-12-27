import GeneralModalHeader from "@/src/shared/components/GeneralModal/GeneralModalHeader";
import { BlurView } from "expo-blur";
import { AnimatePresence, MotiView } from "moti";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
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