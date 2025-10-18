import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import FontText from "../FontText";
import { EllipsisVerticalIcon } from "react-native-heroicons/solid";

interface Props {
    title: string;
    withBack?: boolean;
    actionBtn?: boolean;
    onActionBtnPress?: () => void;
}

const MainHeader = ({ title, withBack = true, actionBtn = false, onActionBtnPress }: Props) => {
    const { back } = useRouter();
    return (
        <View className="flex-row items-center justify-between px-6 pb-4 mb-6 border-b border-tertiary">
            <View className="flex-row items-center">
                {withBack && <Pressable onPress={back}>
                    <ChevronLeftIcon size={24} color="#0F172A" />
                </Pressable>}
                <FontText
                    type="head"
                    weight="bold"
                    className="text-content-primary text-2xl ml-4"
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