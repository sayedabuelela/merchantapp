import { I18nManager } from "react-native";
export const translateTextHandler = (en: string, ar: string) => {
    return I18nManager.isRTL ? ar : en;
};