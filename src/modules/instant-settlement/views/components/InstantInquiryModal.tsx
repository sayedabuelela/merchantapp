import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import { BlurView } from 'expo-blur';
import ScaleFadeIn from '@/src/shared/components/wrappers/animated-wrappers/ScaleView';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { CheckIcon } from 'react-native-heroicons/outline';
import { useTranslation } from 'react-i18next';
import { InstantSettlementInquiryResponse } from '../../instant-settlement.model';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    inquiryData: InstantSettlementInquiryResponse | null;
    onRequestPayout: () => void;
    isRequesting: boolean;
}

const InstantInquiryModal = ({ isVisible, onClose, inquiryData, onRequestPayout, isRequesting }: Props) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
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
            statusBarTranslucent>

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
                                <BlurView
                                    intensity={15}
                                    tint="dark"
                                    style={{ flex: 1 }}
                                >
                                    <Pressable style={{ flex: 1 }} onPress={handleClose} />
                                </BlurView>
                            </MotiView>

                            <TouchableWithoutFeedback onPress={() => KeyboardController?.dismiss()}>
                                <MotiView
                                    from={{ translateY: 550 }}
                                    animate={{ translateY: 0 }}
                                    exit={{ translateY: 550 }}
                                    transition={{ type: 'timing', duration: 500 }}
                                    className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md shadow-md shadow-black"
                                >
                                    <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-8" />

                                    <View className='mb-4'>
                                        <FontText
                                            type="body"
                                            weight="regular"
                                            className='text-sm text-content-secondary'
                                        >
                                            {t('Please confirm the details below')}
                                        </FontText>
                                    </View>

                                    <View className="mb-4 justify-between border rounded border-stroke-main bg-surface-secondary p-4">
                                        <ScaleFadeIn delay={0} duration={400} >
                                            <View className="flex-row items-center justify-between border-b border-stroke-main pb-2 mb-2">
                                                <FontText
                                                    type="body"
                                                    weight="regular"
                                                    className='text-xs text-content-secondary'
                                                >
                                                    {t('Settlement amount')}
                                                </FontText>
                                                <FontText
                                                    type="body"
                                                    weight="semi"
                                                    className='text-sm text-content-primary uppercase'
                                                >
                                                    {currencyNumber(inquiryData?.totalAmount ?? 0)} {t('EGP')}
                                                </FontText>
                                            </View>
                                        </ScaleFadeIn>
                                        <ScaleFadeIn delay={0} duration={400} >
                                            <View className="flex-row items-center justify-between border-b border-stroke-main pb-2 mb-2">
                                                <FontText
                                                    type="body"
                                                    weight="regular"
                                                    className='text-xs text-content-secondary'
                                                >
                                                    {t('Instant sett. fees')}
                                                </FontText>
                                                <FontText
                                                    type="body"
                                                    weight="semi"
                                                    className='text-sm text-content-primary uppercase'
                                                >
                                                    {currencyNumber(inquiryData?.totalFees ?? 0)} {t('EGP')}
                                                </FontText>
                                            </View>
                                        </ScaleFadeIn>
                                        <ScaleFadeIn delay={0} duration={400} >
                                            <View className="flex-row items-center justify-between ">
                                                <FontText
                                                    type="body"
                                                    weight="regular"
                                                    className='text-xs text-content-secondary'
                                                >
                                                    {t('VAT')}
                                                </FontText>
                                                <FontText
                                                    type="body"
                                                    weight="semi"
                                                    className='text-sm text-content-primary uppercase'
                                                >
                                                    {currencyNumber(inquiryData?.vat ?? 0)} {t('EGP')}
                                                </FontText>
                                            </View>
                                        </ScaleFadeIn>
                                    </View>
                                    <ScaleFadeIn delay={0} duration={400} >
                                        <View className="items-center justify-center border rounded border-stroke-main bg-surface-secondary py-3">
                                            <FontText
                                                type="body"
                                                weight="regular"
                                                className='text-xs text-content-secondary mb-1 uppercase'
                                            >
                                                {t('Total Payout amount')}
                                            </FontText>
                                            <FontText
                                                type="body"
                                                weight="semi"
                                                className='text-sm text-content-primary uppercase'
                                            >
                                                {currencyNumber(inquiryData?.requestedAmount ?? 0)} {t('EGP')}
                                            </FontText>
                                        </View>
                                    </ScaleFadeIn>

                                    {/* Action Buttons */}
                                    <View className="mt-4">
                                        <Button
                                            title={t('Request payout')}
                                            onPress={onRequestPayout}
                                            className="mt-6 flex-row gap-x-2"
                                            disabled={isRequesting}
                                            isLoading={isRequesting}
                                            icon={<CheckIcon size={20} color={'#fff'} />}
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

export default InstantInquiryModal;
