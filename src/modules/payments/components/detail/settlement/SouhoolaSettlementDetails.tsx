import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SettlementData } from './adapters';
import { SouhoolaPaymentSection } from './sections';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { formatRelativeDate, formatTime } from '@/src/core/utils/dateUtils';

interface Props {
    data: SettlementData;
}

/**
 * Souhoola Settlement Details - Comprehensive settlement view for Souhoola BNPL payments
 *
 * Layout differs based on context:
 * - Order Details: Souhoola Payment Details + Fees section (4 fields only)
 * - Transaction Details: Souhoola Payment Details + Order Info section (4 fields only)
 *
 * Detection: Order data has settlementAmount, transaction data does not
 */
const SouhoolaSettlementDetails = ({ data }: Props) => {
    const { t } = useTranslation();
    const payerInfo = data.sourceOfFunds?.payerInfo;

    // This component should only render if payerInfo exists
    if (!payerInfo) {
        return null;
    }

    // Determine if this is order view or transaction view
    // Order data has settlementAmount, transaction data does not
    const isOrderView = data.settlementAmount !== undefined;

    return (
        <View className="mt-4">
            {/* Souhoola Payment Details - Always visible */}
            <SouhoolaPaymentSection data={data} />

            {isOrderView ? (
                /* Order Details view: Fees section with 4 fields matching web */
                <DetailsSection title={t('Fees')} className='mt-6'>
                    <SectionRowItem
                        title={t('Kashier Fees')}
                        value={formatAmount(data.fees, t('EGP'))}
                    />
                    <SectionRowItem
                        title={t('Fees After 14% VAT')}
                        value={formatAmount(Number((Number(data.vat) + Number(data.fees)).toFixed(2)), t('EGP'))}
                    />
                    <SectionRowItem
                        title={t('Settlement Amount')}
                        value={formatAmount(data.settlementAmount, t('EGP'))}
                    />
                    {data.rfsDate !== undefined && data.rfsDate !== 'NA' && (
                        <SectionRowItem
                            title={t('Ready for settlement date')}
                            value={data.rfsDate ? `${formatRelativeDate(data.rfsDate)}, ${formatTime(data.rfsDate)}` : formatText(undefined)}
                        />
                    )}
                </DetailsSection>
            ) : (
                /* Transaction Details view: Order Info section with 4 fields matching web */
                <DetailsSection title={t('Order Info')} className='mt-6'>
                    <SectionRowItem
                        title={t('Kashier Fees')}
                        value={formatAmount(data.fees, t('EGP'))}
                    />
                    <SectionRowItem
                        title={t('Authorization ID')}
                        value={formatText(data.authorizationId)}
                    />
                    <SectionRowItem
                        title={t('Merchant Type')}
                        value={formatText(data.merchantType?.toUpperCase())}
                    />
                    <SectionRowItem
                        title={t('Merchant Reference')}
                        value={formatText(data.merchantReference)}
                    />
                </DetailsSection>
            )}
        </View>
    );
};

export default SouhoolaSettlementDetails;
