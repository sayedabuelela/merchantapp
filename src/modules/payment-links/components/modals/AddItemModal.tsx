// AddItemModal.tsx
import { cn } from '@/src/core/utils/cn';
import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from '@/src/shared/styles/main';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { MinusIcon, PlusIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { KeyboardController } from 'react-native-keyboard-controller';
import { itemSchema, ItemType } from '../../payment-links.scheme';

// Only validate user-entered fields in the modal (exclude subTotal)
const addItemSchema = itemSchema.omit({ subTotal: true });
// Narrowed form type for the modal
type AddItemForm = Omit<ItemType, 'subTotal'>;

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onAddItem: (item: ItemType) => void;
    editingItem?: ItemType & { index?: number };
}

const AddItemModal = ({ isVisible, onClose, onAddItem, editingItem }: Props) => {
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<AddItemForm>({
        resolver: zodResolver(addItemSchema),
        defaultValues: {
            description: '',
            unitPrice: 0,
            quantity: 1,
        },
        mode: 'onChange',
    });

    const quantity = watch('quantity');

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);

            if (editingItem) {
                // Reset only with fields relevant to the modal schema
                reset({
                    description: editingItem.description,
                    unitPrice: editingItem.unitPrice,
                    quantity: editingItem.quantity,
                });
            } else {
                reset({ description: '', unitPrice: 0, quantity: 1 });
            }
        }
    }, [isVisible, editingItem, reset]);

    const handleClose = () => {
        reset({ description: '', unitPrice: 0, quantity: 1 });
        onClose();
        setIsAnimating(false);
    };

    const onSubmit = (item: AddItemForm) => {
        // Compute subTotal at the source (unitPrice * quantity)
        const enriched: ItemType = {
            ...item,
            subTotal: Number(item.unitPrice) * Number(item.quantity),
        };
        onAddItem(enriched);
        handleClose();
    };

    const incrementQuantity = () => setValue('quantity', quantity + 1, { shouldValidate: true });
    const decrementQuantity = () => {
        if (quantity > 1) setValue('quantity', quantity - 1, { shouldValidate: true });
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
                                            {editingItem ? t('Edit item') : t('Add an item')}
                                        </FontText>
                                        <TouchableOpacity
                                            onPress={handleClose}
                                            className="items-center justify-center bg-feedback-error-bg w-7 h-7 rounded-full"
                                        >
                                            <XMarkIcon size={18} color="#A50017" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Item Name */}
                                    <View className="mb-4">
                                        <Controller
                                            control={control}
                                            name="description"
                                            render={({ field: { onChange, value } }) => (
                                                <Input
                                                    label={t('Item Name')}
                                                    placeholder={t('Item Name')}
                                                    value={value}
                                                    onChangeText={(text) => onChange(text)}
                                                    error={!!errors.description}
                                                />
                                            )}
                                        />
                                        {errors.description && (
                                            <FontText type="body" className="text-feedback-error mt-1">
                                                {errors.description.message}
                                            </FontText>
                                        )}
                                    </View>

                                    {/* Price + Quantity */}
                                    <View>
                                        <View className="flex-row items-center justify-between">
                                            {/* Price */}
                                            <View className="w-[47%]">
                                                <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label, 'mb-2')}>
                                                    {t('Price')}
                                                </FontText>
                                                <Controller
                                                    control={control}
                                                    name="unitPrice"
                                                    render={({ field: { onChange, value } }) => (
                                                        <Input
                                                            placeholder={t('0.00')}
                                                            value={Number.isFinite(value) ? value?.toString() : ''}
                                                            onChangeText={(text) => {
                                                                const num = Number(text.replace(/[^0-9.]/g, ''));
                                                                onChange(Number.isNaN(num) ? 0 : num);
                                                            }}
                                                            keyboardType="decimal-pad"
                                                            isHasCurrency
                                                            error={!!errors.unitPrice}
                                                        />
                                                    )}
                                                />
                                                {errors.unitPrice && (
                                                    <FontText type="body" className="text-feedback-error mt-1">
                                                        {errors.unitPrice.message}
                                                    </FontText>
                                                )}
                                            </View>

                                            {/* Quantity */}
                                            <View className="w-[47%]">
                                                <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label, 'mb-2')}>
                                                    {t('Quantity')}
                                                </FontText>
                                                <View className="flex-row items-center justify-between w-full h-11 px-4 border border-stroke-input rounded">
                                                    <Pressable onPress={decrementQuantity}>
                                                        <MinusIcon size={18} color="#001F5F" />
                                                    </Pressable>
                                                    <FontText type="body" weight="regular" className="text-content-primary text-base">
                                                        {quantity}
                                                    </FontText>
                                                    <Pressable onPress={incrementQuantity}>
                                                        <PlusIcon size={18} color="#001F5F" />
                                                    </Pressable>
                                                </View>
                                                {errors.quantity && (
                                                    <FontText type="body" className="text-feedback-error mt-1">
                                                        {errors.quantity.message}
                                                    </FontText>
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    {/* Submit */}
                                    <View className="mt-8">
                                        <Button
                                            title={editingItem ? t('Update item') : t('Add new item')}
                                            onPress={handleSubmit(
                                                onSubmit,
                                                (formErrors) => {
                                                    // Optional: add any extra UX feedback here
                                                    console.log('Item form validation errors:', formErrors);
                                                }
                                            )}
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

export default AddItemModal;