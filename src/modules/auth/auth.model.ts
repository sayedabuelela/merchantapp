import { LoginFormData } from "@/src/modules/auth/login/login.model";
import { z } from "zod";
import { passwordSchema } from "./auth.scheme";

export type PasswordFormData = z.infer<typeof passwordSchema>;

export interface AccessToken {
    token: string;
    expires: string;
}

export interface RefreshToken {
    token: string;
    expires: string;
}


export interface BNPLSettlementTypes {
    [method: string]: string;
}

export interface OperationConfig {
    downPayment: boolean;
}

export interface Operations {
    [provider: string]: OperationConfig;
}

export interface AllowedPaymentMethods {
    acceptedPaymentMethods: string[];
    acceptedBNPLMethods: string[];
    acceptedCardProviders: string[];
    acceptedWalletProviders: string[];
    bnplSettlementTypes: BNPLSettlementTypes;
    operations: Operations;
    sparkitEnabled: boolean;
    terminalCredentials: Record<string, unknown>;
    transfersEnabled: boolean;
    transfersProviders: string[];
}

export interface BelongsTo {
    merchantId: string;
    storeName: string;
    businessLogoUrl: string;
    businessLogo?: string;
}

export interface DefaultCurrency {
    live: string;
    test: string;
}

export interface Settings {
    defaultDashboardDateRange: string;
    defaultCurrency: DefaultCurrency;
}

export interface IActionPermissions {
    [action: string]: boolean;
}

export interface IActionGroup {
    [group: string]: IActionPermissions;
}

export interface IActions {
    [module: string]: IActionGroup;
}

export interface Role {
    roleName: string;
    _id: string;
}

export interface Device {
    fcmToken: string;
    huawei: boolean;
    language: string;
}

export interface SecretKeys {
    test: SecretKeyDetails;
    live: SecretKeyDetails;
}

export interface SecretKeyDetails {
    secretKey: string;
    accessToken: string;
    isActive: boolean;
}

export interface BelongsToMerchant {
    // Record<string, BelongsToMerchantStore>;
}

export interface BelongsToMerchantStore {
    addedBy: string;
    creationDate: string; // ISO date string
    roles: Role[];
    userStatus: 'active' | 'inactive' | string;
    isLive: boolean;
    devices: Record<string, Device>;
    isEnabledAuthNCap: boolean;
    webhook: string | null;
    accountType: 'PF' | 'PM' | string;
    secretKeys: SecretKeys;
    storeName: string;
}
export interface User {
    _id: string;
    userType: string;
    email: string;
    merchantId: string;
    actions: IActions;
    belongsTo: BelongsTo[];
    language: string;
    isLive: boolean;
    fullName: string;
    userName?: string;
    settings: Settings;
    currencies: string[];
    currenciesTest: string[];
    allowedPaymentMethods: AllowedPaymentMethods;
    hasAccounts: boolean;
    enabledFeatures: string[];
    belongsToMerchants: Record<string, BelongsToMerchantStore>;
    mobileNumber: string;
    signupKey: string;
    countryCode: string;
    countLoginAttemps: number;
    notifications: string[];
    // [key: string]: any;
}

export interface FCMData {
    deviceId: string;
    fcmToken: string;
    huawei: boolean;
}

type AuthResponseBody = User & {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    success: boolean;
};
export interface AuthResponse {
    body: AuthResponseBody;
    twoFactorAuth?: boolean;
    message?: string;
}

export interface GetMerchantResponse {
    body: User;
}


export interface AuthState {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
    token: string | null;

    // Actions
    setAuth: (user: User, token: string, credentials?: LoginFormData) => void;
    clearAuth: () => void;
    initializeAuth: () => Promise<void>;
}
