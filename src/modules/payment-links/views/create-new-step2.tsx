import DateSelector from "@/src/shared/components/bottom-sheets/select-date/DateSelector";
import DateSelectPickerBottomSheet, { DateSelectPickerRef } from "@/src/shared/components/bottom-sheets/select-date/DateSelectPickerBottomSheet";
import Button from "@/src/shared/components/Buttons/Button";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import AnimatedErrorMsg from "@/src/shared/components/animated-messages/AnimatedErrorMsg";
import MainHeader from "@/src/shared/components/headers/MainHeader";
import Input from "@/src/shared/components/inputs/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {  View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarIcon, DocumentTextIcon, HashtagIcon } from "react-native-heroicons/outline";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import CreateOptionBox from "../components/create-payment/CreateOptionBox";
import { CreatePaymentLinkTypes, createPaymentLinkSchema } from "../payment-links.scheme";
import { usePaymentLinkStore } from "../paymentLink.store";
import usePaymentLinkVM from "../viewmodels/usePaymentLinkVM";

const CreateNewPaymentLinkStep2Screen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const dateSelectPickerRef = useRef<DateSelectPickerRef>(null);
    const { formData, clearFormData, setFormData } = usePaymentLinkStore();
    const { paymentLinkId } = useLocalSearchParams<{ paymentLinkId?: string }>();
    const {
        paymentLink,
        isEditMode,
        isLoadingPaymentLink,
        error,
        submitPaymentLink
    } = usePaymentLinkVM(paymentLinkId);
    console.log('Step2 paymentLinkId', paymentLinkId);
    // console.log('Step2 isEditMode', isEditMode);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<CreatePaymentLinkTypes>({
        resolver: zodResolver(createPaymentLinkSchema),
        defaultValues: formData,
    });

    // 🔑 keep store in sync with form values
    const values = useWatch({ control });
    console.log('Step2 values', values);
    useEffect(() => {
        setFormData(values);
    }, [values, setFormData]);

    const handleDateSelectPickerClose = () => {
        dateSelectPickerRef.current?.close();
    };

    const handleDateSelectPickerExpand = () => {
        dateSelectPickerRef.current?.expand();
    };

    const onSubmit = async (data: CreatePaymentLinkTypes) => {
        console.log("Submitting with optional fields:", data);
        await submitPaymentLink(data);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader title={t("Additional Options")} withBack />

            <KeyboardAwareScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <AnimatedError errorMsg={t(error?.message || '')} />
                {/* Due Date */}
                <CreateOptionBox
                    title={t("Set a due date")}
                    icon={<CalendarIcon size={24} color="#556767" />}
                >
                    <Controller
                        control={control}
                        name="dueDate"
                        render={({ field: { onChange, value } }) => (
                            <DateSelector
                                label={t("Due Date")}
                                date={value}
                                onPress={handleDateSelectPickerExpand}
                                t={t}
                            />


                        )}
                    />
                    <AnimatedErrorMsg errorMsg={t(errors.dueDate?.message || '')} />
                </CreateOptionBox>

                {/* Serial Number */}
                <CreateOptionBox
                    title={t("Add a serial number")}
                    icon={<HashtagIcon size={24} color="#556767" />}
                >
                    <Controller
                        control={control}
                        name="referenceId"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label={t("Serial Number")}
                                placeholder={t("Serial number (Optional)")}
                                value={value}
                                onChangeText={onChange}
                                error={!!errors.referenceId}
                            />
                        )}
                    />
                    <AnimatedErrorMsg errorMsg={t(errors.referenceId?.message || '')} />
                </CreateOptionBox>

                {/* Note */}
                <CreateOptionBox
                    title={t("Add a note")}
                    icon={<DocumentTextIcon size={24} color="#556767" />}
                >
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label={t("Note")}
                                placeholder={t("Type a note (Optional)")}
                                value={value}
                                onChangeText={onChange}
                                multiline
                                numberOfLines={4}
                                error={!!errors.description}
                            />
                        )}
                    />
                    <AnimatedErrorMsg errorMsg={t(errors.description?.message || '')} />
                </CreateOptionBox>

                {/* Actions */}
                <View className="mt-8 mb-4">
                    <Button
                        disabled={!isValid}
                        title={t(isEditMode ? "Update payment link" : "Create payment link")}
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isLoadingPaymentLink}
                    />

                    <Button
                        title={t("Cancel")}
                        onPress={() => router.back()}
                        variant="outline"
                        className="mt-3"
                    />

                </View>

            </KeyboardAwareScrollView>
            <DateSelectPickerBottomSheet
                ref={dateSelectPickerRef}
                title={t("Select a date")}
                savedDate={formData.dueDate}
                onDateSelected={(date) => {
                    setValue("dueDate", date, { shouldValidate: true });
                    handleDateSelectPickerClose();
                }}
                onClose={handleDateSelectPickerClose}
            />
        </SafeAreaView>
    );
}

export default CreateNewPaymentLinkStep2Screen;