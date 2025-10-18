import FontText from "@/src/shared/components/FontText";
import { StyleSheet, View } from "react-native";
import { ChatBubbleOvalLeftIcon, EnvelopeIcon } from "react-native-heroicons/outline";

type DeliveryStatus = "success" | "failed" | "pending";

interface DeliveryStatusBoxProps {
    delivery_status: DeliveryStatus;
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
        borderColor: "#4AAB4E",
        icon: <EnvelopeIcon size={18} color="#4AAB4E" />,
    },
    failed: {
        textColor: "#A50017",
        bgColor: "#FFEAED",
        borderColor: "#A50017",
        icon: <ChatBubbleOvalLeftIcon size={18} color="#A50017" />,
    },
    pending: {
        textColor: "#B77801",
        bgColor: "#FFF7E8",
        borderColor: "#FBAF1F",
        icon: <ChatBubbleOvalLeftIcon size={18} color="#B77801" />,
    },
};

const DeliveryStatusBox: React.FC<DeliveryStatusBoxProps> = ({ delivery_status }) => {
    const { textColor, bgColor, borderColor, icon } = STATUS_STYLES[delivery_status];

    return (
        <View
            className="flex-row items-center justify-center rounded max-w-20"
            style={[styles.container, { backgroundColor: bgColor, borderColor }]}
        >
            {icon}
            <FontText
                type="body"
                weight="regular"
                className="text-xs ml-1 capitalize"
                style={{ color: textColor }}
            >
                {delivery_status?.replace(/_/g, ' ')}
            </FontText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        padding: 2,
    }
});

export default DeliveryStatusBox;
