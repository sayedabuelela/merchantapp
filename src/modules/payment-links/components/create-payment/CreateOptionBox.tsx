import FontText from "@/src/shared/components/FontText";
import { Pressable, View } from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";

interface Props {
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    hasList?: boolean;
    handleListButton?: () => void;
    listButtonTitle?: string;
}

const CreateOptionBox = ({ title, icon, children, hasList, handleListButton, listButtonTitle }: Props) => {
    return (
        <View className="p-4 border border-tertiary rounded mb-8">
            <View className="flex-row items-center justify-between border-b border-tertiary mb-4 pb-2">
                <View className="flex-row items-center">
                    {icon}
                    <FontText type="head" weight="bold" className="ml-2 text-content-primary text-xl self-start">{title}</FontText>
                </View>
                {hasList && handleListButton && listButtonTitle && (
                    <Pressable
                        onPress={handleListButton}
                        className="flex-row items-center"
                    >
                        <PlusIcon size={24} color="#001F5F" />
                        <FontText type="body" weight="semi" className="text-primary text-base">
                            {listButtonTitle}
                        </FontText>
                    </Pressable>
                )}
            </View>
            {children}
        </View>
    )
}

export default CreateOptionBox;

