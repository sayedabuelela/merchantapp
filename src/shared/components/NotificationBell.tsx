import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import { BellAlertIcon } from "react-native-heroicons/outline"
import FontText from "./FontText"

const NotificationBell = ({ notificationsCount }: { notificationsCount: number }) => {
    return (
        <Link href="/notifications" asChild>
            <Pressable className="w-10 items-center justify-center relative ml-auto">
                <BellAlertIcon size={28} color="#001F5F" />
                {notificationsCount > 0 && (
                    <View className="absolute top-0 right-1 w-[18px] h-[18px] rounded-full bg-danger items-center justify-center">
                        <FontText type="body" weight="bold" className="text-[8px] text-white">
                            {notificationsCount}
                        </FontText>
                    </View>
                )}
            </Pressable>
        </Link>
    )
}

export default NotificationBell