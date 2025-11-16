import { cn } from "@/src/core/utils/cn";
import { CheckBoxEmptyIcon, CheckBoxFilledIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { TouchableOpacity, View } from "react-native";

interface OptionItemProps {
    title: string;
    description: string;
    isActive: boolean;
    onSelect: (type: string) => void;
}
const activeClass = 'bg-feedback-success-bg border-stroke-success border-[1.5px]';

const PaymentLinkOptionItem = ({ title, description, isActive, onSelect }: OptionItemProps) => {
    return (
        <TouchableOpacity
            onPress={() => { onSelect(title) }}
            className={cn(`w-full flex-row border border-stroke-divider rounded p-4`, isActive ? activeClass : '')}
        >
            {isActive ? <CheckBoxFilledIcon style={{ marginTop: 4 }} /> : <CheckBoxEmptyIcon style={{ marginTop: 4 }} />}
            <View className='ml-2'>
                <FontText
                    type="body"
                    weight="bold"
                    className={cn("text-sm self-start", isActive ? "text-[#1A541D]" : "text-content-primary")}
                >
                    {title}
                </FontText>
                <FontText
                    type="body"
                    weight="regular"
                    className={cn("text-sm self-start", isActive ? "text-[#28712B]" : "text-content-hint")}
                >
                    {description}
                </FontText>
            </View>
        </TouchableOpacity>
    )
}

export default PaymentLinkOptionItem;