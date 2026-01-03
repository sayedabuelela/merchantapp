import { AlertIcon, CameraIcon, DownArrow } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import FontText from '@/src/shared/components/FontText';
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from '@/src/shared/styles/main';
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { useFilePicker } from "../../hooks/useFilePicker";
import { BusinessDetailsFormData, BusinessIndustries, BusinessIndustry } from "../business.model";
import { businessScheme } from "../business.scheme";
import SocialRules from "./SocialRules";


interface BusinessDetailsFormProps {
    onSubmit: (data: BusinessDetailsFormData, formState: { dirtyFields: { [key: string]: boolean }, isDirty: boolean }) => void;
    loading: boolean;
    error?: string;
    existingData?: BusinessDetailsFormData;
    businessIndustries?: BusinessIndustries;
    selectedIndustry?: BusinessIndustry,
    selectedSector?: string,
    handleIndustryChange: (industry: BusinessIndustry) => void,
    handleSectorChange: (sector: string) => void,
}

const BusinessDetailsForm = ({ onSubmit, loading, error, existingData, businessIndustries, selectedIndustry, selectedSector, handleIndustryChange, handleSectorChange }: BusinessDetailsFormProps) => {
    const { t } = useTranslation();
    const [displayedError, setDisplayedError] = useState<string | undefined>(undefined);
    const [businessLogoDisplay, setBusinessLogoDisplay] = useState<string | undefined>(undefined);


    const { control, handleSubmit, formState: { errors, isValid, isDirty, dirtyFields }, setFocus, reset, setValue, trigger, watch } = useForm<BusinessDetailsFormData>({
        resolver: zodResolver(businessScheme),
        defaultValues: existingData,
    });
    watch('businessLogo');
    const {
        image,
        document,
        pickImage,
        pickDocument,
        clearImage,
        clearDocument,
        isLoading: isPicking
    } = useFilePicker();
    console.log('existingData.businessLogo : ', existingData?.businessLogo);


    useEffect(() => {
        if (image) {
            setValue('businessLogo', image, { shouldDirty: true });
            setBusinessLogoDisplay(image?.uri);
        }
    }, [image, setValue]);

    useEffect(() => {
        if (error) {
            setDisplayedError(error);
        }
    }, [error]);

    useEffect(() => {
        if (existingData && !isDirty) { 
            reset(existingData);
            setBusinessLogoDisplay(existingData.businessLogo as string);
        }
    }, [existingData, reset, isDirty]);

    const submitHandler = (data: BusinessDetailsFormData) => {
        onSubmit(data, { dirtyFields: dirtyFields as { [key: string]: boolean }, isDirty });
    }

    const handleInputChange = (fieldOnChange: (...event: any[]) => void) => (...args: any[]) => {
        if (displayedError) {
            setDisplayedError(undefined);
        }
        fieldOnChange(...args);
    };

    const handleLogoChange = async () => {
        await pickImage();
    }

    return (
        <View className="w-full">

            {displayedError && (
                <AnimatedError errorMsg={t(displayedError)} />
            )}
            
            <View>
                <Controller
                    name="businessLogo"
                    control={control}
                    render={({ field }) => (
                        <TouchableOpacity
                            className="w-[107px] h-[107px] rounded-full bg-surface-disabled items-center justify-center"
                            onPress={handleLogoChange}
                            disabled={isPicking}
                        >
                            {loading && <ActivityIndicator />}
                            {!loading && !businessLogoDisplay && <CameraIcon />}
                            {!loading && businessLogoDisplay && (
                                <Image
                                    source={{ uri: businessLogoDisplay }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 100,
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                />
                <FontText type="body" weight="semi" className="text-content-primary text-base mt-4 self-start">
                    {t('Business Logo')}
                </FontText>
            </View>
            <View className="mt-4">
                <Controller
                    control={control}
                    name="legalCompanyName"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Legal Company Name')}
                            returnKeyType='next'
                            autoCorrect={false}
                            error={!!errors.legalCompanyName}
                            placeholder={t('Enter your legal company name')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.legalCompanyName &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.legalCompanyName?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="storeName"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            label={t('Business/Commercial Name')}
                            returnKeyType='next'
                            error={!!errors.storeName}
                            placeholder={t('Enter your store name')}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            onSubmitEditing={() => {
                                setFocus('description');
                            }}
                        />
                    )}
                />
                {errors.storeName &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.storeName?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <FontText
                    weight='semi'
                    className={`${COMMON_STYLES.label}`}>
                    {t('Business Industry')}
                </FontText>
                <Controller
                    control={control}
                    name="businessIndustry"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <TouchableOpacity className="w-full flex-row items-center justify-between px-4 h-11 bg-white border rounded border-stroke-input">
                                    <FontText type="body" weight="regular" className={`text-base ${selectedIndustry ? 'text-content-primary' : 'text-placeholder-color'}`}>{selectedIndustry?.[I18nManager.isRTL ? 'ar' : 'en'] || t('Please select industry')}</FontText>
                                    <DownArrow />
                                </TouchableOpacity>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Label />
                                {businessIndustries?.map((industry) => (
                                    <DropdownMenu.Item key={industry.id.toString()} onSelect={() => {
                                        onChange(industry.id.toString());
                                        handleIndustryChange(industry)
                                    }}>
                                        <DropdownMenu.ItemTitle>{industry[I18nManager.isRTL ? 'ar' : 'en']}</DropdownMenu.ItemTitle>
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    )}
                />
                {errors.businessIndustry &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.businessIndustry?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <FontText
                    weight='semi'
                    className={`${COMMON_STYLES.label}`}>
                    {t('Business Sector')}
                </FontText>
                <Controller
                    control={control}
                    name="businessSector"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <TouchableOpacity className="w-full flex-row items-center justify-between px-4 h-11 bg-white border rounded border-stroke-input">
                                    <FontText type="body" weight="regular" className={`text-base ${selectedSector ? 'text-content-primary' : 'text-placeholder-color'}`}>{selectedSector || t('Please select sector')}</FontText>
                                    <DownArrow />
                                </TouchableOpacity>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Label />
                                {selectedIndustry?.sectors?.map((sector) => (
                                    <DropdownMenu.Item key={sector.value} onSelect={() => {
                                        onChange(sector.value);
                                        handleSectorChange(sector.value)
                                    }}>
                                        <DropdownMenu.ItemTitle>{sector[I18nManager.isRTL ? 'ar' : 'en']}</DropdownMenu.ItemTitle>
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    )}
                />
                {errors.businessSector && (
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors.businessSector.message!)}
                        </FontText>
                    </Animated.View>
                )}
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            label={t('Business Description (Optional)')}
                            returnKeyType='next'
                            error={!!errors.description}
                            placeholder={t('Enter your business description')}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            onSubmitEditing={() => {
                                setFocus('description');
                            }}
                        />
                    )}
                />
                {errors.description &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.description?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="companyWebsite"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Website URL (Optional)')}
                            returnKeyType='next'
                            keyboardType='url'
                            autoCorrect={false}
                            error={!!errors.companyWebsite}
                            placeholder={t('Example: https://google.com')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.companyWebsite &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.companyWebsite?.message!)}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <View className="mt-4">
                <Controller
                    control={control}
                    name="socialLinkedIn"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('LinkedIn (Optional)')}
                            returnKeyType='next'
                            keyboardType='url'
                            autoCorrect={false}
                            error={!!errors.socialLinkedIn}
                            placeholder={t('Example: https://linkedin.com/company')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.socialLinkedIn &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.socialLinkedIn?.message!)}
                        </FontText>
                    </Animated.View>
                }
            </View>
            <View className="mt-4">
                <Controller
                    control={control}
                    name="socialFacebook"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Facebook (Optional)')}
                            returnKeyType='next'
                            keyboardType='url'
                            autoCorrect={false}
                            error={!!errors.socialFacebook}
                            placeholder={t('Example: https://facebook.com/company')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.socialFacebook &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.socialFacebook?.message!)}
                        </FontText>
                    </Animated.View>
                }
            </View>
            <View className="mt-4">
                <Controller
                    control={control}
                    name="socialInstagram"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('Instagram (Optional)')}
                            returnKeyType='next'
                            keyboardType='url'
                            autoCorrect={false}
                            error={!!errors.socialInstagram}
                            placeholder={t('Example: https://instagram.com/company')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.socialInstagram &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.socialInstagram?.message!)}
                        </FontText>
                    </Animated.View>
                }
            </View>
            <View className="mt-4">
                <Controller
                    control={control}
                    name="socialTwitter"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange(value?.trim());
                                onBlur();
                            }}
                            label={t('X (Optional)')}
                            returnKeyType='next'
                            keyboardType='url'
                            autoCorrect={false}
                            error={!!errors.socialTwitter}
                            placeholder={t('Example: https://x.com/company')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.socialTwitter &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.socialTwitter?.message!)}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <SocialRules />

            <View className="mt-4">
                <FontText
                    weight='semi'
                    className={`${COMMON_STYLES.label}`}>
                    {t('Terms & Conditions')}
                </FontText>
                <Controller
                    control={control}
                    name="termsAndConditions"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            className="h-52 p-3"
                            inputClassName="text-sm"
                            ref={ref}
                            value={value?.en}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange({ ...value, en: value?.en?.trim() });
                                onBlur();
                            }}
                            label={t('In English')}
                            returnKeyType='next'
                            autoCorrect={false}
                            multiline
                            error={!!errors.termsAndConditions?.en}
                            placeholder={t('Enter terms and conditions in English')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.termsAndConditions?.en &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.termsAndConditions?.en?.message!)}
                        </FontText>
                    </Animated.View>
                }
            </View>
            <View className="mt-4">
                <Controller
                    control={control}
                    name="termsAndConditions"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            className="h-52 p-3"
                            inputClassName="text-sm text-content-secondary text-right"
                            ref={ref}
                            value={value?.ar}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={() => {
                                onChange({ ...value, ar: value?.ar?.trim() });
                                onBlur();
                            }}
                            label={t('اللغة العربية')}
                            labelClassName="text-right self-end font-body-semi-rtl self-start"
                            returnKeyType='done'
                            autoCorrect={false}
                            multiline
                            error={!!errors.termsAndConditions?.ar}
                            placeholder={t('Enter terms and conditions in Arabic')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />
                {errors.termsAndConditions?.ar &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.termsAndConditions?.ar?.message!)}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <Button
                className='mt-6'
                title={t('Continue')}
                isLoading={loading}
                disabled={!isValid || !selectedSector}
                onPress={handleSubmit(submitHandler)}
            />

        </View>
    )
}

export default BusinessDetailsForm;