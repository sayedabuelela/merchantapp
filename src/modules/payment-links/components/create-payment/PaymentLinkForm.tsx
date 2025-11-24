import { CheckBoxSquareEmptyIcon, CheckBoxSquareFilledIcon } from "@/src/shared/assets/svgs";
import AnimatedErrorMsg from "@/src/shared/components/animated-messages/AnimatedErrorMsg";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import Input from "@/src/shared/components/inputs/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { t } from "i18next";
import { AnimatePresence, MotiView } from "moti";
import { useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { BanknotesIcon, ShoppingBagIcon, TicketIcon, UserIcon } from "react-native-heroicons/outline";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { PaymentLink } from "../../payment-links.model";
import { createPaymentLinkSchema, CreatePaymentLinkTypes, FeeType, ItemType } from "../../payment-links.scheme";
import { usePaymentLinkStore } from "../../paymentLink.store";
import { mapApiToFormValues } from "../../paymentLink.utils";
import AddFeeModal from "../modals/AddFeeModal";
import AddItemModal from "../modals/AddItemModal";
import CreateOptionBox from "./CreateOptionBox";
import FeesList from "./fees/FeesList";
import ItemsList from "./items/ItemsList";

interface PaymentLinkFormProps {
    onSubmit: (data: CreatePaymentLinkTypes) => void;
    isLoading: boolean;
    error?: string;
    paymentType: "simple" | "professional";
    isEditMode?: boolean;
    paymentLink?: PaymentLink;
    qrCode?: boolean;
}

const PaymentLinkForm = ({ paymentType, onSubmit, isLoading, isEditMode, paymentLink, qrCode }: PaymentLinkFormProps) => {

    const [isItemModalVisible, setIsItemModalVisible] = useState(false);
    const [isFeeModalVisible, setIsFeeModalVisible] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState<number | undefined>();
    const [editingFeeIndex, setEditingFeeIndex] = useState<number | undefined>();
    const [hasExtraFees, setHasExtraFees] = useState(false);
    const { formData, setFormData } = usePaymentLinkStore();

    const methods = useForm<CreatePaymentLinkTypes>({
        resolver: zodResolver(createPaymentLinkSchema),
        defaultValues: {
            paymentType,
            customer: { name: "" },
            currency: "EGP",
            ...(paymentType === "simple" ? { totalAmount: "" } : { items: [] }),
        },
        mode: "onChange",
    });

    const { control, handleSubmit, formState: { errors, isValid }, setValue, trigger, reset, getValues } = methods;
    const { fields: items, append: appendItem, update: updateItem, remove: removeItem } = useFieldArray({
        control,
        name: "items",
    });

    const { fields: fees, append: appendFee, update: updateFee, remove: removeFee } = useFieldArray({
        control,
        name: "extraFees",
    });

    useEffect(() => {
        if (isEditMode && paymentLink) {
            const mapped = mapApiToFormValues(paymentLink);
            reset(mapped);
            setHasExtraFees(Boolean(mapped.extraFees && mapped.extraFees.length));
        }
    }, [isEditMode, paymentLink, reset]);

    const handleAddItem = useCallback((item: ItemType) => {
        if (editingItemIndex !== undefined) {
            updateItem(editingItemIndex, item);
            setEditingItemIndex(undefined);
        } else {
            appendItem(item);
        }
        setIsItemModalVisible(false);
    }, [editingItemIndex, appendItem, updateItem]);

    const handleAddFee = useCallback((fee: FeeType) => {
        if (editingFeeIndex !== undefined) {
            updateFee(editingFeeIndex, fee);
            setEditingFeeIndex(undefined);
        } else {
            appendFee(fee);
        }
        setIsFeeModalVisible(false);
    }, [editingFeeIndex, appendFee, updateFee]);

    const handleEditItem = useCallback((index: number) => {
        setEditingItemIndex(index);
        setIsItemModalVisible(true);
    }, []);

    const handleEditFee = useCallback((index: number) => {
        setEditingFeeIndex(index);
        setIsFeeModalVisible(true);
    }, []);

    const handleQuantityChange = useCallback((index: number, quantity: number) => {
        const item = items[index];
        updateItem(index, {
            ...item,
            quantity,
            subTotal: Number(item.unitPrice) * Number(quantity),
        });
    }, [items, updateItem]);

    const handleToggleFees = useCallback(() => {
        if (hasExtraFees) {
            setValue("extraFees", []);
            setHasExtraFees(false);
        } else {
            setHasExtraFees(true);
        }
    }, [hasExtraFees, setValue]);

    const onSubmitDirect = async (data: CreatePaymentLinkTypes) => {
        const payload = { ...data };
        if (!payload.extraFees?.length) {
            delete payload.extraFees;
        }
        onSubmit(payload);
    };

    const handleGoToOptional = useCallback(async () => {
        const fieldsToValidate = paymentType === "simple"
            ? ["customer.name", "totalAmount"] as const
            : ["customer.name", "items"] as const;

        const isFormValid = await trigger(fieldsToValidate);

        if (isFormValid) {
            const currentValues = getValues();
            setFormData(currentValues);

            router.push({
                pathname: "/payment-links/create-step2",
                ...(isEditMode ? { params: { paymentLinkId: paymentLink?.paymentLinkId } } : {}),
            });
        }
    }, [trigger, setFormData, getValues, isEditMode, paymentLink?.paymentLinkId, paymentType, router]);
    console.log("isLoading :", isLoading);
    return (
        <FormProvider {...methods}>
            <KeyboardAwareScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Customer */}
                <CreateOptionBox title={t("Customer")} icon={<UserIcon size={24} color="#556767" />}>
                    <Controller
                        control={control}
                        name="customer.name"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label={t("Customer")}
                                placeholder={t("Customer Name")}
                                value={value}
                                onChangeText={onChange}
                                error={!!errors.customer?.name}
                            />
                        )}
                    />
                    <AnimatedErrorMsg errorMsg={t(errors.customer?.name?.message || '')} />
                </CreateOptionBox>

                {/* Simple Type */}
                {paymentType === "simple" && (
                    <CreateOptionBox title={t("Pricing")} icon={<BanknotesIcon size={24} color="#556767" />}>
                        <Controller
                            control={control}
                            name="totalAmount"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label={t("Amount")}
                                    placeholder={t("0.00")}
                                    value={value}
                                    onChangeText={(text) => onChange(text.replace(/[^0-9.]/g, ""))}
                                    keyboardType="decimal-pad"
                                    error={!!errors.totalAmount}
                                    isHasCurrency
                                />
                            )}
                        />
                        <AnimatedErrorMsg errorMsg={t(errors.totalAmount?.message || '')} />

                        <Pressable
                            className="flex-row items-center border-t border-tertiary pt-6 mt-6"
                            onPress={handleToggleFees}
                        >
                            <View>
                                {hasExtraFees ? <CheckBoxSquareFilledIcon /> : <CheckBoxSquareEmptyIcon />}
                            </View>
                            <FontText type="body" weight="regular" className="text-content-primary text-base ml-2">
                                {t("Additional Fees")}
                            </FontText>
                        </Pressable>
                    </CreateOptionBox>
                )}

                {/* Professional Type */}
                {paymentType === "professional" && (
                    <CreateOptionBox
                        title={t("Items")}
                        icon={<ShoppingBagIcon size={24} color="#556767" />}
                        hasList
                        handleListButton={() => setIsItemModalVisible(true)}
                        listButtonTitle={t("New Item")}
                    >
                        <ItemsList
                            items={items}
                            onEdit={handleEditItem}
                            onDelete={removeItem}
                            onQuantityChange={handleQuantityChange}
                        />
                        <AnimatedErrorMsg errorMsg={t(errors.items?.message || '')} />
                        <Pressable
                            className="flex-row items-center border-t border-tertiary pt-6 mt-6"
                            onPress={handleToggleFees}
                        >
                            <View>
                                {hasExtraFees ? <CheckBoxSquareFilledIcon /> : <CheckBoxSquareEmptyIcon />}
                            </View>
                            <FontText type="body" weight="regular" className="text-content-primary text-base ml-2">
                                {t("Additional Fees")}
                            </FontText>
                        </Pressable>
                    </CreateOptionBox>
                )}

                {/* Additional Fees */}
                <AnimatePresence>
                    {hasExtraFees && (
                        <MotiView
                            from={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "timing", duration: 300 }}
                        >
                            <CreateOptionBox
                                title={t("Additional fees")}
                                icon={<TicketIcon size={24} color="#556767" />}
                                handleListButton={() => setIsFeeModalVisible(true)}
                                listButtonTitle={t("New Fee")}
                                hasList
                            >
                                <FeesList
                                    fees={fees}
                                    onEdit={handleEditFee}
                                    onDelete={removeFee}
                                />
                            </CreateOptionBox>
                        </MotiView>
                    )}
                </AnimatePresence>

                {/* Modals */}
                <AddItemModal
                    isVisible={isItemModalVisible}
                    onClose={() => {
                        setIsItemModalVisible(false);
                        setEditingItemIndex(undefined);
                    }}
                    onAddItem={handleAddItem}
                    editingItem={editingItemIndex !== undefined ? items[editingItemIndex] : undefined}
                />

                <AddFeeModal
                    isVisible={isFeeModalVisible}
                    onClose={() => {
                        setIsFeeModalVisible(false);
                        setEditingFeeIndex(undefined);
                    }}
                    onAddFee={handleAddFee}
                    editingFee={editingFeeIndex !== undefined ? fees[editingFeeIndex] : undefined}
                />

                {/* Actions */}
                <View className="mt-8 mb-4">
                    <Button
                        title={t(isEditMode ? "Update payment link" : "Create payment link")}
                        onPress={handleSubmit(onSubmitDirect)}
                        isLoading={isLoading}
                        disabled={
                            isLoading || !isValid
                        }
                    />

                    <Button
                        title={t("Assign additional options")}
                        onPress={handleGoToOptional}
                        variant="outline"
                        className="mt-3"
                    />
                </View>
            </KeyboardAwareScrollView>
        </FormProvider>
    );
};

export default PaymentLinkForm;