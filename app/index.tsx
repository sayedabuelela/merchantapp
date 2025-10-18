import { ROUTES } from '@/src/core/navigation/routes';
import { selectIsEnabled, useBiometricStore } from '@/src/modules/auth/biometric/biometric.store';
import { Redirect } from 'expo-router';

export default function Index() {
    const isEnabled = useBiometricStore(selectIsEnabled);
    return isEnabled ?
        <Redirect href={ROUTES.AUTH.LOGIN_BIOMETRIC} /> :
        <Redirect href={ROUTES.AUTH.LOGIN} />;
}