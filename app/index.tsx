import { ROUTES } from '@/src/core/navigation/routes';
import { selectIsEnabled, useBiometricStore } from '@/src/modules/auth/biometric/biometric.store';
import { useFirstOnboardingStore, selectHasSeenOnboarding } from '@/src/modules/first-onboarding/first-onboarding.store';
import { Redirect } from 'expo-router';

export default function Index() {
    const hasSeenOnboarding = useFirstOnboardingStore(selectHasSeenOnboarding);
    const isEnabled = useBiometricStore(selectIsEnabled);

    if (!hasSeenOnboarding) {
        return <Redirect href={ROUTES.FIRST_ONBOARDING.ROOT} />;
    }

    return isEnabled ?
        <Redirect href={ROUTES.AUTH.LOGIN_BIOMETRIC} /> :
        <Redirect href={ROUTES.AUTH.LOGIN} />;
}