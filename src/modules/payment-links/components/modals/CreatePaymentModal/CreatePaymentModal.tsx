import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import { Link } from 'expo-router';
import { t } from 'i18next';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import PaymentLinkOptionItem from './PaymentLinkOptionItem';
interface CreatePaymentModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const CreatePaymentModal = ({ isVisible, onClose }: CreatePaymentModalProps) => {
    const [showModal, setShowModal] = useState(isVisible);
    const [selectedOption, setSelectedOption] = useState<'simple' | 'professional' | ''>('');

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        onClose();
        setSelectedOption('');
    };

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
        >
            <AnimatePresence
                onExitComplete={() => setShowModal(false)}
            >
                {isVisible && (
                    <View className="flex-1 justify-end ">
                        {/* 🔹 Background overlay */}
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 300 }}
                            className="absolute inset-0 bg-content-secondary/30"
                        >
                            <Pressable style={{ flex: 1 }} onPress={handleClose} />
                        </MotiView>

                        <MotiView
                            from={{ translateY: 300 }}
                            animate={{ translateY: 0 }}
                            exit={{ translateY: 300 }}
                            transition={{ type: 'timing', duration: 400 }}
                            className={`bg-white w-full rounded-t-3xl pt-4 shadow-lg pb-12 px-6 `}
                        >
                            <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-8" />
                            <View className="flex-row justify-between items-center mb-4">
                                <FontText
                                    type="head"
                                    weight="bold"
                                    className="text-content-primary text-xl self-start"
                                >
                                    {t('New payment link')}
                                </FontText>
                                <TouchableOpacity onPress={handleClose} className="self-end items-center justify-center bg-feedback-error-bg
                                w-7 h-7 rounded-full
                                ">
                                    <XMarkIcon size={18} color="#A50017" />
                                </TouchableOpacity>
                            </View>
                            <View className='gap-2'>
                                <PaymentLinkOptionItem
                                    title={t('Fixed Amount')}
                                    description={t('Set payment amount for user')}
                                    isActive={selectedOption === 'simple'}
                                    onSelect={() => setSelectedOption('simple')}
                                />
                                <PaymentLinkOptionItem
                                    title={t('Itemized')}
                                    description={t('Add items to your payment link')}
                                    isActive={selectedOption === 'professional'}
                                    onSelect={() => setSelectedOption('professional')}
                                />
                            </View>
                            <Link
                                href={{
                                    pathname: "/payment-links/create-step1",
                                    params: { paymentType: selectedOption },
                                }}
                                asChild disabled={selectedOption === ''}>
                                <Button title={t('New payment link')} disabled={selectedOption === ''} onPress={handleClose} className="mt-8" />
                            </Link>
                        </MotiView>
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default CreatePaymentModal;