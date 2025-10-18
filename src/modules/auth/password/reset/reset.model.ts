export interface ResetPasswordRequest {
    code: string;
    password: string;
}
export interface ResetPasswordResponse {
    code: string;
    password: string;
}
    
export interface ResetPasswordError {
    message: string;
    error: string;
}
    