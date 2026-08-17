import { View } from "react-native";
import FontText from "@/src/shared/components/FontText";
import { cn } from "@/src/core/utils/cn";

interface Props {
    title: string;
    value: string;
    // Muted second line under the value (e.g. "≈ 248.99 EGP" for virtual-currency links)
    secondaryValue?: string;
    summaryLabel?: boolean;
    className?: string;
}

const SummaryItem = ({ title, value, secondaryValue, className, summaryLabel = false }: Props) => {
    return (
        <View
            className={cn("flex-row justify-between", className)}
        >
            <FontText type="body" weight={summaryLabel ? "semi" : "regular"}
                className="text-content-secondary self-start text-sm">
                {title}
            </FontText>
            <View className="items-end">
                <FontText type="body" weight="semi"
                    className="text-content-primary text-base">
                    {value}
                </FontText>
                {secondaryValue && (
                    <FontText type="body" weight="regular"
                        className="text-content-secondary text-xs">
                        {secondaryValue}
                    </FontText>
                )}
            </View>
        </View>
    )
}

export default SummaryItem;