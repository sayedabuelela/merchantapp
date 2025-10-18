import { CheckBoxEmptyIcon, CheckBoxFilledIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { TouchableOpacity, View } from "react-native";

interface OptionItemProps {
    title: string;
    description: string;
    isActive: boolean;
    onSelect: (type: string) => void;
}
const activeClass = 'bg-feedback-success-bg border-stroke-success border-2';

const PaymentLinkOptionItem = ({ title, description, isActive, onSelect }: OptionItemProps) => {
    return (
        <TouchableOpacity
            onPress={() => { onSelect(title) }}
            className={`w-full flex-row border border-stroke-divider rounded-[4px] p-4 ${isActive ? activeClass : ''}`}
        >
            {isActive ? <CheckBoxFilledIcon style={{ marginTop: 4 }} /> : <CheckBoxEmptyIcon style={{ marginTop: 4 }} />}
            <View className='ml-2'>
                <FontText
                    type="body"
                    weight="bold"
                    className="text-content-primary text-sm self-start"
                >
                    {title}
                </FontText>
                <FontText
                    type="body"
                    weight="regular"
                    className="text-content-hint text-sm self-start"
                >
                    {description}
                </FontText>
            </View>
        </TouchableOpacity>
    )
}

export default PaymentLinkOptionItem;