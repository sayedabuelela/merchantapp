import { cn } from "@/src/core/utils/cn";
import { FontType, FontWeight, getFontClass } from "@/src/core/utils/fonts";
import React from 'react';
import { Text, TextProps } from 'react-native';


interface FontTextProps extends TextProps {
    type?: FontType;
    weight?: FontWeight;
    className?: string;
    children: React.ReactNode;
}

// Tailwind font size mapping (in points)
// const FONT_SIZE_MAP: Record<string, number> = {
//     'text-xs': 12,
//     'text-sm': 14,
//     'text-base': 16,
//     'text-lg': 18,
//     'text-xl': 20,
//     'text-2xl': 24,
//     'text-3xl': 30,
//     'text-4xl': 36,
//     'text-5xl': 48,
//     'text-6xl': 60,
//     'text-xxs': 10,
// };

// /**
//  * Extracts font size class from className string
//  */
// const extractFontSizeFromClassName = (className?: string): number | null => {
//     if (!className) return null;

//     // Check for font size classes in className
//     for (const [sizeClass, fontSize] of Object.entries(FONT_SIZE_MAP)) {
//         // Match whole word to avoid matching "text-xs" in "text-xs-something"
//         const regex = new RegExp(`\\b${sizeClass}\\b`);
//         if (regex.test(className)) {
//             return fontSize;
//         }
//     }

//     return null;
// };

const FontText = ({
    type = 'body',
    weight = 'regular',
    className,
    children,
    ...rest
}: FontTextProps) => {
    // Extract and scale fontSize from className
    // const scaledFontSize = useMemo(() => {
    //     const baseFontSize = extractFontSizeFromClassName(className);
    //     if (baseFontSize) {
    //         return normalizeFontSize(baseFontSize);
    //     }
    //     return undefined;
    // }, [className]);

    // // Apply scaled fontSize via style prop (overrides className fontSize)
    // const textStyle = scaledFontSize
    //     ? { fontSize: scaledFontSize }
    //     : undefined;
    return (
        <Text
            className={cn(getFontClass(type, weight), className)}
            {...rest}>
            {children}
        </Text>
    );
};

export default FontText;
