import FontText from "@/src/shared/components/FontText";
import { StyleSheet, View } from "react-native";
import { ChatBubbleOvalLeftIcon, EnvelopeIcon } from "react-native-heroicons/outline";

type DeliveryStatus = "success" | "failed" | "pending" | "delivered";

interface DeliveryStatusBoxProps {
    delivery_status: string;
}

const STATUS_STYLES: Record<
    DeliveryStatus,
    {
        textColor: string;
        bgColor: string;
        borderColor: string;
        icon: React.ReactNode;
    }
> = {
    success: {
        textColor: "#4AAB4E",
        bgColor: "#F3FFF4",
        borderColor: "#D1FFD3",
        icon: <EnvelopeIcon size={14} color="#4AAB4E" />,
    },
    failed: {
        textColor: "#A50017",
        bgColor: "#FFEAED",
        borderColor: "#A50017",
        icon: <ChatBubbleOvalLeftIcon size={14} color="#A50017" />,
    },
    pending: {
        textColor: "#B77801",
        bgColor: "rgba(255, 247, 232, 0.48)",
        borderColor: "#FFE6B6",
        icon: <ChatBubbleOvalLeftIcon size={14} color="#B77801" />,
    },
    delivered: {
        textColor: "#4AAB4E",
        bgColor: "#F3FFF4",
        borderColor: "#D1FFD3",
        icon: <EnvelopeIcon size={14} color="#4AAB4E" />,
    },
};

const DeliveryStatusBox: React.FC<DeliveryStatusBoxProps> = ({ delivery_status }) => {
    const { textColor, bgColor, borderColor, icon } = STATUS_STYLES[delivery_status as DeliveryStatus];

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
