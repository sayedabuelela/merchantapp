import { AlertIcon, KashierLogo } from "@/src/shared/assets/svgs";
import Button from '@/src/shared/components/Buttons/Button';
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import FontText from "@/src/shared/components/FontText";
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {  View } from 'react-native';
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from 'react-native-safe-area-context';
import useRegisterOtp from '../otp/otp.viewmodel';
import { RegisterEmailFormData } from './register-email.model';
import { RegisterEmailSchema } from './register-email.scheme';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FadeInDownView, FadeInUpView } from "@/src/shared/components/wrappers/animated-wrappers";
const RegisterEmailScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { generateOtp, isGenerating, error } = useRegisterOtp();

    const [displayedError, setDisplayedError] = useState<string | undefined>(undefined);

    const { control, handleSubmit, formState: { errors, isValid }, setFocus } = useForm<RegisterEmailFormData>({
        resolver: zodResolver(RegisterEmailSchema),
        defaultValues: {
            email: '',
        },
    });

    useEffect(() => {
        if (error) {
            setDisplayedError(error.message);
        }
    }, [error]);

    const handleInputChange = (fieldOnChange: (...event: any[]) => void) => (...args: any[]) => {
        if (displayedError) {
            setDisplayedError(undefined);
        }
        fieldOnChange(...args);
    };

    const onSubmit = async ({ email }: RegisterEmailFormData) => {
        await generateOtp(email);
        router.push({
            pathname: `/(auth)/(register)/register-otp`,
            params: { email },
        })
    };


    return (
        <SafeAreaView className="flex-1 bg-white pt-36 px-6">

            <KeyboardAwareScrollView
                className="pb-16"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1,flex:1 }}
            >
                <FadeInDownView delay={0} duration={600}>
                    <KashierLogo
                        style={{
                            // marginBottom: 30,
                            alignSelf: 'center'
                        }}
                    />
                </FadeInDownView>

                {displayedError && (
                    <AnimatedError errorMsg={t(displayedError)} />
                )}

                <View className={`flex-1 justify-between ${!displayedError ? 'mt-20' : ''}`}>
                    <FadeInUpView delay={150} duration={600}>
                        <View className="">
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <Input
                                        ref={ref}
                                        value={value}
                                        onChangeText={handleInputChange(onChange)}
                                        onBlur={() => {
                                            onChange(value.trim());
                                            onBlur();
                                        }}
                                        label={t('Email')}
                                        returnKeyType='next'
                                        keyboardType='email-address'
                                        autoCorrect={false}
                                        error={!!errors.email}
                                        placeholder={t('Enter your email address')}
                                        onSubmitEditing={() => {
                                            setFocus('email');
                                        }}
                                    />
                                )}
                            />

                            {errors.email &&
                                <Animated.View
                                    className="flex-row items-center mt-2"
                                    entering={FadeIn}
                                    exiting={FadeOut}>
                                    <AlertIcon />
                                    <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                                        {t(errors?.email?.message || 'This is required.')}
                                    </FontText>
                                </Animated.View>
                            }

                        </View>
                    </FadeInUpView>

                    <FadeInUpView delay={300} duration={600}>
                        <Button
                            className='mt-6 '
                            title={t('Continue')}
                            isLoading={isGenerating}
                            disabled={!isValid || isGenerating}
                            fullWidth
                            onPress={handleSubmit(onSubmit)}
                        // onPress={() => { router.push(ROUTES.AUTH.REGISTER_OTP) }}
                        />
                    </FadeInUpView>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

export default RegisterEmailScreen;