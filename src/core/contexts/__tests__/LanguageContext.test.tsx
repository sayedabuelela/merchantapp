import React from 'react';
import {useLanguage, LanguageContext} from '../LanguageContext';
import {LANGUAGES} from '@/src/shared/localization/i18n';
import {renderHook} from "@testing-library/react-native";

jest.mock('@/src/shared/localization/i18n', () => ({
    LANGUAGES: {
        ENGLISH: 'en',
        ARABIC: 'ar'
    }
}));

describe('LanguageContext', () => {
    it('has expected default values', () => {
        const {result} = renderHook(() => useLanguage());

        expect(result.current.currentLanguage).toBe(LANGUAGES.ENGLISH);
        expect(result.current.isRTL).toBe(false);
        expect(typeof result.current.changeAppLanguage).toBe('function');
    });

    it('useLanguage hook returns context values', () => {
        const mockContextValue = {
            currentLanguage: 'ar',
            isRTL: true,
            changeAppLanguage: jest.fn(),
        };

        const wrapper = ({children}: { children: React.ReactNode }) => (
            <LanguageContext.Provider value={mockContextValue}>
                {children}
            </LanguageContext.Provider>
        );

        const {result} = renderHook(() => useLanguage(), {wrapper});

        expect(result.current).toBe(mockContextValue);
        expect(result.current.currentLanguage).toBe('ar');
        expect(result.current.isRTL).toBe(true);
        expect(typeof result.current.changeAppLanguage).toBe('function');
    });
});
