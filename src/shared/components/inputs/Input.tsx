import { cn } from "@/src/core/utils/cn";
import { getFontClass } from "@/src/core/utils/fonts";
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { I18nManager, NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps, TouchableOpacity, View } from 'react-native';
import { COMMON_STYLES } from '../../styles/main';
import FontText from '../FontText';
import CurrencyDropDown from "../dropdown/CurrencyDropDown";

const isRTL = I18nManager.isRTL;

interface InputProps extends Omit<TextInputProps, "ref"> {
    value?: string;
    label?: string;
    labelClassName?: string;
    onChangeText: (text: string) => void;
    className?: string;
    inputClassName?: string;
    error?: boolean;
    isPassword?: boolean;
    isHasCurrency?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
    ({ value, onChangeText, label, labelClassName, className, inputClassName, error, isPassword, isHasCurrency, onBlur, ...props }, ref) => {
        const [show, setShow] = React.useState(isPassword ?? false);
        const borderColorClass = error
            ? "border-stroke-danger" : "border-stroke-input"

        return (
            <>
                {label && <FontText
                    type="body"
                    weight='semi'
                    className={cn(COMMON_STYLES.label, labelClassName)}>
                    {label}
                </FontText>}
                <View
                    // Lighter trailing padding when a currency trigger sits in the row:
                    // the trigger brings its own inline-start padding, so a full 16px
                    // at the end is dead space the amount field could have used.
                    className={cn(`h-11 bg-white border rounded ${isHasCurrency ? 'ps-4 pe-2' : 'px-4'} ${borderColorClass} ${className || ''} ${isPassword || isHasCurrency ? 'items-center flex-row ' : 'pr-4'}`)}
                >
                    <TextInput
                        ref={ref}
                        value={value}
                        // flex-1 + min-w-0, never w-full: a 100% basis makes the field
                        // claim the whole row, leaving the currency trigger as the only
                        // thing that can give way — which is what squeezed it to nothing.
                        className={cn('flex-1 min-w-0 h-full text-base text-content-primary', `text-${isRTL ? 'right' : 'left'}`, getFontClass('body', 'regular'), isRTL ? 'leading-[1.8] ' : 'leading-[1.35]', inputClassName || '')}
                        onChangeText={onChangeText}
                        placeholderTextColor="#B3BBBB"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onBlur={(e) => {
                            onBlur?.(e);
                        }}
                        secureTextEntry={show}
                        {...props}
                    />
                    {isHasCurrency && (
                        <CurrencyDropDown name="currency" />
                    )}
                    {isPassword && (
                        <TouchableOpacity onPress={() => setShow((v) => !v)} >
                            <Ionicons
                                name={show ? 'eye' : 'eye-off'}
                                size={20}
                                color="#001F5F"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </>
        )
    }
);

Input.displayName = "Input";
export default Input;
