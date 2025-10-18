import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import i18n, {changeLanguage, initializeLanguage, LANGUAGES} from '@/src/shared/localization/i18n';
import {I18nManager} from 'react-native';
import {LanguageContext} from '@/src/core/contexts/LanguageContext';

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>(LANGUAGES.ENGLISH);
    const [isRTL, setIsRTL] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const initializationAttempted = useRef<boolean>(false);

    useEffect(() => {
        const bootstrap = async () => {
            // Only initialize if we haven't already did
            if (!initializationAttempted.current) {
                initializationAttempted.current = true;
                await initializeLanguage();
                setCurrentLanguage(i18n.language);
                setIsRTL(i18n.language === LANGUAGES.ARABIC);
                setIsInitialized(true);
            }
        };

        bootstrap();
    }, []);

    const changeAppLanguage = useCallback(async (language: string) => {
        await changeLanguage(language);
        setCurrentLanguage(language);
        setIsRTL(language === LANGUAGES.ARABIC);
        I18nManager.forceRTL(language === LANGUAGES.ARABIC);
    }, []);

    const contextValue = useMemo(() => ({
        currentLanguage,
        isRTL,
        changeAppLanguage
    }), [currentLanguage, isRTL, changeAppLanguage]);

    if (!isInitialized) {
        return null;
    }

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export default React.memo(LanguageProvider);
