import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { View } from "react-native";

const PersonalInfoItem = ({ label, value, className }: { label: string; value: string; className?: string }) => {
    return (
        <View className={cn('gap-y-1 border-b border-stroke-divider pb-2 mb-3', className)}>
            <FontText type="body" weight="semi" className="text-content-primary text-base self-start">
                {label}
            </FontText>
            <FontText type="body" weight="regular" className="text-content-secondary text-base self-start">
                {value}
            </FontText>
        </View>
    );
}

export default PersonalInfoItem;