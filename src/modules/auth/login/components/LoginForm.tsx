import { ROUTES } from '@/src/core/navigation/routes';
import { LoginFormData } from "@/src/modules/auth/login/login.model";
import { loginSchema } from '@/src/modules/auth/login/login.scheme';
import { AlertIcon } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import AnimatedError from '@/src/shared/components/animated-messages/AnimatedError';
import FontText from "@/src/shared/components/FontText";
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    loading: boolean;
    error?: string;
}


export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
    const { t } = useTranslation();
    const [displayedError, setDisplayedError] = useState<string | undefined>(undefined);

    const { control, handleSubmit, formState: { errors, isValid }, setFocus } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            // email: 'pisej21977@hazhab.com',
            // email: 'logare2532@frisbook.com',
            // email: 'saboelela@kashier.io',
            // password: 'P@ssw0rdd',
            // email: 'awageeh@kashier.io',
            // password: 'P@ssw0rd012',
            // email: 'kexoka8183@fixwap.com',
            // email: 'sexepic929@fixwap.com',
            // email: 'xihoxi2002@elygifts.com',
            // password: 'P@ssw0rdd',
            // email: 'zb5eo39fvq@zudpck.com',
            // password: 'Password500$$',
            // email: 'kamati2654@filipx.com',
            // password: 'P@ssw0rd',
            // production 
            // email: 'bayoumi.store@gmail.com',
            // password: 'Aa@12345',
            // email: 'pesyamao2@gmail.com',
            // password: 'SaraTest@010',
            // staging
            // email: 'duaa.bst@gmail.com',
            // password: 'AsmaaTest110@',
            // email: 'jglgm9d29g@jkotypc.com',
            // password: 'Password500$$',
            // email: 'vawoyal409@fandoe.com',
            // password: 'P@ssw0rd',
        },
    });

    useEffect(() => {
        if (error) {
            setDisplayedError(error);
        }
    }, [error]);

    const submitHandler = (data: LoginFormData) => {
        onSubmit(data)
    }

    const handleInputChange = (fieldOnChange: (...event: any[]) => void) => (...args: any[]) => {
        if (displayedError) {
            setDisplayedError(undefined);
        }
        fieldOnChange(...args);
    };

    // useEffect(() => {
    //     if (error && error === displayedError) {
    //         setDisplayedError(undefined);
    //         setTimeout(() => {
    //             setDisplayedError(error);
    //         }, 10);
    //     } else if (error) {
    //         setDisplayedError(error);
    //     }
    // }, [error]);

    useEffect(() => {
        setDisplayedError(error);
    }, [error]);

    return (
        <View className="w-full mt-8">

            {displayedError && (
                <AnimatedError errorMsg={t(displayedError)} />
            )}

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                        ref={ref}
                        value={value}
                        onChangeText={handleInputChange(onChange)}
                        onBlur={onBlur}
                        label={t('Email')}
                        returnKeyType='next'
                        keyboardType='email-address'
                        autoCorrect={false}
                        error={!!errors.email}
                        placeholder={t('Enter your email address')}
                        onSubmitEditing={() => {
                            setFocus('password');
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
                    <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap self-start`}>
                        {t(errors?.email?.message || 'This field is required.')}
                    </FontText>
                </Animated.View>
            }

            <View className="mt-6">
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={handleInputChange(onChange)}
                            label={t('Password')}
                            returnKeyType='done'
                            // secureTextEntry
                            error={!!errors.password}
                            placeholder={t('Enter your password')}
                            onBlur={onBlur}
                            isPassword
                            onSubmitEditing={() => {
                                handleSubmit(submitHandler)();
                            }}
                        />
                    )}
                />
                {errors.password &&
                    <Animated.View
                        className="flex-row items-center mt-2"
                        entering={FadeIn}
                        exiting={FadeOut}>
                        <AlertIcon />
                        <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5  flex-wrap self-start`}>
                            {t(errors?.password?.message || 'This field is required.')}
                        </FontText>
                    </Animated.View>
                }
            </View>

            <Link href={ROUTES.AUTH.RESET_EMAIL} className={`mt-4 self-end text-sm`}>
                <FontText
                    weight='bold'
                    className={'text-primary '}
                >
                    {t('Forgot Password?')}
                </FontText>
            </Link>

            <Button
                className='mt-6'
                title={t('Login')}
                isLoading={loading}
                disabled={!isValid}
                onPress={handleSubmit(submitHandler)}
            />


        </View>
    );
}
