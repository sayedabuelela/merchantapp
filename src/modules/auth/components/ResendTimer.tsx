import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type ResendTimerProps = {
    initialSeconds?: number;
    onResend: () => void;
};
const ResendTimer = ({ initialSeconds = 30, onResend }: ResendTimerProps) => {
    const { t } = useTranslation();
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (secondsLeft === 0) {
            setIsEnabled(true);
            return;
        }
        const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [secondsLeft]);

    const handlePress = () => {
        if (!isEnabled) return;
        onResend();
        setSecondsLeft(initialSeconds);
        setIsEnabled(false);
    };

    return (
        <View className='flex-row justify-center items-center mt-8'>
            <FontText
                className='text-center mr-1 text-content-secondary'>
                {/* {t('OTP not received?')} */}
                {t(isEnabled
                    ? 'You can now resend the OTP'
                    : `Resend OTP in`)} {secondsLeft !== 0 && secondsLeft}
            </FontText>
            <TouchableOpacity onPress={handlePress} disabled={!isEnabled}>
                <FontText
                    weight='bold'
                    className={`text-sm ${!isEnabled ? 'text-content-disabled' : 'text-secondary'}`}
                >
                    {t('Resend OTP')}
                </FontText>
            </TouchableOpacity>
        </View>
    )
}

export default ResendTimer;
