import { currencyNumber } from "@/src/core/utils/number-fields";
import FontText from "@/src/shared/components/FontText";
import ScaleFadeIn from "@/src/shared/components/wrappers/animated-wrappers/ScaleView";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface Props {
    /** whole-set eligible total (shown even when nothing is selected) */
    totalAmount: number;
    ordersCount: number;
}

const CURRENCY = 'EGP';

/** Top summary card — always the eligible whole-set totals (§5/§11). */
const SettlementSummaryCard = ({ totalAmount, ordersCount }: Props) => {
    const { t } = useTranslation();

    return (
        <View className="flex-row items-center px-6 gap-x-5 mb-6">
            <ScaleFadeIn delay={0} duration={400} className="flex-1">
                <View className="items-center justify-center border rounded border-stroke-main bg-surface-secondary py-3">
                    <FontText type="body" weight="regular" className="text-xxs text-content-secondary mb-1 uppercase">
                        {t('Total amount')}
                    </FontText>
                    <FontText type="body" weight="semi" className="text-sm text-content-primary uppercase">
                        {currencyNumber(totalAmount)} {t(CURRENCY)}
                    </FontText>
                </View>
            </ScaleFadeIn>
            <ScaleFadeIn delay={0} duration={400} className="flex-1">
                <View className="items-center justify-center border rounded border-stroke-main bg-surface-secondary py-3">
                    <FontText type="body" weight="regular" className="text-xxs text-content-secondary mb-1 uppercase">
                        {t('Orders')}
                    </FontText>
                    <FontText type="body" weight="semi" className="text-sm text-content-primary uppercase">
                        {ordersCount}
                    </FontText>
                </View>
            </ScaleFadeIn>
        </View>
    );
};

export default SettlementSummaryCard;
