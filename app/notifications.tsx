import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import FontText from '@/src/shared/components/FontText'

const notifications = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View>
                <FontText type="head" weight="bold" className="text-2xl">Notifications</FontText>
            </View>
        </SafeAreaView>
    )
}

export default notifications