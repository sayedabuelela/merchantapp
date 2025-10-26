import * as SecureStore from 'expo-secure-store';
import { LoginFormData } from "@/src/modules/auth/login/login.model";

const CREDENTIALS_KEY = 'biometric_credentials';


export const storeCredentials = async (credentials: LoginFormData): Promise<void> => {
    await SecureStore.setItemAsync(
        CREDENTIALS_KEY,
        JSON.stringify(credentials)
    );
}

export const getCredentials = async (): Promise<LoginFormData & { biometricEnabled?: boolean } | null> => {
    const storedCredentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    return storedCredentials ? JSON.parse(storedCredentials) : null;
}

export const clearCredentials = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
}


