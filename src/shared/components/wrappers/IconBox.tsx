import { View } from "react-native";
import { cn } from "@/src/core/utils/cn";

interface IconBoxProps {
    children: React.ReactNode;
    className?: string;
}

const IconBox = ({ children, className }: IconBoxProps) => {
    return (
        <View className={cn("w-[14px] h-[14px] p-0.5 rounded-full items-center justify-center", className)}>
            {children}
        </View>
    )
}
export default IconBox;