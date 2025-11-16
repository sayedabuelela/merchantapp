import React, { ReactNode, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { KeyboardController } from 'react-native-keyboard-controller';
import { XMarkIcon } from 'react-native-heroicons/outline';
import FontText from '../FontText';
import GeneralModalHeader from '../GeneralModal/GeneralModalHeader';

interface ConfirmationModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

/**
 * Reusable bottom sheet modal for confirmations
 * Used for void, refund, and other confirmation dialogs
 */
const ConfirmationModal = ({ isVisible, onClose, title, children }: ConfirmationModalProps) => {
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        onClose();
        setIsAnimating(false);
    };

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <KeyboardAvoidingView behavior="padding" className="flex-1">
                <AnimatePresence onExitComplete={() => {
                    setShowModal(false);
                    setIsAnimating(false);
                }}>
                    {isAnimating && (
                        <View className="flex-1 justify-end">
                            {/* Backdrop */}
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'timing', duration: 300 }}
                                className="absolute inset-0 bg-content-secondary/30"
                            >
                                <Pressable style={{ flex: 1 }} onPress={handleClose} />
                            </MotiView>

                            {/* Modal Content */}
                            <TouchableWithoutFeedback onPress={() => KeyboardController?.dismiss()}>
                                <MotiView
                                    from={{ translateY: 550 }}
                                    animate={{ translateY: 0 }}
                                    exit={{ translateY: 550 }}
                                    transition={{ type: 'timing', duration: 500 }}
                                    className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md shadow-md shadow-black"
                                >
                                    {/* Drag Handle */}
                                    <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-6" />

                                    <View className="flex-row justify-between items-center mb-6">
                                        <FontText type="head" weight="bold" className="text-content-hint text-xl">
                                            {title}
                                        </FontText>
                                        <TouchableOpacity
                                            onPress={handleClose}
                                            className="items-center justify-center bg-[#F1F6FF] w-7 h-7 rounded-full"
                                        >
                                            <XMarkIcon size={18} color="#0F172A" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Modal Content */}
                                    {children}
                                </MotiView>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </AnimatePresence>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default ConfirmationModal;
