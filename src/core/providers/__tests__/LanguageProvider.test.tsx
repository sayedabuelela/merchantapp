import React, {useState} from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {LanguageContext, useLanguage} from '@/src/core/contexts/LanguageContext';
import {LANGUAGES} from '@/src/shared/localization/i18n';

const TestLanguageProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.ENGLISH);
    const [isRTL, setIsRTL] = useState(false);

    const changeAppLanguage = async (language: string) => {
        setCurrentLanguage(language);
        setIsRTL(language === LANGUAGES.ARABIC);
    };

    return (
        <LanguageContext.Provider value={{currentLanguage, isRTL, changeAppLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
};

jest.mock('@/src/shared/localization/i18n', () => ({
    LANGUAGES: {ENGLISH: 'en', ARABIC: 'ar'}
}));

const TestConsumer = () => {
    const {currentLanguage, isRTL, changeAppLanguage} = useLanguage();
    return (
        <>
            <Text testID="languageInfo">{`${currentLanguage}-${isRTL}`}</Text>
            <Text testID="changeButton" onPress={() => changeAppLanguage(LANGUAGES.ARABIC)}>
                Change
            </Text>
        </>
    );
};

describe('Language Context Integration', () => {
    it('provides values and allows changing language', () => {
        const {getByTestId} = render(
            <TestLanguageProvider>
                <TestConsumer/>
            </TestLanguageProvider>
        );

        expect(getByTestId('languageInfo').props.children).toBe('en-false');

        fireEvent.press(getByTestId('changeButton'));

        expect(getByTestId('languageInfo').props.children).toBe('ar-true');
    });
});
