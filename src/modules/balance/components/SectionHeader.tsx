import { View, Pressable, I18nManager } from "react-native"
import FontText from "@/src/shared/components/FontText"
import { ArrowRightIcon } from "react-native-heroicons/outline"
import { Link, Route } from "expo-router"

interface SectionHeaderProps {
    title: string
    nextRouteTitle: string
    nextRoute?: Route
    onPressNextRoute?: () => void
}

const SectionHeader = ({ title, nextRouteTitle, nextRoute, onPressNextRoute }: SectionHeaderProps) => {
    const arrowIcon = (
        <ArrowRightIcon 
            size={16} 
            color="#001F5F" 
            style={{ transform: [{ rotate: I18nManager.isRTL ? '180deg' : '0deg' }] }} 
        />
    )

    const innerContent = (
        <>
            <FontText type="body" weight="regular" className="text-xs text-primary mr-2">
                {nextRouteTitle}
            </FontText>
            {arrowIcon}
        </>
    )

    const content = onPressNextRoute ? (
        <Pressable className="flex-row items-center" onPress={onPressNextRoute}>
            {innerContent}
        </Pressable>
    ) : nextRoute ? (
        <Link href={nextRoute} asChild>
            <Pressable className="flex-row items-center">
                {innerContent}
            </Pressable>
        </Link>
    ) : null

    return (
        <View className="flex-row items-center justify-between mb-4">
            <FontText type="head" weight="bold" className="text-xl text-content-primary">
                {title}
            </FontText>
            {content}
        </View>
    )
}

export default SectionHeader
