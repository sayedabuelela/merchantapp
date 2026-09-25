import { TouchableOpacity , View } from "react-native";
import { useEffect, useState } from "react";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";

type ResendTimerProps = {
    initialSeconds?: number;
    onResend: () => void;
    /** While true (OTP lockout cooldown) resending is blocked; it becomes available as soon as it turns false */
    locked?: boolean;
};
const ResendTimer = ({ initialSeconds = 30, onResend, locked = false }: ResendTimerProps) => {
    const { t } = useTranslation();
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (locked) setSecondsLeft(0);
    }, [locked]);

    useEffect(() => {
        if (secondsLeft === 0) {
            setIsEnabled(true);
            return;
        }
        const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [secondsLeft]);

    const canResend = isEnabled && !locked;

    const handlePress = () => {
        if (!canResend) return;
        onResend();
        setSecondsLeft(initialSeconds);
        setIsEnabled(false);
    };

    return (
        <View className='flex-row justify-center items-center mt-8'>
            {!locked && (
                <FontText
                    className='text-center mr-1 text-content-secondary'>
                    {/* {t('OTP not received?')} */}
                    {t(isEnabled
                        ? 'You can now resend the OTP'
                        : `Resend OTP in`)} {secondsLeft !== 0 && secondsLeft}
                </FontText>
            )}
            <TouchableOpacity onPress={handlePress} disabled={!canResend}>
                <FontText
                    weight='bold'
                    className={`text-sm ${!canResend ? 'text-content-disabled' : 'text-secondary'}`}
                >
                    {t('Resend OTP')}
                </FontText>
            </TouchableOpacity>
        </View>
    )
}

export default ResendTimer;
