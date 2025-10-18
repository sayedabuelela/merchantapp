import {createContext, useContext} from "react";
import {LANGUAGES} from "@/src/shared/localization/i18n";

type LanguageContextType = {
    currentLanguage: string;
    isRTL: boolean;
    changeAppLanguage: (language: string) => Promise<void>;
};

export const LanguageContext = createContext<LanguageContextType>({
    currentLanguage: LANGUAGES.ENGLISH,
    isRTL: false,
    changeAppLanguage: async () => {
    },
});

export const useLanguage = () => useContext(LanguageContext);
