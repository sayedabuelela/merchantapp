import { I18nManager } from "react-native";

export type FontType = 'head' | 'body';
export type FontWeight = 'regular' | 'medium' | 'semi' | 'bold';
export type Direction = 'rtl' | 'ltr';


// export const fontsFiles = {
//     'Cairo-Regular': require('@/src/shared/assets/fonts/Cairo-Regular.ttf'),
//     'Cairo-Medium': require('@/src/shared/assets/fonts/Cairo-Medium.ttf'),
//     'Cairo-SemiBold': require('@/src/shared/assets/fonts/Cairo-SemiBold.ttf'),
//     'Cairo-Bold': require('@/src/shared/assets/fonts/Cairo-Bold.ttf'),
//     'Outfit-Medium': require('@/src/shared/assets/fonts/Outfit-Medium.ttf'),
//     'Outfit-Regular': require('@/src/shared/assets/fonts/Outfit-Regular.ttf'),
//     'Outfit-Bold': require('@/src/shared/assets/fonts/Outfit-Bold.ttf'),
//     'Outfit-SemiBold': require('@/src/shared/assets/fonts/Outfit-SemiBold.ttf'),
//     'NotoNaskhArabic-Medium': require('@/src/shared/assets/fonts/NotoNaskhArabic-Medium.ttf'),
//     'NotoNaskhArabic-Regular': require('@/src/shared/assets/fonts/NotoNaskhArabic-Regular.ttf'),
//     'NotoNaskhArabic-Bold': require('@/src/shared/assets/fonts/NotoNaskhArabic-Bold.ttf'),
//     'NotoNaskhArabic-SemiBold': require('@/src/shared/assets/fonts/NotoNaskhArabic-SemiBold.ttf'),
//     'NotoSans-Medium': require('@/src/shared/assets/fonts/NotoSans-Medium.ttf'),
//     'NotoSans-Regular': require('@/src/shared/assets/fonts/NotoSans-Regular.ttf'),
//     'NotoSans-Bold': require('@/src/shared/assets/fonts/NotoSans-Bold.ttf'),
//     'NotoSans-SemiBold': require('@/src/shared/assets/fonts/NotoSans-SemiBold.ttf'),
// } as const;

export const getFontClass = (type: FontType, weight: FontWeight = 'regular'): string => {
    const direction: Direction = I18nManager.isRTL ? 'rtl' : 'ltr';
    return `font-${type}-${weight}-${direction}`;
};
