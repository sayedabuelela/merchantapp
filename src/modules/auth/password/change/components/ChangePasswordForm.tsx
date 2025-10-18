import { AlertIcon } from "@/src/shared/assets/svgs";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import Input from "@/src/shared/components/inputs/Input";
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuthStore } from "../../../auth.store";
import { ChangePasswordRequest } from "../change.model";
import { changePasswordSchema } from "../change.scheme";
import { useEffect, useState } from "react";
import PasswordRules from "./PasswordRules";

interface PasswordFormProps {
    onSubmit: (data: ChangePasswordRequest) => void;
    isLoading?: boolean;
}

const ChangePasswordForm = ({ onSubmit, isLoading }: PasswordFormProps) => {
    const { t } = useTranslation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    // console.log('isAuthenticated : ', isAuthenticated);
    // const [currentPassword, setCurrentPassword] = useState('');

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        setFocus
    } = useForm<ChangePasswordRequest>({
        resolver: zodResolver(changePasswordSchema),
        mode: 'onChange',
        defaultValues: {
            currentPassword: '',
            newPassword: ''
        },
    });

    // const password = watch('currentPassword', '');
    const password = useWatch({ control, name: 'currentPassword', defaultValue: '' });
    const newPassword = useWatch({ control, name: 'newPassword', defaultValue: '' });

    console.log('password:', password);
    // useEffect(() => {
    //     console.log('useEffect password:', password);
    // }, [password]);
    const checks = {
        length: newPassword.length >= 8 || password.length >= 8,
        uppercase: /[A-Z]/.test(newPassword) || /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(newPassword) || /[a-z]/.test(password),
        number: /\d/.test(newPassword) || /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(newPassword) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
    };

    return (
        <View className="flex-1 justify-between mt-8">
            <View>

                <View className="mb-6">
                    <Controller
                        control={control}
                        name="currentPassword"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Input
                                ref={ref}
                                value={value}
                                onChangeText={(text) => {
                                    console.log("New password input:", text);
                                    onChange(text);
                                }}
                                onBlur={onBlur}
                                label={t('Current Password')}
                                returnKeyType='next'
                                autoCorrect={false}
                                error={!!errors.currentPassword}
                                placeholder={t('Enter your current password')}
                                isPassword
                                onSubmitEditing={() => {
                                    setFocus('newPassword');
                                }}
                            />

                        )}
                    />

                    {errors.currentPassword &&
                        <Animated.View
                            className="flex-row items-center mt-2"
                            entering={FadeIn}
                            exiting={FadeOut}>
                            <AlertIcon />
                            <FontText className={`${COMMON_STYLES.errorMsg} ml-2.5 flex-1 flex-wrap`}>
                                {t(errors?.currentPassword?.message || 'This is required.')}
                            </FontText>
                        </Animated.View>
                    }
                </View>

                <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            label={t('New Password')}
                            returnKeyType='done'
                            autoCorrect={false}
                            error={!!errors.newPassword}
                            placeholder={t('Enter your new password')}
                            isPassword
                            onSubmitEditing={() => {
                                handleSubmit(onSubmit)();
                            }}
                        />

                    )}
                />
                {password && password.length > 0 &&
                    <PasswordRules checks={checks} />
                }

                {/* {password.length > 0 &&
                    <View className="bg-[#F1F6FF] p-3 rounded-md border border-[#A8C4FF] mt-6">
                        <FontText
                            type='body'
                            weight='bold'
                            className="text-content-secondary mb-3 text-sm">
                            {t('These are instructions about how your password should be:')}
                        </FontText>
                        {[
                            { label: t('Password must be at least 8 characters'), ok: checks.length },
                            { label: t('One capital letter & one small letter at least'), ok: checks.uppercase && checks.lowercase },
                            { label: t('Use at least one number in your password'), ok: checks.number },
                            { label: t('Add at least one special character ( @#$%!- ) in your password'), ok: checks.special },
                        ].map((item, i) => (
                            <View key={i} className="flex-row items-center mb-2">
                                <Ionicons
                                    name={item.ok ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={14}
                                    color={item.ok ? '#388E3B' : '#556767'}
                                />
                                <FontText
                                    type='body'
                                    weight='semi'
                                    className={`ml-2 text-sm ${item.ok ? 'text-[#388E3B] line-through' : 'text-content-secondary'}`}>
                                    {item.label}
                                </FontText>
                            </View>
                        ))}
                    </View>
                } */}


            </View>

            <Button
                className='mt-6 '
                title={t('Confirm Password')}
                disabled={!isValid || isLoading}
                fullWidth
                onPress={handleSubmit(onSubmit)}
            />
        </View>
    );
}

export default ChangePasswordForm;