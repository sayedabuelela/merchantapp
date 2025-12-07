import { formatRelativeDate } from '@/src/core/utils/dateUtils'
import FontText from '@/src/shared/components/FontText'
import { View } from 'react-native'
import { MotiView } from 'moti'

export default function HeaderRow({ title }: { title: string }) {
    return (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
                type: 'timing',
                duration: 300,
            }}
            className="bg-white pb-2 pt-4"
        >
            <FontText type="head" weight="bold" className="text-content-primary text-xl self-start">
                {formatRelativeDate(title)}
            </FontText>
        </MotiView>
    )
}
