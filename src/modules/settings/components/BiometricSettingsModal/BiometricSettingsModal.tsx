import BiometricIcons from '@/src/modules/auth/biometric/components/BiometricIcons';
import Button from '@/src/shared/components/Buttons/Button';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, View } from 'react-native';
import BiometricHeader from './BiometricHeader';
import { selectIsEnabled, useBiometricStore } from '@/src/modules/auth/biometric/biometric.store';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    handleEnableBiometric: () => void;
    isBiometricAvailable: boolean;
    handleDisableBiometric: () => void;
}



const BiometricSettingsModal = ({ isVisible, onClose, handleEnableBiometric, handleDisableBiometric }: Props) => {
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    const isBiometricEnabled = useBiometricStore(selectIsEnabled);
    // const router = useRouter();

    const { t } = useTranslation();
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
    const enableBiometric = () => {
        handleEnableBiometric();
        handleClose();
    }
    const disableBiometric = () => {
        handleDisableBiometric();
        handleClose();
    }
console.log('isBiometricEnabled : ', isBiometricEnabled);
    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            {/* <KeyboardAvoidingView behavior="padding" className="flex-1"> */}
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

                        <MotiView
                            from={{ translateY: 550 }}
                            animate={{ translateY: 0 }}
                            exit={{ translateY: 550 }}
                            transition={{
                                type: 'timing',
                                duration: 500,
                            }}
                            className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md shadow-md"
                        >
                            <View className="w-8 h-[3px] bg-content-disabled rounded-full self-center mb-6" />

                            <BiometricHeader isBiometricEnabled={isBiometricEnabled} />
                            {/* <TouchableOpacity
                                        onPress={handleClose}
                                        className="items-center justify-center bg-feedback-error-bg w-7 h-7 rounded-full"
                                    >
                                        <XMarkIcon size={18} color="#A50017" />
                                    </TouchableOpacity> */}
                            {!isBiometricEnabled && (
                                <View className="justify-center items-center mt-2">
                                    <BiometricIcons
                                        onPress={enableBiometric} />
                                </View>
                            )}
                            {/* Action Buttons */}
                            <View className="mt-6">
                                {isBiometricEnabled && (
                                    <Button
                                        title={t('Disable Fingerprint or Face ID')}
                                        onPress={disableBiometric}
                                    />
                                )}
                                <Button
                                    variant="outline"
                                    title={t('Cancel')}
                                    onPress={handleClose}
                                    className="border-0 mt-4"
                                    titleClasses="text-primary"
                                />
                            </View>
                        </MotiView>
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};
export default BiometricSettingsModal;
