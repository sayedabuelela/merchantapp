import { useAuthStore } from "@/src/modules/auth/auth.store";
import { useBiometricStore } from "@/src/modules/auth/biometric/biometric.store";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { ROUTES } from "../navigation/routes";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const addAuthInterceptor = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.request.use(config => {
        // Skip if Authorization header is already set in this request
        // if (config.headers.Authorization) {
        //     console.log('[Interceptor] Using existing Authorization header for:', config.url);
        //     return config;
        // }

        const state = useAuthStore.getState();
        console.log('state',state);
        
        const token = state.token;
        const user = state.user;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            if (user?.merchantId) {
                config.headers["authmerchantid"] = user.merchantId;
            }
            // config.headers["client-type"] = `merchantApp`
        }
        return config
    })
    return instance
}
export const addErrorInterceptor = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.response.use(
        response => response,
        async (error: AxiosError) => {
            const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

            // Check if error is retryable (timeout or network error)
            const isRetryableError = error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response;

            // Initialize retry count
            config._retryCount = config._retryCount || 0;

            // Retry logic: max 1 retry for timeout/network errors
            if (isRetryableError && config._retryCount < 1) {
                config._retryCount += 1;
                console.log(`Interceptor: Retrying request (attempt ${config._retryCount + 1}/2)...`);

                // Wait 2 seconds before retry
                await delay(2000);

                // Retry the request
                return instance.request(config);
            }

            // Handle timeout errors (after retry)
            if (error.code === 'ECONNABORTED') {
                console.log("Interceptor: Request timeout");
                return Promise.reject({
                    error: 'Request timeout. Please check your internet connection and try again.',
                    message: 'Request timeout. Please check your internet connection and try again.',
                    code: 'TIMEOUT'
                });
            }

            // Handle network errors (after retry)
            if (error.code === 'ERR_NETWORK' || !error.response) {
                console.log("Interceptor: Network error");
                return Promise.reject({
                    error: 'Network error. Please check your internet connection.',
                    message: 'Network error. Please check your internet connection.',
                    code: 'NETWORK_ERROR'
                });
            }

            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('[Interceptor] 401/403 Error:', error.config?.url);
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
                return Promise.reject(error.response?.data);
            }

            console.log("Interceptor: Caught error without response data:", error);
            return Promise.reject(error);
        }
    );
    return instance;
};

