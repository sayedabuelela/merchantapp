import { useAuthStore } from "@/src/modules/auth/auth.store";
import { useBiometricStore } from "@/src/modules/auth/biometric/biometric.store";
import { AxiosError, AxiosInstance } from "axios";
import { router } from "expo-router";
import { ROUTES } from "../navigation/routes";

export const addAuthInterceptor = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.request.use(config => {
        const token = useAuthStore.getState().token;
        // console.log('addAuthInterceptor token : ', token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            // config.headers["authmerchantid"] = `${user?.merchantId}`
            // config.headers["client-type"] = `merchantApp`
        }
        return config
    })
    return instance
}
export const addErrorInterceptor = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.response.use(
        response => response,
        (error: AxiosError) => {
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                const clearAuth = useAuthStore.getState().clearAuth;
                clearAuth();
                const hasBiometricEnabled = useBiometricStore.getState().isEnabled;

                if (hasBiometricEnabled) {
                    router.replace(ROUTES.AUTH.LOGIN_BIOMETRIC);
                } else {
                    router.replace(ROUTES.AUTH.LOGIN);
                }
                return Promise.reject(error);
            }

            if (error.response?.data) {
                console.log("Interceptor: Caught other error with data:", error.response.data);
                // const serverErrorMessage = (error.response.data as any)?.error || 'An unexpected error occurred.';
                // const serverErrorStatus = (error.response.data as any)?.success || 'An unexpected error occurred.';
                //
                // const customError: LoginError = {
                //     error: serverErrorMessage,
                //     success: serverErrorStatus,
                // };
                // console.log("Interceptor: Rejecting with custom error:", customError);
                return Promise.reject(error.response?.data);
            }

            console.log("Interceptor: Caught error without response data:", error);
            return Promise.reject(error);
        }
    );
    return instance;
};

