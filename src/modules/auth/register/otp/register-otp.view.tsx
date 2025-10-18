import { OtpIcon } from '@/src/shared/assets/svgs';
import Button from '@/src/shared/components/Buttons/Button';
import AnimatedError from '@/src/shared/components/animated-messages/AnimatedError';
import FontText from '@/src/shared/components/FontText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OtpInput from '../../components/OtpInput';
import ResendTimer from '../../components/ResendTimer';
import useOtp from './otp.viewmodel';

export default function VerifyOTPScreen() {
    const { t } = useTranslation();
    const { verifyOtp, generateOtp, isGenerating, isVerifying, verifyError, verifyReset } = useOtp();
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [otpValue, setOtpValue] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const handleOtpComplete = (code: string) => {
        console.log('OTP Entered:', code);
        setIsComplete(true);
    };

    const onSubmit = async () => {
        console.log('OTP Submitted:', otpValue);
        await verifyOtp({ key: email, code: otpValue });
        router.push({
            pathname: `/(auth)/(register)/register-password`,
            params: { email, code: otpValue },
        })
    };

    const handleOtpChange = useCallback((code: string) => {
        setOtpValue(code);
    }, []);

    const onResendOtp = async () => {
        console.log('Resend OTP');
        setOtpValue('');
        verifyReset();
        await generateOtp(email);
    };

    return (
        <SafeAreaView className="flex-1 bg-white pt-28">

            <ScrollView
                className="flex-1 px-6 pb-16"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className='items-center mb-10'>
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
            </ScrollView>
        </SafeAreaView>
    );

};
