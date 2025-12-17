import React from 'react'
import { ArrowUpLeftIcon } from 'react-native-heroicons/outline'
import FontText from '@/src/shared/components/FontText'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import ScaleFadeIn from '@/src/shared/components/wrappers/animated-wrappers/ScaleView'
const TransfersComingSoon = () => {
    const { t } = useTranslation()
    return (
        <ScaleFadeIn delay={100} duration={700}>
            <View className='flex-1 items-center justify-center mt-4'>
                <View className='w-12 h-12 rounded-full bg-[#F1F6FF] p-1 items-center justify-center mb-2 self-center'>
                    <ArrowUpLeftIcon size={32} color="#001F5F" />
                </View>
                <View>
                    <FontText type="body" weight="bold" className="text-content-primary text-base text-center">
                        {t('Transfers')}
                    </FontText>
                    <View className='bg-[#FFF5F0] border-[#FFD8C4] border px-2 py-1 mt-1'>
                        <FontText type="body" weight="semi" className="text-[#FF9D6C] text-[12px] uppercase text-center">{t('Coming Soon')}</FontText>
                    </View>
                </View>
                <FontText type="body" weight="regular" className="text-content-secondary text-xs mt-2 text-center">
                    {t("Soon you'll be able to transfer funds quickly and securely between accounts using the app. Stay tuned!")}
                </FontText>
            </View>
        </ScaleFadeIn>
    )
}

export default TransfersComingSoon