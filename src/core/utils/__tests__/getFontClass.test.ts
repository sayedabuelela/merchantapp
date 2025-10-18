import * as ReactNative from 'react-native';
import {getFontClass} from "@/src/core/utils/fonts";

describe('Font utilities', () => {
    let originalIsRTL: boolean;

    beforeEach(() => {
        originalIsRTL = ReactNative.I18nManager.isRTL;
    });

    afterEach(() => {
        ReactNative.I18nManager.isRTL = originalIsRTL;
    });

    it('returns the correct font class for LTR direction', () => {
        ReactNative.I18nManager.isRTL = false;
        expect(getFontClass('head', 'regular')).toBe('font-head-regular-ltr');
        expect(getFontClass('body', 'bold')).toBe('font-body-bold-ltr');
    });

    it('returns the correct font class for RTL direction', () => {
        ReactNative.I18nManager.isRTL = true;
        expect(getFontClass('head', 'regular')).toBe('font-head-regular-rtl');
        expect(getFontClass('body', 'bold')).toBe('font-body-bold-rtl');
    });
});
