import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { formatAmount } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from './adapters';

interface Props {
    data: SettlementData;
}

const CashSettlementDetails = ({ data }: Props) => {
    const { t } = useTranslation();

    return (
        <View className="mt-4">
            <DetailsSection>
                <SectionRowItem
                    title={t('Amount')}
                    value={formatAmount(data.amount)}
                />
                <SectionRowItem
                    title={t('Captured Amount')}
                    value={formatAmount(data.capturedAmount)}
                />
                {data.refundedAmount > 0 && (
                    <SectionRowItem
                        title={t('Refunded Amount')}
                        value={formatAmount(data.refundedAmount)}
                    />
                )}
                {data.fees && (
                    <SectionRowItem
                        title={t('Fees')}
                        value={formatAmount(data.fees)}
                    />
                )}
                {data.vat && (
                    <SectionRowItem
                        title={t('VAT')}
                        value={formatAmount(data.vat)}
                    />
                )}
                {data.settlementAmount && (
                    <SectionRowItem
                        title={t('Settlement Amount')}
                        value={formatAmount(data.settlementAmount)}
                    />
                )}
            </DetailsSection>
        </View>
    );
};

export default CashSettlementDetails;
