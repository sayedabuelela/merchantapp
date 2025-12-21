import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import * as Updates from 'expo-updates';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import enTranslation from '@/src/shared/localization/locales/en.json';
import arTranslation from '@/src/shared/localization/locales/ar.json';

export const LANGUAGES = {
    ENGLISH: 'en',
    ARABIC: 'ar',
};

const LANGUAGE_STORAGE_KEY = 'lang';
const RTL_STATE_KEY = 'rtl_state';

i18n
    .use(initReactI18next)
    .init({
        lng: LANGUAGES.ENGLISH,
        fallbackLng: LANGUAGES.ENGLISH,
        resources: {
            en: {
                translation: enTranslation,
            },
            ar: {
                translation: arTranslation,
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });


export const getDeviceLanguage = (): string => {
    let deviceLanguage = '';

    try {
        deviceLanguage = Localization.getLocales()[0].languageCode ?? 'en';
    } catch (error) {
        deviceLanguage = 'en';
    }
    return Object.values(LANGUAGES).includes(deviceLanguage) ? deviceLanguage : LANGUAGES.ENGLISH;
};

export const initializeLanguage = async (): Promise<void> => {
    try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        const storedRTLState = await AsyncStorage.getItem(RTL_STATE_KEY);

        let languageToUse;
        if (storedLanguage) {
            languageToUse = storedLanguage;
        } else {
            languageToUse = getDeviceLanguage();
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageToUse);
        }

        // Initialize RTL state if not set (first launch)
        if (storedRTLState === null) {
            const isRTL = languageToUse === LANGUAGES.ARABIC;
            await AsyncStorage.setItem(RTL_STATE_KEY, String(isRTL));
        }

        await changeLanguage(languageToUse);

    } catch (error) {
        console.error('Failed to load language preference:', error);
        await changeLanguage(LANGUAGES.ENGLISH);
    }
};

export const changeLanguage = async (language: string): Promise<void> => {
    try {
        const isRTL = language === LANGUAGES.ARABIC;

        // Set RTL permissions based on target language
        // allowRTL(false) prevents Android system RTL from overriding app layout
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);

        await i18n.changeLanguage(language);

        // Get the stored RTL state to avoid infinite restart loop on Android
        // I18nManager.isRTL may not immediately reflect the new state after restart
        const storedRTLState = await AsyncStorage.getItem(RTL_STATE_KEY);
        const currentStoredRTL = storedRTLState === 'true';

        if (currentStoredRTL !== isRTL) {
            // Save the new RTL state BEFORE restarting
            await AsyncStorage.setItem(RTL_STATE_KEY, String(isRTL));
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);

            await Updates.reloadAsync();
        } else {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        }
    } catch (error) {
        console.error('Failed to change language:', error);
    }
};

export default i18n;
