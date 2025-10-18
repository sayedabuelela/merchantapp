import { useApi } from "@/src/core/api/clients.hooks";
import { useMutation } from "@tanstack/react-query";
import { getOtp, verifyCode } from "./otp.service";
import { GenerateOtpError, GenerateOtpResponse, VerifyCodeError, VerifyCodeRequest, VerifyCodeResponse } from "./otp.model";

const useRegisterOtp = () => {
    const { api } = useApi();

    const { mutateAsync: generateOtp, isPending: isGenerating, error } = useMutation<GenerateOtpResponse, GenerateOtpError, string>({
        mutationFn: (key: string) => getOtp(api, key),
    });

    const { mutateAsync: verifyOtp, isPending: isVerifying, error: verifyError, reset: verifyReset } = useMutation<VerifyCodeResponse, VerifyCodeError, VerifyCodeRequest>({
        mutationFn: ({ key, code }: { key: string, code: string }) => verifyCode(api, { key, code }),
    });

    return {
        generateOtp,
        isGenerating,
        error,
        verifyOtp,
        isVerifying,
        verifyError,
        verifyReset
    }
}

export default useRegisterOtp;