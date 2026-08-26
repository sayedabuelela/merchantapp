import { currencyLabel, currencyShortLabel } from "@/src/core/constants/currencies";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";
import { cn } from "@/src/core/utils/cn";
import { currencyNumber } from "@/src/core/utils/number-fields";
import VirtualBadge from "@/src/shared/components/currency/VirtualBadge";

interface Props {
    title: string;
    value: number | string;
    currency: string;
    /** Marks the figure as priced in a virtual currency — adds the "Virtual" pill. */
    isVirtual?: boolean;
    /** Abbreviate the currency where it has an abbreviation — see `shortCurrency` on BalanceStatsCard. */
    shortCurrency?: boolean;
    mainBalance?: boolean;
}

const BalanceHeaderItem = ({
    title,
    value,
    currency,
    isVirtual = false,
    shortCurrency = false,
    mainBalance = false,
}: Props) => {
    const { t } = useTranslation();

    // Callers pass the raw code ('EGP'); translate here so every header reads
    // the same label as the rest of the app.
    const label = shortCurrency ? currencyShortLabel(t, currency) : currencyLabel(t, currency);
    const displayValue = (value !== '--' && typeof value === 'number')
        ? currency ? currencyNumber(Number(value)) + ' ' + label : Number(value)
        : value;

    return (
        <View className="items-center justify-center">
            <FontText
                type="body" weight="regular" className={cn("text-content-secondary uppercase mb-0.5", Platform.OS === 'ios' ? 'text-xs' : 'text-[12px]')}>
                {title}
            </FontText>
            <View className="flex-row items-center gap-x-1">
                <FontText
                    type="head" weight="bold"
                    className={cn("text-content-primary uppercase", mainBalance ? "text-xl" : "text-base")}
                >
                    {displayValue}
                </FontText>
                {isVirtual && <VirtualBadge />}
            </View>
        </View>
    )
}

export default BalanceHeaderItem