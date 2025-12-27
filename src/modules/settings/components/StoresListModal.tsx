import Button from '@/src/shared/components/Buttons/Button';
import GeneralModalHeader from '@/src/shared/components/GeneralModal/GeneralModalHeader';
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BelongsTo } from '../../auth/auth.model';
import { useAuthStore } from '../../auth/auth.store';
import StoresList from './StoresList';
import { Modal, ScrollView, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { Pressable } from 'react-native';
import { BlurView } from 'expo-blur';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    stores: BelongsTo[];
    onSelectStore: (merchantId: string) => void;
}

export interface StoresListModalRef {
    open: () => void;
    close: () => void;
}

const StoresListModal = forwardRef<StoresListModalRef, Props>(
    ({ isVisible, onClose, stores, onSelectStore }, ref) => {
        const { t } = useTranslation();
        const currentMerchantId = useAuthStore((state) => state.user?.merchantId);
        const [activeStore, setActiveStore] = useState<string | undefined>(currentMerchantId);
        const [showModal, setShowModal] = useState(isVisible);
        const [isAnimating, setIsAnimating] = useState(false);

        React.useEffect(() => {
            if (isVisible) {
                setShowModal(true);
                setIsAnimating(true);
            }
        }, [isVisible]);

        useImperativeHandle(ref, () => ({
            open: () => {
                setShowModal(true);
                setIsAnimating(true);
            },
            close: () => {
                setIsAnimating(false);
            }
        }), []);

        const handleClose = useCallback(() => {
            setIsAnimating(false);
            setActiveStore(currentMerchantId);
        }, [currentMerchantId]);

        const handleSelect = useCallback(() => {
            onSelectStore(activeStore!);
            handleClose();
        }, [activeStore, onSelectStore, handleClose]);

        return (
            <Modal
                transparent
                visible={showModal}
                animationType="none"
                onRequestClose={onClose}
                statusBarTranslucent
            >
                <AnimatePresence onExitComplete={() => {
                    setShowModal(false);
                    setIsAnimating(false);
                    onClose();
                }}>
                    {isAnimating && (
                        <View className="flex-1 justify-end">
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'timing', duration: 300 }}
                                className="absolute inset-0"
                            >
                                <BlurView
                                    intensity={15}
                                    tint="dark"
                                    className='flex-1'
                                    experimentalBlurMethod="dimezisBlurView"
                                >
                                    <Pressable style={{ flex: 1 }} onPress={handleClose} />
                                </BlurView>
                            </MotiView>

                            <MotiView
                                from={{ translateY: 400 }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: 400 }}
                                transition={{
                                    type: 'timing',
                                    duration: 300,
                                }}
                                className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 h-[60%]"
                            >
                                <GeneralModalHeader
                                    title={t('Select store')}
                                    onClose={handleClose}
                                />
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    className="flex-1"
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                >
                                    <StoresList
                                        stores={stores}
                                        activeStore={activeStore}
                                        setActiveStore={setActiveStore}
                                    />
                                </ScrollView>
                                <Button
                                    title={t('Select')}
                                    onPress={handleSelect}
                                    className="mt-6"
                                    disabled={activeStore === currentMerchantId}
                                />
                            </MotiView>
                        </View>
                    )}
                </AnimatePresence>
            </Modal>
        );
    }
);

StoresListModal.displayName = 'StoresListModal';
export default StoresListModal;
