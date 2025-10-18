import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import LottieView from "lottie-react-native";
import React, { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
    className?: string;
    titleClasses?: string;
    fontWeight?: 'regular' | 'semi' | 'bold';
}

const Button = forwardRef(({
    title,
    variant = 'primary',
    fontWeight = 'semi',
    size = 'md',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    titleClasses = '',
    ...props
}: ButtonProps, ref: React.Ref<typeof TouchableOpacity>) => {


    const baseClasses = "items-center justify-center rounded";

    const sizeClasses = {
        sm: "py-1.5 px-3",
        md: "px-4",
        lg: "py-4 px-6"
    };

    const variantClasses = {
        // primary: "bg-primary active:bg-[#0040CC] hover:bg-[#002B88]",
        primary: "bg-primary",
        secondary: "bg-gray-600 active:bg-gray-700",
        outline: "bg-transparent border border-primary active:border-primary/70 ",
        danger: "bg-feedback-error-bg border border-stroke-feedback-danger",
    };

    // Text styles
    const textClasses = {
        primary: `text-white `,
        secondary: "text-white ",
        outline: "text-primary",
        danger: "text-feedback-error"
    };

    const fullWidthClasses = fullWidth ? "w-full" : "";
    const stateClasses = (isLoading || disabled) ? "bg-surface-disabled border-0" : "";
    const stateClassesText = (isLoading || disabled) ? "text-content-secondary/40" : "";

    const buttonClasses = cn(`h-[48px]`,baseClasses, sizeClasses[size], (isLoading || disabled) ? stateClasses : variantClasses[variant], className, fullWidthClasses);
    const baseTitleClasses = `${(isLoading || disabled) ? stateClassesText : textClasses[variant]}`;

    return (
        <TouchableOpacity
            ref={ref}
            disabled={disabled || isLoading}
            className={buttonClasses}
            {...props}
        >
            {isLoading ? (
                // <ActivityIndicator color={variant === 'primary' ? '#fff' : '#001F5F'} size="small"/>
                <LottieView
                    source={require("@/src/shared/assets/animations/loader.lottie")}
                    autoPlay
                    loop
                    style={{
                        width: 25,
                        height: 25,
                        marginRight: 4,
                    }}
                />
            ) : (
                <FontText type='body' weight={fontWeight}
                    className={`self-center text-base ${baseTitleClasses} ${titleClasses}`}>
                    {title}
                </FontText>
            )}

        </TouchableOpacity>
    );
});

export default Button;
