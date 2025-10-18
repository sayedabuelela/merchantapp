import { ActivateSuccess, OnboardingArrowIcon, UnactiveIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { commonRTLStyles } from "@/src/shared/styles/main";
import { TouchableOpacity, View } from "react-native";

interface OnboardingStatusItemProps {
    title: string;
    onPress: () => void;
    status?: boolean;
    isLast?: boolean;
}

const OnboardingStatusItem = ({ title, onPress, status, isLast }: OnboardingStatusItemProps) => {
    return (
        <TouchableOpacity
            className={`flex-row items-center justify-between border-b border-stroke-divider py-4 ${isLast ? 'border-b-0' : ''}`}
            onPress={onPress}>
            <View className="flex-row items-center">
                {status ? <ActivateSuccess /> : <UnactiveIcon />}
                <FontText type="body" weight="regular" className="text-primary text-base self-start ml-2">{title}</FontText>
            </View>
            <OnboardingArrowIcon style={commonRTLStyles.rtlRotate} />
        </TouchableOpacity>
    )
}

export default OnboardingStatusItem;   