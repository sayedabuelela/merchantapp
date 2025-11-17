import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import FontText from "../FontText";
import { EllipsisVerticalIcon } from "react-native-heroicons/solid";
import { cn } from "@/src/core/utils/cn";

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
        <View className={cn("flex-row items-center justify-between px-6 pb-4 mb-6 border-b border-tertiary", className)}>
            <View className="flex-row items-center">
                {withBack && <Pressable onPress={back}>
                    <ChevronLeftIcon size={24} color="#0F172A" />
                </Pressable>}
                <FontText
                    type="head"
                    weight="bold"
                    className="text-content-primary text-xl ml-4 capitalize"
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