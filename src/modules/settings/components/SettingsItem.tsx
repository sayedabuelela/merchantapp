import { ArrowRightIcon, GlobeAltIcon } from 'react-native-heroicons/outline'
import { Pressable, View, I18nManager } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import React from 'react'
import { cn } from '@/src/core/utils/cn';

interface Props {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    withArrow?: boolean;
    disabled?: boolean;
}

const SettingsItem = ({ title, icon, onPress, withArrow, disabled }: Props) => {
    return (
        <Pressable
            className={cn("flex-row items-center justify-between border-b border-stroke-main py-4")}
            onPress={onPress}
            disabled={disabled}
        >
            <View className="flex-row items-center">
                {icon}
                <FontText
                    type="body"
                    weight="bold"
                    className={cn("text-primary ml-2 text-base self-start ", disabled && "text-[#919C9C]")}
                >
                    {title}
                </FontText>
            </View>
            {withArrow && <ArrowRightIcon size={24} color="#001F5F" style={{ transform: [{ rotate: I18nManager.isRTL ? '180deg' : '0deg' }] }} />}
        </Pressable>
    )
}

export default SettingsItem