import { useApi } from "@/src/core/api/clients.hooks";
import { ResetPasswordRequest, ResetPasswordResponse, ResetPasswordError } from "./reset.model";
import { useMutation } from "@tanstack/react-query";
import { resetService } from "./reset.service";

export const useResetPassword = () => {
    const { api } = useApi();

    const { mutateAsync: resetPassword, isPending: isResetting, error: resetError } = useMutation<ResetPasswordResponse, ResetPasswordError, ResetPasswordRequest>({
        mutationFn: (request) => resetService(api, request),
    });

    return {
        resetPassword,
        isResetting,
        resetError
    }
}
