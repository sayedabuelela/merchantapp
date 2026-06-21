import { currencyNumber } from "@/src/core/utils/number-fields";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { Limits } from "../../domain/instant-settlement.models";

interface Props {
    limits?: Limits;
}

const CURRENCY = 'EGP';

/** Daily-limit card — real `limits` from the eligible response (§12). */
const DailyLimitCard = ({ limits }: Props) => {
    const { t } = useTranslation();
    if (!limits) return null;

    const { dailyCap, usedToday } = limits;
    // guard dailyCap=0 → 0 (no NaN)
    const progress = dailyCap > 0 ? Math.min(Math.max(usedToday / dailyCap, 0), 1) : 0;

    return (
        <View className="mx-6 mb-6 border rounded border-stroke-main bg-surface-secondary p-4">
            <View className="flex-row items-center justify-between mb-2">
                <FontText type="body" weight="regular" className="text-xxs text-content-secondary uppercase">
                    {t('Daily limit')}
                </FontText>
                <FontText type="body" weight="semi" className="text-sm text-content-primary">
                    {currencyNumber(dailyCap)} {t(CURRENCY)}
                </FontText>
            </View>
            <View className="h-1.5 rounded-full bg-tertiary overflow-hidden">
                <View
                    className="h-full rounded-full bg-[#28C2A0]"
                    style={{ width: `${progress * 100}%` }}
                />
            </View>
            <FontText type="body" weight="regular" className="text-xxs text-content-secondary mt-2 self-end">
                {t('Used')} {currencyNumber(usedToday)} {t(CURRENCY)}
            </FontText>
        </View>
    );
};

export default DailyLimitCard;
