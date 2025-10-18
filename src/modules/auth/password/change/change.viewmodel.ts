import { useApi } from "@/src/core/api/clients.hooks";
import { selectClearAuth, useAuthStore } from "@/src/modules/auth/auth.store";
import { selectSetEnabled, selectSetInitialized, useBiometricStore } from "@/src/modules/auth/biometric/biometric.store";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordRequest } from "./change.model";
import { changePasswordService } from "./change.service";

export const useChangePasswordViewModel = () => {

    const { api } = useApi();
    const clearAuth = useAuthStore(selectClearAuth);
    const setEnabled = useBiometricStore(selectSetEnabled);
    const setInitialized = useBiometricStore(selectSetInitialized);
    const { mutateAsync, isPending: isLoading, error } = useMutation({
        mutationFn: (data: ChangePasswordRequest) => changePasswordService(api, data),
        onSuccess: () => {
            clearAuth();
            setEnabled(false);
            setInitialized(false);
        }
    })

    return {
        changePassword: mutateAsync,
        isLoading,
        error
    }
}