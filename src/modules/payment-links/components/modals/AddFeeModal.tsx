// AddFeeModal.tsx
import { cn } from '@/src/core/utils/cn';
import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from '@/src/shared/styles/main';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { KeyboardController } from 'react-native-keyboard-controller';
import { FeeType, feeSchema } from '../../payment-links.scheme';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onAddFee: (fee: FeeType) => void;
    editingFee?: FeeType & { index?: number };
}

const AddFeeModal = ({ isVisible, onClose, onAddFee, editingFee }: Props) => {
    const {t} = useTranslation();
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);

    const { control, handleSubmit, reset, formState: { errors , isValid } } = useForm<FeeType>({
        resolver: zodResolver(feeSchema),
        defaultValues: {
            name: '',
            flatFee: undefined,
            rate: undefined,
        },
    });

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);

            if (editingFee) {
                reset(editingFee);
            } else {
                reset({ name: '', flatFee: undefined, rate: undefined });
            }
        }
    }, [isVisible, editingFee, reset]);

    const handleClose = () => {
        reset({ name: '', flatFee: undefined, rate: undefined });
        onClose();
        setIsAnimating(false);
    };

    const onSubmit = (fee: FeeType) => {
        onAddFee(fee);
        handleClose();
    };

    return (
        <Modal transparent visible={showModal} animationType="none" onRequestClose={handleClose} statusBarTranslucent>
            <KeyboardAvoidingView behavior="padding" className="flex-1">
                <AnimatePresence onExitComplete={() => { setShowModal(false); setIsAnimating(false); }}>
                    {isAnimating && (
                        <View className="flex-1 justify-end">
                            {/* Overlay */}
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
                                    transition={{ type: 'timing', duration: 500 }}
                                    className="bg-white w-full rounded-t-3xl pt-4 shadow-lg pb-12 px-6"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: -2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 5,
                                    }}
                                >
                                    <View className="w-8 h-[3px] bg-content-disabled rounded-full self-center mb-8" />

                                    {/* Header */}
                                    <View className="flex-row justify-between items-center mb-6">
                                        <FontText type="head" weight="bold" className="text-content-primary text-xl">
                                            {editingFee ? t('Edit fee') : t('Add a fee')}
                                        </FontText>
                                        <TouchableOpacity
                                            onPress={handleClose}
                                            className="items-center justify-center bg-feedback-error-bg w-7 h-7 rounded-full"
                                        >
                                            <XMarkIcon size={18} color="#A50017" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Name */}
                                    <View className="mb-4">
                                        <Controller
                                            control={control}
                                            name="name"
                                            render={({ field: { onChange, value } }) => (
                                                <Input
                                                    label={t('Fee Name')}
                                                    placeholder={t('e.g., Delivery, Processing')}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    error={!!errors.name}
                                                />
                                            )}
                                        />
                                        {errors.name && (
                                            <FontText type="body" className="text-feedback-error mt-1">
                                                {t(errors.name.message as string)}
                                            </FontText>
                                        )}
                                    </View>

                                    {/* Flat Fee + Rate */}
                                    <View>
                                        <View className="flex-row items-center justify-between">
                                            {/* Flat Fee */}
                                            <View className="w-[47%]">
                                                <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label, 'mb-2')}>
                                                    {t('Fee Amount')}
                                                </FontText>
                                                <Controller
                                                    control={control}
                                                    name="flatFee"
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input
                                                            placeholder={t('Flat fee')}
                                                            value={value?.toString() ?? ''}
                                                            onChangeText={(text) => onChange(text ? parseFloat(text.replace(/[^0-9.]/g, '')) : undefined)}
                                                            keyboardType="decimal-pad"
                                                            isHasCurrency
                                                            error={!!errors.flatFee}
                                                        />
                                                    )}
                                                />
                                            </View>

                                            {/* Rate */}
                                            <View className="w-[47%]">
                                                <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label, 'mb-2')}>
                                                    {t('Rate')}
                                                </FontText>
                                                <Controller
                                                    control={control}
                                                    name="rate"
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input
                                                            placeholder={t('Rate %')}
                                                            value={value?.toString() ?? ''}
                                                            onChangeText={(text) => onChange(text ? parseFloat(text.replace(/[^0-9.]/g, '')) : undefined)}
                                                            keyboardType="decimal-pad"
                                                            error={!!errors.rate}
                                                        />
                                                    )}
                                                />
                                            </View>
                                        </View>
                                        {errors.flatFee && (
                                            <FontText type="body" className="text-feedback-error mt-1">
                                                {errors.flatFee.message}
                                            </FontText>
                                        )}
                                    </View>

                                    {/* Submit */}
                                    <View className="mt-8">
                                        <Button
                                            // disabled={!isValid}
                                            title={editingFee ? t('Update fee') : t('Add new fee')}
                                            onPress={handleSubmit(onSubmit)}
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

export default AddFeeModal;
