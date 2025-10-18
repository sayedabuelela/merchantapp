import { cn } from '@/src/core/utils/cn';
import { getFontClass } from '@/src/core/utils/fonts';
import { forwardRef, useEffect, useState } from 'react';
import { I18nManager, Keyboard, Pressable, TextInput, View } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';

interface InputProps {
    onSubmitSearch: (text: string) => void;
    className?: string;
    inputClassName?: string;
    placeholder?: string;
    onClear: () => void;
    value?: string;
}

const isRTL = I18nManager.isRTL;

const SearchInput = forwardRef<TextInput, InputProps>(
    ({ onSubmitSearch, className, inputClassName, placeholder, onClear, value = '', ...props }, ref) => {

        const [localSearchValue, setLocalSearchValue] = useState(value);
        useEffect(() => {
            setLocalSearchValue(value);
        }, [value]);
        const handleSubmit = () => {
            Keyboard.dismiss();
            onSubmitSearch(localSearchValue);
        };
        const handleClear = () => {
            setLocalSearchValue('')
            // onSubmitSearch('')
            onClear()
        }

        return (
            <View
                className={cn(`flex-row items-center w-full px-4 h-11 mt-2 bg-white border border-${localSearchValue === '' ? 'stroke-input' : 'primary'} rounded ${className || ''}`)}
            >
                <Pressable className='mr-1' onPress={handleSubmit}>
                    <MagnifyingGlassIcon size={24} color={localSearchValue === '' ? '#D5D9D9' : '#556767'} />
                </Pressable>
                <TextInput
                    ref={ref}
                    value={localSearchValue}
                    className={cn(`w-full h-full overflow-hidden text-sm leading-[1.35]  text-content-primary text-${isRTL ? 'right' : 'left'} self-start ${getFontClass('body', 'regular')} ${inputClassName || ''}`)}
                    onChangeText={setLocalSearchValue}
                    placeholderTextColor="#B3BBBB"
                    autoCapitalize="none"
                    placeholder={placeholder}
                    accessibilityLabel="Search input"
                    onSubmitEditing={handleSubmit}
                    
                    {...props}
                />
                {localSearchValue !== '' && (
                    <Pressable className='absolute right-4' onPress={handleClear}>
                        <XMarkIcon size={24} color={'#202020'} />
                    </Pressable>
                )}
            </View>
        )
    }
)

export default SearchInput;
