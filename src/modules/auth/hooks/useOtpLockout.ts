import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// After 3 wrong codes the backend answers 429 with `remainingSeconds` (cooldown before a new code can be requested)
type OtpLockoutError = { remainingSeconds?: number };

export const getOtpLockoutSeconds = (error: unknown): number => {
    const seconds = (error as OtpLockoutError | null | undefined)?.remainingSeconds;
    return typeof seconds === 'number' && seconds > 0 ? Math.ceil(seconds) : 0;
};

export const isOtpLockoutError = (error: unknown) => getOtpLockoutSeconds(error) > 0;

const formatCountdown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const useOtpLockout = () => {
    const { t } = useTranslation();
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        if (lockedUntil === null) return;

        // Based on an absolute end time so the countdown stays correct after the app is backgrounded
        const tick = () => {
            const left = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
            setSecondsLeft(left);
            if (left === 0) setLockedUntil(null);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [lockedUntil]);

    /** Starts the cooldown if `error` is a lockout. Returns true when it was. */
    const handleOtpError = useCallback((error: unknown) => {
        const seconds = getOtpLockoutSeconds(error);
        if (seconds > 0) {
            setLockedUntil(Date.now() + seconds * 1000);
        }
        return seconds > 0;
    }, []);

    const isLocked = lockedUntil !== null;

    return {
        isLocked,
        handleOtpError,
        lockoutMessage: isLocked
            ? t('Too many wrong codes. Please try again in {{time}}.', { time: formatCountdown(secondsLeft) })
            : '',
    };
};
