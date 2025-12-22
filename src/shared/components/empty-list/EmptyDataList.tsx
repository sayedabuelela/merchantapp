import { cn } from "@/src/core/utils/cn"
import FontText from "@/src/shared/components/FontText"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { PlusIcon, XMarkIcon } from "react-native-heroicons/outline"

type EmptyDataListProps = {
    icon: React.ReactNode
    title: string
    description: string
    buttonLabel?: string
    onButtonPress?: () => void
    buttonVariant?: "primary" | "outline"
    buttonIconType?: "plus" | "xicon",
    containerClassName?: string
}

const EmptyDataList: React.FC<EmptyDataListProps> = ({
    icon,
    title,
    description,
    buttonLabel,
    onButtonPress,
    buttonVariant = "primary",
    buttonIconType,
    containerClassName
}) => {
    return (
        <View className={cn("items-center self-center mt-12", containerClassName)}>
            {icon}
            <View className="items-center mt-6">
                <FontText
                    type="head"
                    weight="bold"
                    className="text-content-primary text-xl mb-2 text-center"
                >
                    {title}
                </FontText>

                <FontText
                    type="body"
                    weight="regular"
                    className="text-content-secondary text-base text-center"
                >
                    {description}
                </FontText>

                {buttonLabel && onButtonPress && (
                    <TouchableOpacity
                        onPress={onButtonPress}
                        className={cn(`flex-row items-center justify-center px-4 py-3 mt-6 rounded `, 
                                    buttonVariant === "primary"
                                ? "bg-primary"
                                : "border border-primary bg-white")}
                    >
                        {buttonIconType === "plus" && <PlusIcon size={24} color="#fff" />}
                        {buttonIconType === "xicon" && <XMarkIcon size={24} color="#001F5F" />}
                        <FontText
                            type="body"
                            weight="semi"
                            className={cn(`text-base ml-2`, buttonVariant === "primary" ? "text-white" : "text-primary")}
                        >
                            {buttonLabel}
                        </FontText>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default EmptyDataList;