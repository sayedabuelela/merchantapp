import { LANGUAGES } from "@/src/shared/localization/i18n";
import { Route } from "expo-router";

export const ROUTES = {
    // Auth routes
    AUTH: {
        //Login routes
        LOGIN: "/(auth)/(login)/login" as Route,
        LOGIN_BIOMETRIC: "/(auth)/(login)/login-biometric" as Route,
        ENABLE_BIOMETRIC: "/enable-biometric" as Route,
        //Register routes
        REGISTER_EMAIL: "/(auth)/(register)/register-email" as Route,
        REGISTER_OTP: "/(auth)/(register)/register-otp" as Route,
        REGISTER_PASSWORD: "/(auth)/(register)/register-password" as Route,
        REGISTER_DATA: "/(auth)/(register)/register-data" as Route,
        //Password routes
        RESET_OTP: "/(auth)/(reset-password)/reset-otp" as Route,
        RESET_EMAIL: "/(auth)/(reset-password)/reset-email" as Route,
    },
    REGISTER_SUCCESS: "/register-success" as Route,
    PROFILE: {
        PERSONAL_INFO: "/(profile)/personal-info" as Route,
        CHANGE_PASSWORD: "/(profile)/change-password" as Route,
        BUSINESS_PROFILE: "/(profile)/business-profile" as Route,
    },
    SETTINGS: {
        LANGUAGE: "/(settings)/language" as Route,
    },
    // Onboarding routes
    ONBOARDING: {
        ROOT: "/(onboarding)" as Route,
        WELCOME: "/(onboarding)/welcome" as Route,
        STATUS: "/(onboarding)/status" as Route,
        ACCOUNT_TYPE: "/(onboarding)/account-type" as Route,
        BUSINESS: "/(onboarding)/business-details" as Route,
        CONTACT: "/(onboarding)/business-contact" as Route,
        ACTIVATE: "/(onboarding)/activate" as Route,
        DATA: "/(onboarding)/onboarding-data" as Route,
        DOCUMENTS: {
            NATIONAL_ID_FACE: "/(onboarding)/(documents)/national-id-face" as Route,
            NATIONAL_ID_BACK: "/(onboarding)/(documents)/national-id-back" as Route,
            TAX_ID: "/(onboarding)/(documents)/tax-id" as Route,
            COMMERCIAL: "/(onboarding)/(documents)/commercial" as Route,
            UTILITY_BILL: "/(onboarding)/(documents)/utility-bill" as Route,
            OTHERS: "/(onboarding)/(documents)/others-document" as Route,
        },
        CURRENCY_SETTINGS: "/(onboarding)/currency-settings" as Route,
    },
    // Tabs routes
    TABS: {
        ROOT: "/(tabs)" as Route,
        BALANCE: "/(tabs)/balance" as Route,
        DASHBOARD: "/(tabs)/dashboard" as Route,
        TRANSACTIONS: "/(tabs)/transactions" as Route,
        SETTINGS: "/(tabs)/settings" as Route,
    },
    // Payment links routes
    PAYMENT_LINKS: {
        CREATE_NEW_STEP_1: "/payment-links/create-new-step-1" as Route,
        CREATE_NEW_STEP_2: "/payment-links/create-new-step-2" as Route,
        CREATE_SUCCESS: {
            pathname: "/payment-links/create-success" as Route,
            getPath: (paymentLinkId: string) => ({
                pathname: "/payment-links/create-success" as Route,
                params: { paymentLinkId }
            })
        },
        DETAIL: {
            path: "/payment-links/:paymentLinkId" as Route,
            params: {
                paymentLinkId: "",
            },
        },
        LIST: "/payment-links" as Route,
    },
};