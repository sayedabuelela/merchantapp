import { ROUTES } from "@/src/core/navigation/routes";
import { useSegments } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useBiometricStore } from "./biometric/biometric.store";
import { useAuthStore } from "./auth.store";

export const useAuthProtection = () => {
    const segments = useSegments();
    const router = useRouter();
    const { isAuthenticated, isAuthInitialized } = useAuthStore();
    const { isEnabled: hasBiometricEnabled } = useBiometricStore();

    const [isManualAuthNavigation, setIsManualAuthNavigation] = useState(false);

    useEffect(() => {
        if (!isAuthInitialized) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inTabsGroup = segments[0] === '(tabs)';

        if (isManualAuthNavigation) {
            setIsManualAuthNavigation(false);
            return;
        }

        if (!isAuthenticated && inTabsGroup) {
            const loginRoute = hasBiometricEnabled
                ? ROUTES.AUTH.LOGIN_BIOMETRIC
                : ROUTES.AUTH.LOGIN;

            router.replace(loginRoute);
        }
        else if (isAuthenticated && inAuthGroup && segments[segments.length - 1] !== 'enable-biometric') {
            const currentScreen = segments[segments.length - 1];

            if (currentScreen === 'login' || currentScreen === 'login-biometric') {
                setIsManualAuthNavigation(true);
                return;
            }

            router.replace(ROUTES.TABS.ROOT);
        }
    }, [isAuthenticated, isAuthInitialized, segments]);
};