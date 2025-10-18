import { I18nManager } from "react-native";
const isRTL = I18nManager.isRTL;
export const CALENDAR_THEME = {
    textSectionTitleColor: "#001F5F",
    dayTextColor: "#001F5F",
    textDayFontFamily: isRTL ? "NotoNaskhArabic-Bold" : "NotoSans-Bold",
    textDayFontWeight: "700" as const,
    textMonthFontWeight: "700" as const,
    textDisabledColor: "#979797",
    textMonthFontFamily: isRTL ? "Cairo-Bold" : "Outfit-Bold",
    textMonthFontSize: 20,
    textDayHeaderFontFamily: isRTL ? "Cairo-Bold" : "Outfit-Bold",
    textDayHeaderFontSize: 15,
    textSectionTitleDisabledColor: "#001F5F",
    arrowColor: "#254177",
};
export const ARABIC_LOCALE = {
    monthNames: [
        'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيه',
        'يوليه', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'
    ],
    dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};