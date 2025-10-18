import { AlertIcon } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import FontText from "@/src/shared/components/FontText";
import Input from "@/src/shared/components/inputs/Input";
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { RegisterDataFormData, RegisterDataFormProps } from "../register-data.model";
import { RegisterDataSchema } from "../register-data.scheme";

const RegisterDataForm = ({ onSubmit, loading, error }: RegisterDataFormProps) => {
    const { t } = useTranslation();
    const [displayedError, setDisplayedError] = useState<string | undefined>(undefined);

    const { control, handleSubmit, formState: { errors, isValid }, setFocus } = useForm<RegisterDataFormData>({
        resolver: zodResolver(RegisterDataSchema),
        defaultValues: {
            mobileNumber: '',
            storeName: '',
            firstName: '',
            lastName: '',
        },
    });

    useEffect(() => {
        if (error) {
            setDisplayedError(error);
        }
    }, [error]);

    const handleInputChange = (fieldOnChange: (...event: any[]) => void) => (...args: any[]) => {
        if (displayedError) {
            setDisplayedError(undefined);
        }
        fieldOnChange(...args);
    };
    return (
        <View className="flex-1 justify-between mt-20">

            {displayedError && (
                <AnimatedError errorMsg={t(displayedError)} />
            )}

            <View>

                <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            className='mb-5'
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={onBlur}
                            label={t('First Name')}
                            returnKeyType='next'
                            autoCorrect={false}
                            error={!!errors.firstName}
                            placeholder={t('Enter your first name')}
                            onSubmitEditing={() => {
                                setFocus('lastName');
                            }}
                        />
                    )}
                />

                {errors.firstName &&
                    <Animated.View
                        className="flex-row items-center mt-2 "
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.firstName?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }

                <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            className='mb-5'
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={onBlur}
                            label={t('Last Name')}
                            returnKeyType='next'
                            autoCorrect={false}
                            error={!!errors.lastName}
                            placeholder={t('Enter your last name')}
                            onSubmitEditing={() => {
                                setFocus('storeName');
                            }}
                        />
                    )}
                />

                {errors.lastName &&
                    <Animated.View
                        className="flex-row items-center"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.firstName?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }

                <Controller
                    control={control}
                    name="storeName"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            className={`${!errors.storeName ? 'mb-5' : 'mb-3'}`}
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={onBlur}
                            label={t('Store Name')}
                            returnKeyType='next'
                            autoCorrect={false}
                            error={!!errors.storeName}
                            placeholder={t('Enter your store name')}
                            onSubmitEditing={() => {
                                setFocus('mobileNumber');
                            }}
                        />
                    )}
                />

                {errors.storeName &&
                    <Animated.View
                        className="flex-row items-center mb-5"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.storeName?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }

                <Controller
                    control={control}
                    name="mobileNumber"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            className='mb-5'
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            onBlur={onBlur}
                            label={t('Mobile Number')}
                            returnKeyType='done'
                            autoCorrect={false}
                            error={!!errors.mobileNumber}
                            placeholder={t('Enter your mobile number')}
                            onSubmitEditing={() => {
                                // setFocus('mobileNumber');
                                handleSubmit(onSubmit)();
                            }}
                        />
                    )}
                />

                {errors.mobileNumber &&
                    <Animated.View
                        className="flex-row items-center"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                            {t(errors?.mobileNumber?.message || 'This is required.')}
                        </FontText>
                    </Animated.View>
                }

            </View>

            <Button
                className='mt-6 '
                title={t('Continue')}
                isLoading={loading}
                disabled={!isValid || loading}
                fullWidth
                onPress={handleSubmit(onSubmit)}
            // onPress={() => { router.push(ROUTES.AUTH.REGISTER_OTP) }}
            />
        </View>
    )
}

export default RegisterDataForm