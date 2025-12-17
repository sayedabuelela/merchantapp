import FontText from '@/src/shared/components/FontText'
import MainHeader from '@/src/shared/components/headers/MainHeader'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
interface ComingSoonViewProps {
    title: string
    icon: React.ReactNode
    description: string
}
const ComingSoonView = ({ title, icon, description }: ComingSoonViewProps) => {
    const { t } = useTranslation()
    return (
        <SafeAreaView className="flex-1 bg-white ">
            <MainHeader title={title} />
            <View className='flex-1 items-center justify-center pb-12 px-6'>
                <View className='w-24 h-24 rounded-full bg-[#F1F6FF] p-1 items-center justify-center mb-6 self-center'>
                    {icon}
                </View>
                <View>
                    <FontText type="head" weight="bold" className="text-content-primary text-xl text-center">
                        {title}
                    </FontText>
                    <View className='bg-[#FFF5F0] border-[#FFD8C4] border px-2 py-1 mt-1'>
                        <FontText type="body" weight="semi" className="text-[#FF9D6C] text-xs uppercase text-center">{t('Coming Soon')}</FontText>
                    </View>
                </View>
                <FontText type="body" weight="regular" className="text-content-secondary text-base my-4 text-center">
                    {description}
                </FontText>
            </View>
        </SafeAreaView>
    )
}

export default ComingSoonView