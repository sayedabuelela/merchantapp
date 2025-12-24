import FontText from "@/src/shared/components/FontText";
import { Platform, View } from "react-native";
import { cn } from "@/src/core/utils/cn";
import { currencyNumber } from "@/src/core/utils/number-fields";

interface Props {
    title: string;
    value: number | string;
    currency: string;
    mainBalance?: boolean;
}

const BalanceHeaderItem = ({
    title,
    value,
    currency,
    mainBalance = false,
}: Props) => {
    const displayValue = typeof value === 'number' && currency
        ? currencyNumber(value) + ' ' + currency
        : value;

    return (
        <View className="items-center justify-center">
            <FontText
                type="body" weight="regular" className={cn("text-content-secondary uppercase mb-0.5", Platform.OS === 'ios' ? 'text-xs' : 'text-[12px]')}>
                {title}
            </FontText>
            <FontText
                type="head" weight="bold"
                className={cn("text-content-primary uppercase", mainBalance ? "text-xl" : "text-base")}
            >
                {displayValue}
            </FontText>
        </View>
    )
}

export default BalanceHeaderItem