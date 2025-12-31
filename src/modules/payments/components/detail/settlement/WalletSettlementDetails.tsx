import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
    formatAmount,
    formatText,
    capitalizeWords,
} from '@/src/modules/payments/utils/formatters';
import { SettlementData } from './adapters';

interface Props {
    data: SettlementData;
}

const WalletSettlementDetails = ({ data }: Props) => {
    const { t } = useTranslation();

    const sourceOfFunds = data.sourceOfFunds;

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

export default WalletSettlementDetails;
