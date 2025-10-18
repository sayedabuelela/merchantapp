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

const FontText = ({
    type = 'body',
    weight = 'regular',
    className,
    children,
    ...rest
}: FontTextProps) => {

    return (
        <Text className={cn(getFontClass(type, weight), className)} {...rest}>
            {children}
        </Text>
    );
};

export default FontText;
