import { ROUTES } from '@/src/core/navigation/routes';
import { selectAuthInitialize, selectIsAuthenticated, useAuthStore } from '@/src/modules/auth/auth.store';
import { Redirect, Stack, useSegments } from 'expo-router';

export default function AuthLayout() {
    const initializeAuth = useAuthStore(selectAuthInitialize);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const segments = useSegments();
    const currentScreen = segments.length > 0 ? segments[segments.length - 1] : null;

    // if (!initializeAuth) {
    //     return null;
    // }

    if (isAuthenticated && currentScreen !== 'enable-biometric') {
        return <Redirect href={ROUTES.TABS.HOME} />;
    }
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#FFFFFF'
                }
            }}
        />
    );
}
