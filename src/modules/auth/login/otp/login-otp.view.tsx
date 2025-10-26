import { OtpIcon } from '@/src/shared/assets/svgs';
import Button from '@/src/shared/components/Buttons/Button';
import AnimatedError from '@/src/shared/components/animated-messages/AnimatedError';
import FontText from '@/src/shared/components/FontText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from "react-i18next";
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OtpInput from '../../components/OtpInput';
import ResendTimer from '../../components/ResendTimer';
import useOtp from './otp.viewmodel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ROUTES } from '@/src/core/navigation/routes';
import { useBiometricViewModel } from '../../biometric/biometric.viewmodel';

export default function LoginVerifyOTPScreen() {
    const { t } = useTranslation();

    const { verifyOtp, generateOtp, isGenerating, isVerifying, verifyError, verifyReset } = useOtp();
    const router = useRouter();
    const { email, password } = useLocalSearchParams<{ email: string, password: string }>();

    const [otpValue, setOtpValue] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const handleOtpComplete = (code: string) => {
        console.log('OTP Entered:', code);
        setIsComplete(true);
    };

    const onSubmit = async () => {
        console.log('OTP Submitted:', otpValue);
        await verifyOtp({ signupKey: email, code: otpValue }, {
            // onSuccess: (data) => {
            //     console.log('OTP Verified:', data);

            // }
        });
    };

    const handleOtpChange = useCallback((code: string) => {
        setOtpValue(code);
    }, []);

    const onResendOtp = async () => {
        console.log('Resend OTP');
        setOtpValue('');
        verifyReset();
        await generateOtp({ email, password });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: 80,
                    paddingHorizontal: 24,
                    paddingBottom: 24
                }}
                keyboardShouldPersistTaps="handled"
                bottomOffset={100}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View className='items-center mb-6'>
                    <OtpIcon />

                    <FontText
                        type='head'
                        weight='bold'
                        className='text-xl mt-10'>
                        {t('Verification Code')}
                    </FontText>

                    <FontText
                        className='text-center mt-8'>
                        {t('An Email with a verification code was sent to')} {email}
                    </FontText>

                </View>

                {verifyError && (
                    <AnimatedError errorMsg={t(verifyError.message || verifyError.error || "Something went wrong")} />
                )}

                <View className="flex-1 justify-between">

                    <View>
                        <OtpInput
                            value={otpValue}
                            onChange={handleOtpChange}
                            onComplete={handleOtpComplete}
                            length={4}
                            autoFocus={true}
                            disabled={isVerifying}
                        />

                        <ResendTimer
                            initialSeconds={30}
                            onResend={onResendOtp}
                        />
                    </View>

                    <Button
                        className='mt-6 '
                        title={t('Continue')}
                        disabled={otpValue.length < 4}
                        isLoading={isVerifying || isGenerating}
                        fullWidth
                        onPress={onSubmit}
                    // onPress={() => { router.push(ROUTES.AUTH.REGISTER_DATA) }}
                    />

                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );

};
