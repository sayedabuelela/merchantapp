import { getFontClass } from "@/src/core/utils/fonts";
import { I18nManager, StyleSheet } from "react-native";

const isRTL = I18nManager.isRTL;


export const COMMON_STYLES = {
    common: 'bg-red-900 flex-1',
    button: 'bg-blue-500 text-white p-2',
    label: `text-content-primary text-base leading-tight mb-2 self-start`,
    inputBox: `w-full px-4 py-3 bg-white border rounded`,
    input: `w-full flex-1 text-${isRTL ? 'right' : 'left'} self-start ${getFontClass('body', 'regular')}`,
    errorMsg: `self-start text-danger text-sm`,
    successMsg: `self-start text-success text-sm`,
    infoMsg: `self-start text-primary text-xs`,
    textWrap: `flex-1 flex-wrap`,
    mainCardClass: `border-[1.5px] rounded border-tertiary p-4`,
} as const;

export const commonRTLStyles = StyleSheet.create({
    rtlRotate: { transform: [{ rotateY: isRTL ? "180deg" : "0deg" }] },
})

