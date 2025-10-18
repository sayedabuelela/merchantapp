import { PasswordFormData } from '@/src/modules/auth/auth.model';
import { passwordSchema } from '@/src/modules/auth/auth.scheme';
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import Input from "@/src/shared/components/inputs/Input";
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface PasswordFormProps {
    onSubmit: (data: PasswordFormData) => void;
}
const PasswordForm = ({ onSubmit }: PasswordFormProps) => {
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        mode: 'onChange',
        defaultValues: { password: '' },
    });
    const password = useWatch({ control, name: 'password', defaultValue: '' });

    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
    };
    return (
        <View className="flex-1 justify-between mt-8">
            <View>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                            ref={ref}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            label={t('Create Password')}
                            returnKeyType='next'
                            autoCorrect={false}
                            error={!!errors.password}
                            placeholder={t('Enter your password')}
                            isPassword
                            onSubmitEditing={() => {
                                handleSubmit(onSubmit)();
                            }}
                        />

                    )}
                />

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
                                size={20}
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


            </View>

            <Button
                className='mt-6 '
                title={t('Confirm Password')}
                disabled={!isValid}
                fullWidth
                onPress={handleSubmit(onSubmit)}
            />
        </View>
    );
}

export default PasswordForm;