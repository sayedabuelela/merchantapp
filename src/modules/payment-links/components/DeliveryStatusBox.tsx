import FontText from "@/src/shared/components/FontText";
import { View } from "react-native";
import { ChatBubbleOvalLeftIcon, EnvelopeIcon } from "react-native-heroicons/outline";

type DeliveryStatus = "success" | "failed" | "pending" | "delivered";
type DeliveryType = "email" | "sms";

interface DeliveryStatusBoxProps {
    delivery_status: string;
    type: DeliveryType;
}

const STATUS_STYLES: Record<
    DeliveryStatus,
    {
        textColor: string;
        bgColor: string;
        borderColor: string;
    }
> = {
    success: {
        textColor: "#4AAB4E",
        bgColor: "#F3FFF4",
        borderColor: "#D1FFD3",
    },
    failed: {
        textColor: "#A50017",
        bgColor: "#FFEAED",
        borderColor: "#A50017",
    },
    pending: {
        textColor: "#B77801",
        bgColor: "rgba(255, 247, 232, 0.48)",
        borderColor: "#FFE6B6",
    },
    delivered: {
        textColor: "#4AAB4E",
        bgColor: "#F3FFF4",
        borderColor: "#D1FFD3",
    },
};

const getIcon = (type: DeliveryType, color: string) => {
    if (type === "email") {
        return <EnvelopeIcon size={14} color={color} />;
    }
    return <ChatBubbleOvalLeftIcon size={14} color={color} />;
};

const DeliveryStatusBox: React.FC<DeliveryStatusBoxProps> = ({ delivery_status, type }) => {
    const { textColor, bgColor, borderColor } = STATUS_STYLES[delivery_status as DeliveryStatus];
    const icon = getIcon(type, textColor);

    return (
        <View
            className="flex-row items-center justify-center rounded-sm max-w-20 border-[0.5px] px-1 py-[2px]"
            style={{ backgroundColor: bgColor, borderColor }}
        >
            {icon}
            <FontText
                type="body"
                weight="regular"
                className="text-[10px] ml-[2px] uppercase"
                style={{ color: textColor }}
            >
                {delivery_status?.replace(/_/g, ' ')}
            </FontText>
        </View>
    );
};

export default DeliveryStatusBox;
