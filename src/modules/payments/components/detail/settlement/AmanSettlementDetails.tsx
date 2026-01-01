import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SettlementData } from './adapters';
import { AmanPaymentSection, TerminalInfoSection } from './sections';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { formatRelativeDate, formatTime } from '@/src/core/utils/dateUtils';

interface Props {
    data: SettlementData;
}

/**
 * Aman Settlement Details - Comprehensive settlement view for Aman BNPL payments
 *
 * Layout differs based on context:
 * - Order Details: Aman Payment Details + Fees section (4 fields)
 * - Transaction Details: Aman Payment Details + Order Info section (4 fields) + Terminal Info (for POS)
 *
 * Detection: Order data has settlementAmount, transaction data does not
 */
const AmanSettlementDetails = ({ data }: Props) => {
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
            {/* Aman Payment Details - Always visible */}
            <AmanPaymentSection data={data} />

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
                            value={data.rfsDate ? `${formatRelativeDate(data.rfsDate)}, ${formatTime(data.rfsDate)}` : '-'}
                        />
                    )}
                </DetailsSection>
            ) : (
                /* Transaction Details view: Order Info section + Terminal Info (for POS) */
                <>
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

                    {/* Terminal Info - Only for POS transactions */}
                    <TerminalInfoSection data={data} />
                </>
            )}
        </View>
    );
};

export default AmanSettlementDetails;
