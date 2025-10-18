import { useApi } from "@/src/core/api/clients.hooks";
import { useMutation } from "@tanstack/react-query";
import { GenerateOtpError, GenerateOtpResponse, VerifyCodeError, VerifyCodeRequest, VerifyCodeResponse } from "./otp.model";
import { getResetOtp, verifyResetCode } from "./otp.service";

export const useResetPasswordOtp = () => {
    const { api } = useApi();

    const { mutateAsync: generateResetOtp, isPending: isGenerating, error } = useMutation<GenerateOtpResponse, GenerateOtpError, string>({
        mutationFn: (key: string) => getResetOtp(api, key),
    });

    const { mutateAsync: verifyResetOtp, isPending: isVerifying, error: verifyError, reset: verifyReset } = useMutation<VerifyCodeResponse, VerifyCodeError, VerifyCodeRequest>({
        mutationFn: ({ key, code }: { key: string, code: string }) => verifyResetCode(api, { key, code }),
    });

    return {
        generateResetOtp,
        isGenerating,
        error,
        verifyResetOtp,
        isVerifying,
        verifyError,
        verifyReset
    }
}
