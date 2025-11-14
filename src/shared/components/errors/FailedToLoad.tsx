import { useTranslation } from 'react-i18next'
import React from 'react'
import { View, Pressable } from 'react-native'
import FontText from '../FontText'
import { useRouter } from 'expo-router'

const FailedToLoad = ({ refetch, title, message }: { refetch: () => void, title: string, message: string }) => {
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <View className="flex-1 items-center justify-center px-6">
            <FontText weight="medium" className="text-lg text-primary mb-2">
                {title}
            </FontText>
            <FontText weight="regular" className="text-sm text-secondary text-center mb-6">
                {message}
            </FontText>
            <Pressable
                className="bg-primary px-6 py-3 rounded-lg"
                onPress={() => refetch()}
            >
                <FontText weight="medium" className="text-white">
                    {t('Try Again')}
                </FontText>
            </Pressable>
            <Pressable className="mt-4" onPress={() => router.back()}>
                <FontText weight="medium" className="text-primary">
                    {t('Go Back')}
                </FontText>
            </Pressable>
        </View>
    )
}

export default FailedToLoad