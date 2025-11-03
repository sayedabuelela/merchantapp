import { View } from "react-native";
import FontText from "@/src/shared/components/FontText";
import { cn } from "@/src/core/utils/cn";

interface Props {
    title: string;
    value: string;
    summaryLabel?: boolean;
    className?: string;
}

const SummaryItem = ({ title, value, className, summaryLabel = false }: Props) => {
    return (
        <View
            className={cn("flex-row items-center justify-between", className)}
        >
            <FontText type="body" weight={summaryLabel ? "semi" : "regular"}
                className="text-content-secondary self-start text-sm">
                {title}
            </FontText>
            <FontText type="body" weight="semi"
                className="text-content-primary self-start text-base">
                {value}
            </FontText>
        </View>
    )
}

export default SummaryItem;