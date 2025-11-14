import DetailsSection from "@/src/shared/components/details-screens/DetailsSection"
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem"
import { useTranslation } from "react-i18next"
import { OrderDetailPayment } from "@/src/modules/payments/payments.model"
import { View } from "react-native"
import { formatAmount, formatText, capitalizeWords } from "@/src/modules/payments/utils/formatters"

interface Props {
    order: OrderDetailPayment;
}

const WalletSettlementDetails = ({ order }: Props) => {
    const { t } = useTranslation();

    const sourceOfFunds = order.sourceOfFunds;

    return (
        <View className="mt-4">
            <DetailsSection title={t('Wallet Information')}>
                <SectionRowItem
                    title={t('Mobile Number')}
                    value={formatText(sourceOfFunds?.payerAccount)}
                />
                <SectionRowItem
                    title={t('Payment Scheme')}
                    value={capitalizeWords(sourceOfFunds?.payScheme)}
                />
                <SectionRowItem
                    title={t('Paid Through')}
                    value={capitalizeWords(sourceOfFunds?.paidThrough)}
                />
                <SectionRowItem
                    title={t('Wallet Strategy')}
                    value={capitalizeWords(sourceOfFunds?.walletStrategy)}
                />
            </DetailsSection>

            <DetailsSection title={t('Financial Summary')} className="mt-4">
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

export default WalletSettlementDetails;
