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
                    value={formatAmount(data.amount,t('EGP'))}
                />
                <SectionRowItem
                    title={t('Captured Amount')}
                    value={formatAmount(data.capturedAmount,t('EGP'))}
                />
                {data.refundedAmount > 0 && (
                    <SectionRowItem
                        title={t('Refunded Amount')}
                        value={formatAmount(data.refundedAmount,t('EGP'))}
                    />
                )}
                {data.fees && (
                    <SectionRowItem
                        title={t('Kashier Fees')}
                        value={formatAmount(data.fees,t('EGP'))}
                    />
                )}
                {data.vat && (
                    <SectionRowItem
                        title={t('Fees After 14% VAT')}
                        value={formatAmount((Number(data.vat) + Number(data.fees)).toFixed(2),t('EGP'))}
                    />
                )}
                {data.settlementAmount && (
                    <SectionRowItem
                        title={t('Settlement Amount')}
                        value={formatAmount(data.settlementAmount,t('EGP'))}
                    />
                )}
            </DetailsSection>
        </View>
    );
};

export default CashSettlementDetails;
