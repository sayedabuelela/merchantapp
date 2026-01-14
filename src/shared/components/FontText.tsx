import { cn } from "@/src/core/utils/cn";
import { FontType, FontWeight, getFontClass } from "@/src/core/utils/fonts";
import React, { useMemo } from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { Dimensions, I18nManager } from 'react-native';

interface FontTextProps extends TextProps {
    type?: FontType;
    weight?: FontWeight;
    className?: string;
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
const FONT_SIZE_MAP: Record<string, number> = {
    'text-xxs': 10,
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
    'text-2xl': 24,
    'text-3xl': 30,
    'text-4xl': 36,
};

const getResponsiveScale = (): number => {
    const { width } = Dimensions.get('window');

    if (width <= 380) return 1.0;      // Small phones - no scaling
    if (width <= 400) return 1.05;     // Medium phones - slight scaling
    if (width <= 430) return 1.1;      // iPhone Pro Max - 10% larger
    return 1.125;                       // Extra large devices
};

const RESPONSIVE_SCALE = getResponsiveScale();
const extractAndScaleFontSize = (className?: string): number | undefined => {
    if (!className) return undefined;

    for (const [sizeClass, baseFontSize] of Object.entries(FONT_SIZE_MAP)) {
        const regex = new RegExp(`\\b${sizeClass}\\b`);
        if (regex.test(className)) {
            return Math.round(baseFontSize * RESPONSIVE_SCALE);
        }
    }

    return undefined;
};

// Check if className already has an explicit line height (leading-*)
const hasExplicitLineHeight = (className?: string): boolean => {
    if (!className) return false;
    return /\bleading-\d+\b/.test(className);
};

// RTL Arabic fonts (NotoNaskhArabic) have taller vertical metrics
// Apply a line height multiplier to prevent text clipping
const RTL_LINE_HEIGHT_MULTIPLIER = 1.8;
const FontText = ({
    type = 'body',
    weight = 'regular',
    className,
    children,
    style,
    ...rest
}: FontTextProps) => {
    const scaledFontSize = useMemo(
        () => extractAndScaleFontSize(className),
        [className]
    );

    const mergedStyle = useMemo(() => {
        const styles: TextStyle[] = [];

        if (scaledFontSize) {
            styles.push({ fontSize: scaledFontSize });

            // Apply RTL line height fix if no explicit leading-* class is set
            if (I18nManager.isRTL && !hasExplicitLineHeight(className)) {
                styles.push({ lineHeight: scaledFontSize * RTL_LINE_HEIGHT_MULTIPLIER });
            }
        }

        if (style) {
            styles.push(style as TextStyle);
        }

        return styles.length > 0 ? styles : undefined;
    }, [scaledFontSize, style, className]);
    return (
        <Text
            className={cn(getFontClass(type, weight), className,)}
            style={mergedStyle}
            {...rest}
        >
            {children}
        </Text>
    );
};

export default FontText;
