import { View } from "react-native"
import FontText from "@/src/shared/components/FontText"
import { Pressable } from "react-native"
import { ArrowRightIcon } from "react-native-heroicons/outline"
import { Link, Route } from "expo-router"

const SectionHeader = ({ title, nextRouteTitle, nextRoute, onPressPayouts }: { title: string, nextRouteTitle: string, nextRoute: Route, onPressPayouts?: () => void }) => {
    return (
        <View className="flex-row items-center justify-between mb-4">
            <FontText type="head" weight="bold" className="text-xl text-content-primary">
                {title}
            </FontText>
            <Link href={nextRoute} asChild>
                <Pressable className="flex-row items-center "
                // onPress={onPressPayouts}
                >
                    <FontText type="body" weight="regular" className="text-xs text-primary mr-2">
                        {nextRouteTitle}
                    </FontText>
                    <ArrowRightIcon size={16} color="#001F5F" />
                </Pressable>
            </Link>
        </View>
    )
}

export default SectionHeader