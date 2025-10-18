import { cn } from '@/src/core/utils/cn';
import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from '@/src/shared/styles/main';
import { t } from 'i18next';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { KeyboardController } from 'react-native-keyboard-controller';

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

const GeneralModal = ({ isVisible, onClose }: Props) => {
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
                                    }}
                                    className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md shadow-md shadow-black"
                                >
                                    <View className="w-8 h-[3px] bg-content-disabled rounded-full self-center mb-8" />

                                    <View className="flex-row justify-between items-center mb-6">
                                        <FontText type="head" weight="bold" className="text-content-primary text-xl">
                                            {t('Filters')}
                                        </FontText>
                                        <TouchableOpacity
                                            onPress={handleClose}
                                            className="items-center justify-center bg-feedback-error-bg w-7 h-7 rounded-full"
                                        >
                                            <XMarkIcon size={18} color="#A50017" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Amount Range */}
                                    <View className="mb-6">
                                        <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label)}>
                                            {t('Amount')}
                                        </FontText>
                                        <View className="flex-row items-center justify-between">
                                            <Input
                                                className="w-[47%]"
                                                placeholder={t('From')}
                                                onChangeText={() => { }}
                                                value={''}
                                                keyboardType="number-pad"
                                            />
                                            <Input
                                                className="w-[47%]"
                                                placeholder={t('To')}
                                                onChangeText={() => { }}
                                                value={''}
                                                keyboardType="number-pad"
                                            />
                                        </View>
                                    </View>


                                    {/* Action Buttons */}
                                    <View className="mt-8">
                                        <Button
                                            // disabled={isDisabled}
                                            title={t('Apply')}
                                        // onPress={handleSaveClick}
                                        />
                                    </View>
                                </MotiView>
                            </TouchableWithoutFeedback>

                        </View>
                    )}
                </AnimatePresence>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default GeneralModal;
