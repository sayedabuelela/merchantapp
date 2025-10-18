import { useApi } from "@/src/core/api/clients.hooks";
import { Mode } from "@/src/core/environment/environments";
import { selectSetMode, useEnvironmentStore } from "@/src/core/environment/environments.store";
import { useMutation } from "@tanstack/react-query";
import { AuthResponse } from "../auth.model";
import { useAuthStore } from "../auth.store";
import { storeCredentials } from "../biometric/biometric.utils";
import { RegisterData, RegisterDataError } from "./data/register-data.model";
import { signup } from "./data/register-data.service";

const useRegister = () => {
    const { api } = useApi();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setMode = useEnvironmentStore(selectSetMode);
    const {
        mutateAsync,
        isPending: isLoading,
        error,
    } = useMutation<AuthResponse, RegisterDataError, RegisterData>({
        mutationFn: (credentials) => signup(api, credentials),
        onSuccess: async (data, credentials) => {
            const { accessToken: { token } } = data.body;
            const { success, refreshToken, accessToken, ...user } = data.body;
            setMode(data.body.isLive ? Mode.LIVE : Mode.TEST)
            setAuth({ ...user, email: user.signupKey }, token);
            await storeCredentials({ email: user.signupKey, password: credentials.password });
        },
    });

    return {
        register: mutateAsync,
        isLoading,
        error,
    };
}

export default useRegister;

// 1- email 
// 2- otp
// 3- password
// 4- data
// 5- success
// https://api.staging.payformance.io/v2/identity/register?operation=signup
// firstName: "Sayed"
// lastName: "AbuElela"
// mobileNumber: "+201012345678"
// password: "P@ssw0rd"
// signupKey: "hipoway515@firain.com"
// storeName: "store"