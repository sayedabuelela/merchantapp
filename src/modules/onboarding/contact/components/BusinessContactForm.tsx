import { AlertIcon, DownArrow } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import FontText from '@/src/shared/components/FontText';
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from '@/src/shared/styles/main';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { I18nManager, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { BusinessContactFormData, City } from "../contact.model";
import { businessContactScheme } from "../contact.scheme";

interface BusinessContactFormProps {
    onSubmit: (data: BusinessContactFormData, formState: {
        dirtyFields: { [key: string]: boolean },
        isDirty: boolean
    }) => void
    loading: boolean;
    error?: string;
    existingData?: BusinessContactFormData;
    cities?: City[];
    selectedCity?: string;
    handleCityChange: (cityValue: string) => void;
}

const BusinessContactForm = ({ onSubmit, loading, error, existingData, cities, selectedCity, handleCityChange }: BusinessContactFormProps) => {
    const { t } = useTranslation();
    const [displayedError, setDisplayedError] = useState<string | undefined>(undefined);
    // console.log('cities',cities);
    
    const { control, handleSubmit, formState: { errors, isValid, isDirty, dirtyFields }, setFocus, reset, setValue, trigger, watch } = useForm<BusinessContactFormData>({
        resolver: zodResolver(businessContactScheme),
        defaultValues: {
            ...existingData,
            country: "egypt",
            hotlineNumber: existingData?.hotlineNumber || "",
        },
    });


    useEffect(() => {
        if (error) {
            setDisplayedError(error);
        }
    }, [error]);

    useEffect(() => {
        if (existingData && !isDirty) {
            reset(existingData);
        }
    }, [existingData, reset, isDirty]);

    const submitHandler = (data: BusinessContactFormData) => {
        console.log('submitHandler : ', data);
        // const normalizedData = {
        //     ...data,
        //     hotlineNumber: data.hotlineNumber || ""  // Convert undefined to empty string
        //   };
        onSubmit(data, { dirtyFields: dirtyFields as { [key: string]: boolean }, isDirty });
    }

    const handleInputChange = (fieldOnChange: (...event: any[]) => void) => (...args: any[]) => {
        if (displayedError) {
            setDisplayedError(undefined);
        }
        fieldOnChange(...args);
    };


    return (
        <View className="w-full">
            {displayedError && (
                <AnimatedError errorMsg={t(displayedError)} />
            )}

            <View>
                <Controller
                    control={control}
                    name="country"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={onBlur}
                            label={t('Country')}
                            inputClassName="capitalize"
                            // defaultValue={t('Egypt')}
                            editable={false}
                            placeholder={t('Enter your country')}
                        />
                    )}
                />
            </View>

            <View className="mt-4">
                <FontText
                    weight='semi'
                    className={`${COMMON_STYLES.label}`}>
                    {t('Governorate')}
                </FontText>
                <Controller
                    control={control}
                    name="governorate"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <TouchableOpacity className="w-full flex-row items-center justify-between px-4 h-11 bg-white border rounded border-stroke-input">
                                    <FontText type="body" weight="regular" className={`text-base ${value ? 'text-content-primary' : 'text-placeholder-color'}`}>{selectedCity || t('Please select governorate')}</FontText>
                                    <DownArrow />
                                </TouchableOpacity>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Label />
                                {cities?.map((city) => (
                                    <DropdownMenu.Item key={city.id.toString()} onSelect={() => {
                                        onChange(city.value);
                                        handleCityChange(city[I18nManager.isRTL ? 'city_name_ar' : 'city_name_en']);
                                    }}>
                                        <DropdownMenu.ItemTitle>{city[I18nManager.isRTL ? 'city_name_ar' : 'city_name_en']}</DropdownMenu.ItemTitle>
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    )}
                />
                {errors.governorate &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.governorate?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="addressLine1"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Address Line 1')}
                            returnKeyType='next'
                            autoCorrect={false}
                            error={!!errors.addressLine1}
                            placeholder={t('Enter your address line 1')}
                            onSubmitEditing={() => {
                                setFocus('addressLine2');
                            }}
                        />
                    )}
                />
                {errors.addressLine1 &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.addressLine1?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="addressLine2"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Address Line 2 (Optional)')}
                            returnKeyType='next'
                            autoCorrect={false}
                            error={!!errors.addressLine2}
                            placeholder={t('Enter your address line 2')}
                            onSubmitEditing={() => {
                                setFocus('businessPhone');
                            }}
                        />
                    )}
                />
                {errors.addressLine2 &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.addressLine2?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="businessPhone"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Business Phone')}
                            returnKeyType='next'
                            keyboardType='phone-pad'
                            autoCorrect={false}
                            error={!!errors.businessPhone}
                            placeholder={t('Enter your business phone')}
                            onSubmitEditing={() => {
                                setFocus('businessEmail');
                            }}
                        />
                    )}
                />
                {errors.businessPhone &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.businessPhone?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="businessEmail"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Business Email')}
                            returnKeyType='next'
                            keyboardType='email-address'
                            autoCorrect={false}
                            error={!!errors.businessEmail}
                            placeholder={t('Enter your business email')}
                            onSubmitEditing={() => {
                                // setFocus('hotlineNumber');
                                handleSubmit(submitHandler)()
                            }}
                        />
                    )}
                />
                {errors.businessEmail &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.businessEmail?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="hotlineNumber"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Hotline Number (Optional)')}
                            returnKeyType='done'
                            keyboardType='phone-pad'
                            autoCorrect={false}
                            error={!!errors.hotlineNumber}
                            placeholder={t('Enter your hotline number')}
                        />
                    )}
                />
                {errors.hotlineNumber &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.hotlineNumber?.message || "")}
                        </FontText>
                    </Animated.View>
                }
            </View>
            <Button
                className='mt-6'
                title={t('Continue')}
                isLoading={loading}
                disabled={!isValid || !selectedCity}
                onPress={handleSubmit(submitHandler)}
            />

        </View>
    )
}

export default BusinessContactForm;
