import { useRouter } from "expo-router";
import { I18nManager, Platform, Pressable, View } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import FontText from "../FontText";
import { EllipsisVerticalIcon } from "react-native-heroicons/solid";
import { cn } from "@/src/core/utils/cn";
const isRTL = I18nManager.isRTL;
interface Props {
    title: string;
    withBack?: boolean;
    actionBtn?: boolean;
    onActionBtnPress?: () => void;
    className?: string;
}

const MainHeader = ({ title, withBack = true, actionBtn = false, onActionBtnPress, className }: Props) => {
    const { back } = useRouter();
    return (
        <View className={cn("flex-row items-center justify-between px-6 pb-4 mb-6 border-b border-tertiary", Platform.OS === 'android' ? 'pt-4' : 'pt-0', className)}>
            <View className="flex-row items-center">
                {withBack && <Pressable onPress={back}>
                    <ChevronLeftIcon size={24} color="#0F172A" style={isRTL ? { transform: [{ rotate: '180deg' }] } : {}} />
                </Pressable>}
                <FontText
                    type="head"
                    weight="bold"
                    className={cn("text-content-primary text-xl capitalize", withBack && "ml-4")}
                    numberOfLines={1}
                >
                    {title}
                </FontText>
            </View>
            {actionBtn && <Pressable onPress={onActionBtnPress}>
                <EllipsisVerticalIcon size={24} color="#0F172A" />
            </Pressable>}
        </View>
    )
}

export default MainHeader;