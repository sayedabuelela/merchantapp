import { useApi } from "@/src/core/api/clients.hooks";
import { ROUTES } from "@/src/core/navigation/routes";
import { selectClearAuth, selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { selectSetEnabled, selectSetInitialized, useBiometricStore } from "@/src/modules/auth/biometric/biometric.store";
import { clearCredentials } from "@/src/modules/auth/biometric/biometric.utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import usePermissions from "../auth/hooks/usePermissions";
import { logoutDevice } from "./settings.service";

const useSettings = () => {
    const { api } = useApi();
    const clearAuth = useAuthStore(selectClearAuth);
    const router = useRouter();
    const setInitialized = useBiometricStore(selectSetInitialized);
    const setEnabled = useBiometricStore(selectSetEnabled);

    const user = useAuthStore(selectUser);
    const { canViewBusinessProfile } = usePermissions(user?.actions!, user?.merchantId);

    const { mutateAsync: logoutMutation } = useMutation({
        mutationFn: () => logoutDevice(api),
    });

    const logout = async () => {
        try {
            await logoutMutation();
        } catch {
            // Continue with local logout even if API call fails
        }
        await clearCredentials();
        clearAuth();
        setInitialized(false);
        setEnabled(false);
        router.replace(ROUTES.AUTH.LOGIN);
    }

    const goToChangePassword = () => {
        router.push(ROUTES.PROFILE.CHANGE_PASSWORD);
    }

    const goToLanguage = () => {
        router.push(ROUTES.SETTINGS.LANGUAGE);
    }

    const goToBusinessProfile = () => {
        router.push(ROUTES.ONBOARDING.DATA);
    }

    const goToPersonalInfo = useCallback(() => {
        router.push(ROUTES.PROFILE.PERSONAL_INFO);
    }, []);
    const goToOnboardingStatus = useCallback(() => {
        router.push(ROUTES.ONBOARDING.STATUS);
    }, []);
    return {
        logout,
        goToChangePassword,
        goToLanguage,
        goToBusinessProfile,
        goToPersonalInfo,
        goToOnboardingStatus,
        canViewBusinessProfile,
    }
}

export default useSettings
