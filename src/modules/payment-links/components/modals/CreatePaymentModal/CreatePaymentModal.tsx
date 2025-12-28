import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import { Link } from 'expo-router';
import { t } from 'i18next';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import PaymentLinkOptionItem from './PaymentLinkOptionItem';
import GeneralModalHeader from '@/src/shared/components/GeneralModal/GeneralModalHeader';
import { BlurView } from 'expo-blur';
interface CreatePaymentModalProps {
    isVisible: boolean;
    onClose: () => void;
    qrCode?: boolean;
}

const CreatePaymentModal = ({ isVisible, onClose, qrCode }: CreatePaymentModalProps) => {
    const [showModal, setShowModal] = useState(isVisible);
    const [selectedOption, setSelectedOption] = useState<'simple' | 'professional' | ''>('simple');

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
                            <BlurView
                                intensity={15}
                                tint="dark"
                                style={{ flex: 1 }}
                            >
                                <Pressable style={{ flex: 1 }} onPress={handleClose} />
                            </BlurView>
                        </MotiView>

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
                                title={t('New payment link')}
                                onClose={handleClose}
                            />
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
                                    params: { paymentType: selectedOption, qrCode: qrCode ? 'true' : 'false' },
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