import DetailsSection from "@/src/shared/components/details-screens/DetailsSection"
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem"
import { useTranslation } from "react-i18next"
import { OrderDetailPayment } from "@/src/modules/payments/payments.model"
import { View } from "react-native"
import { formatAmount } from "@/src/modules/payments/utils/formatters"

interface Props {
    order: OrderDetailPayment;
}

const CashSettlementDetails = ({ order }: Props) => {
    const { t } = useTranslation();

    return (
        <View className="mt-4">
            <DetailsSection>
                <SectionRowItem
                    title={t('Amount')}
                    value={formatAmount(order.amount)}
                />
                <SectionRowItem
                    title={t('Captured Amount')}
                    value={formatAmount(order.capturedAmount)}
                />
                {order.refundedAmount > 0 && (
                    <SectionRowItem
                        title={t('Refunded Amount')}
                        value={formatAmount(order.refundedAmount)}
                    />
                )}
                <SectionRowItem
                    title={t('Fees')}
                    value={formatAmount(order.fees)}
                />
                <SectionRowItem
                    title={t('VAT')}
                    value={formatAmount(order.vat)}
                />
                {order.settlementAmount && (
                    <SectionRowItem
                        title={t('Settlement Amount')}
                        value={formatAmount(order.settlementAmount)}
                    />
                )}
            </DetailsSection>
        </View>
    );
};

export default CashSettlementDetails;
