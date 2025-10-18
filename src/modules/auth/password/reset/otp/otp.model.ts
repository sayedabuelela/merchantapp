export type GenerateOtpResponse = {
    body: {
        success: boolean;
        message?: string;
        error?: string;
    }
}
export type GenerateOtpError = {
    success: boolean;
    message?: string;
    error?: string;
}

export type VerifyCodeRequest = {
    key: string;
    code: string;
}

export type VerifyCodeResponse = {
    body: {
        success: boolean;
        message: string;
    }
}
export type VerifyCodeError = {
    success: boolean;
    message?: string;
    error?: string;
}