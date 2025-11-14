import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { TransactionDetail } from '@/src/modules/payments/payments.model';
import { View } from 'react-native';
import { formatAmount } from '@/src/modules/payments/utils/formatters';

interface Props {
    transaction: TransactionDetail;
}

const CashSettlementDetails = ({ transaction }: Props) => {
    const { t } = useTranslation();

    return (
        <View className="mt-4">
            <DetailsSection>
                <SectionRowItem
                    title={t('Amount')}
                    value={formatAmount(transaction.amount)}
                />
                <SectionRowItem
                    title={t('Captured Amount')}
                    value={formatAmount(transaction.totalCapturedAmount)}
                />
                {transaction.totalRefundedAmount > 0 && (
                    <SectionRowItem
                        title={t('Refunded Amount')}
                        value={formatAmount(transaction.totalRefundedAmount)}
                    />
                )}
                {transaction.order?.feeTrxAmount && (
                    <SectionRowItem
                        title={t('Fees')}
                        value={formatAmount(transaction.order.feeTrxAmount)}
                    />
                )}
                {transaction.order?.feeVatAmount && (
                    <SectionRowItem
                        title={t('VAT')}
                        value={formatAmount(transaction.order.feeVatAmount)}
                    />
                )}
            </DetailsSection>
        </View>
    );
};

export default CashSettlementDetails;
