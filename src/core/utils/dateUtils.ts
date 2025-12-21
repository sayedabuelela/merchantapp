import * as Localization from "expo-localization";
import { I18nManager } from "react-native";
import { translateTextHandler } from "./helpers";
const isRTL = I18nManager.isRTL;
export const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const createDateObject = (date: Date) => ({
    dateString: formatDateString(date),
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    timestamp: date.getTime()
});

export const formatDateRange = (from: Date | undefined, to: Date | undefined, t: any): string => {
    if (from && to) {
        return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
    }
    if (from) {
        return from.toLocaleDateString();
    }
    return t('Select a date range...');
};


export const formatRelativeDate = (dateInput: Date | string | number, year: boolean = true, isShort: boolean = false): string => {
    // const locale = Localization.getLocales()[0].languageTag || "en-US";
    const locale = isRTL ? "ar-EG" : "en-US";

    const date = new Date(dateInput);
    const today = new Date();

    const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const d = normalize(date);
    const t = normalize(today);

    const diff = (d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0) {
        return isRTL ? "اليوم" : "Today";
    }
    if (diff === 1) {
        return isRTL ? "غدًا" : "Tomorrow";
    }
    if (diff === -1) {
        return isRTL ? "أمس" : "Yesterday";
    }
    const config = {
        day: "numeric",
        month: isShort ? "short" : "long",
        year: year ? "numeric" : undefined,
    }
    return new Intl.DateTimeFormat(locale, config).format(date);
}

export const formatTime = (dateInput: Date | string | number): string => {

    const locale = isRTL ? "ar-EG" : "en-US";

    const date = new Date(dateInput);

    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

export const formatAMPM = (dateInput: string) => {
    const date = new Date(dateInput);
    let hours = date.getHours();
    let minutes: any = date.getMinutes();
    const ampm =
        hours >= 12
            ? translateTextHandler("PM", "م")
            : translateTextHandler("AM", "ص");
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
};

const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"; // 4–20 → always "th"
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
};


export const formatDateByLocale = (date: Date) => {
    const day = date.getDate();
    const suffix = isRTL ? "" : getOrdinalSuffix(day);

    return date.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
        month: "long",
    }) + ` ${day}${suffix}, ${date.getFullYear()}`;
};