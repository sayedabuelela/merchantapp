import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Contact Payment Details Section - Displays Contact BNPL specific payment information
 * Shows invoice number, monthly amount, client details, and tenure
 */
const ContactPaymentSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const payerInfo = data.sourceOfFunds?.payerInfo;

    if (!payerInfo) {
        return null;
    }

    // Format monthly amount with currency
    const formatMonthlyAmount = (value: number | undefined): string => {
        if (value === undefined || value === null) return '--';
        return `${value} ${data.currency || 'EGP'}`;
    };

    return (
        <DetailsSection title={t('Contact Payment Details')} className="mt-4">
            <SectionRowItem
                title={t('Invoice Number')}
                value={formatText(payerInfo.invoiceNo)}
            />
            <SectionRowItem
                title={t('Monthly Amount')}
                value={formatMonthlyAmount(payerInfo.installmentValue)}
            />
            <SectionRowItem
                title={t('Client Phone Number')}
                value={formatText(payerInfo.mobile)}
            />
            <SectionRowItem
                title={t('Client National ID')}
                value={formatText(payerInfo.nationalId)}
            />
            <SectionRowItem
                title={t('Tenure')}
                value={payerInfo.tenure?.toString()}
            />
        </DetailsSection>
    );
};

export default ContactPaymentSection;
