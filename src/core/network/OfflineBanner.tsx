import FontText from '@/src/shared/components/FontText'
import { MotiView, AnimatePresence } from 'moti'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WifiIcon } from 'react-native-heroicons/outline'

interface OfflineBannerProps {
    isVisible: boolean
}

const OfflineBanner = ({ isVisible }: OfflineBannerProps) => {
    const { t } = useTranslation()
    const insets = useSafeAreaInsets()

    return (
        <AnimatePresence>
            {isVisible && (
                <MotiView
                    from={{ opacity: 0, translateY: -50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -50 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        paddingTop: insets.top,
                    }}
                >
                    <View className="bg-[#A50017] px-4 py-3 flex-row items-center justify-center gap-2">
                        <WifiIcon size={18} color="#FFFFFF" />
                        <FontText
                            type="body"
                            weight="medium"
                            className="text-white text-sm"
                        >
                            {t('No internet connection')}
                        </FontText>
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    )
}

export default OfflineBanner
