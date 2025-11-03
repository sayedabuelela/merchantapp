import { formatRelativeDate } from '@/src/core/utils/dateUtils'
import FontText from '@/src/shared/components/FontText'
import { View } from 'react-native'

export default function HeaderRow({ title }: { title: string }) {
    return (
        <View className="bg-white pb-2 pt-4">
            <FontText type="head" weight="bold" className="text-content-primary text-xl self-start">
                {formatRelativeDate(title)}
            </FontText>
        </View>
    )
}
