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
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    error?: boolean;
    isPassword?: boolean;
    isHasCurrency?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
    ({ value, onChangeText, label, labelClassName, className, inputClassName, error, isPassword, isHasCurrency, onBlur, ...props }, ref) => {
        const [show, setShow] = React.useState(isPassword ?? false);
        const borderColorClass = error
            ? "border-2 border-stroke-danger" : "border-stroke-input"

        return (
            <>
                {label && <FontText
                    type="body"
                    weight='semi'
                    className={cn(COMMON_STYLES.label, labelClassName)}>
                    {label}
                </FontText>}
                <View
                    className={cn(`px-4 h-11 bg-white border rounded ${borderColorClass} ${className || ''} ${isPassword || isHasCurrency ? 'items-center flex-row ' : 'pr-4'}`)}
                >
                    <TextInput
                        ref={ref}
                        value={value}
                        className={cn(`flex-1 h-full overflow-hidden text-base leading-[1.35]  text-content-primary text-${isRTL ? 'right' : 'left'} self-start ${getFontClass('body', 'regular')} ${inputClassName || ''}`)}
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
