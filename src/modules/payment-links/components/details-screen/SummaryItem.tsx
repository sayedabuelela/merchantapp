import { View } from "react-native";
import FontText from "@/src/shared/components/FontText";

interface Props {
    title: string;
    value: string;
    summaryLabel?: boolean;
}

const SummaryItem = ({ title, value, summaryLabel = false }: Props) => {
    return (
        <View
            className="flex-row items-center justify-between"
        >
            <FontText type="body" weight={summaryLabel ? "semi" : "regular"}
                className="text-content-secondary self-start text-sm">
                {title}
            </FontText>
            <FontText type="body" weight="bold"
                className="text-content-primary self-start text-sm">
                {value}
            </FontText>
        </View>
    )
}

export default SummaryItem;