import { cn } from "@/src/core/utils/cn";
import { OnboardingArrowIcon } from "@/src/shared/assets/svgs/";
import FontText from "@/src/shared/components/FontText";
import { commonRTLStyles } from "@/src/shared/styles/main";
import { TouchableOpacity, View } from "react-native";

interface AcountTypeItemProps {
    title: string;
    description: string;
    onPress: () => void;
    isLast?: boolean;
    isSelected?: boolean;
}

const AcountTypeItem = ({
    title,
    description,
    onPress,
    isLast,
    isSelected
}: AcountTypeItemProps) => {
    // shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]
    return (
        <TouchableOpacity onPress={onPress}
            className={cn('rounded-md mx-safe-offset-1 p-4 mb-4 flex-row items-center justify-between border', isSelected ? 'border-primary' : 'border-stroke-main')}
        >
            <View className="w-[85%]">
                <FontText type="head" weight="bold" className="text-primary text-xl mb-2 self-start">
                    {title}
                </FontText>
                <FontText type="body" weight="regular" className="text-content-secondary text-sm self-start">
                    {description}
                </FontText>
            </View>
            <OnboardingArrowIcon
                style={commonRTLStyles.rtlRotate}
            />
        </TouchableOpacity>
    )
}

export default AcountTypeItem