import React, { useTransition } from 'react'
import { Pressable, View } from 'react-native'
import { CheckBadgeIcon, CheckIcon } from 'react-native-heroicons/outline'
import { CheckBoxSquareFilledIcon, CheckBoxSquareEmptyIcon } from '@/src/shared/assets/svgs'
import FontText from '@/src/shared/components/FontText'
import { useTranslation } from 'react-i18next'
import { cn } from '@/src/core/utils/cn'
import { PressScaleView } from '@/src/shared/components/wrappers/animated-wrappers'
interface LanguageBtnProps {
    language: string;
    handlePress: () => void;
    isActive: boolean;
    className?: string;
}

const LanguageBtn = ({ language, handlePress, isActive, className }: LanguageBtnProps) => {
    return (
        <PressScaleView onPress={handlePress} scaleValue={0.97}>
            <View className={cn("flex-row items-center justify-between border-b border-stroke-main py-4", className)}>
                <View className="flex-row items-center">
                    <FontText
                        type="body"
                        weight="bold"
                        className="text-content-secondary ml-2 text-base self-start"
                    >
                        {language}
                    </FontText>
                </View>
                {isActive ? <CheckBoxSquareFilledIcon /> : <CheckBoxSquareEmptyIcon />}
            </View>
        </PressScaleView>
    )
}

export default LanguageBtn