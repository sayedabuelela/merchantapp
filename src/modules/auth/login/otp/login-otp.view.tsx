import { OtpIcon } from '@/src/shared/assets/svgs';
import Button from '@/src/shared/components/Buttons/Button';
import AnimatedError from '@/src/shared/components/animated-messages/AnimatedError';
import FontText from '@/src/shared/components/FontText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from "react-i18next";
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OtpInput, { OTP_LENGTH } from '../../components/OtpInput';
import ResendTimer from '../../components/ResendTimer';
import { isOtpLockoutError, useOtpLockout } from '../../hooks/useOtpLockout';
import useOtp from './otp.viewmodel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ROUTES } from '@/src/core/navigation/routes';
import { useBiometricViewModel } from '../../biometric/biometric.viewmodel';

export default function LoginVerifyOTPScreen() {
    const { t } = useTranslation();

    const { verifyOtp, generateOtp, isGenerating, isVerifying, verifyError, verifyReset } = useOtp();
    const router = useRouter();
    const { email, password } = useLocalSearchParams<{ email: string, password: string }>();
    const { isLocked, handleOtpError, lockoutMessage } = useOtpLockout();

    const [otpValue, setOtpValue] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const handleOtpComplete = (code: string) => {
        console.log('OTP Entered:', code);
        setIsComplete(true);
    };

    const onSubmit = async () => {
        try {
            await verifyOtp({ signupKey: email, code: otpValue });
        } catch (error) {
            // The code is cancelled on lockout, so the typed one is useless
            if (handleOtpError(error)) setOtpValue('');
        }
    };

    const handleOtpChange = useCallback((code: string) => {
        setOtpValue(code);
    }, []);

    const onResendOtp = async () => {
        setOtpValue('');
        verifyReset();
        try {
            await generateOtp({ email, password });
        } catch (error) {
            handleOtpError(error);
        }
    };

    const verifyErrorMsg = verifyError && !isOtpLockoutError(verifyError)
        ? t(verifyError.message || verifyError.error || "Something went wrong")
        : '';

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

                <AnimatedError errorMsg={lockoutMessage || verifyErrorMsg} />

                <View className="flex-1 justify-between">

                    <View>
                        <OtpInput
                            value={otpValue}
                            onChange={handleOtpChange}
                            onComplete={handleOtpComplete}
                            length={OTP_LENGTH}
                            autoFocus={true}
                            disabled={isVerifying || isLocked}
                        />

                        <ResendTimer
                            initialSeconds={30}
                            onResend={onResendOtp}
                            locked={isLocked}
                        />
                    </View>

                    <Button
                        className='mt-6 '
                        title={t('Continue')}
                        disabled={otpValue.length < OTP_LENGTH || isLocked}
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
