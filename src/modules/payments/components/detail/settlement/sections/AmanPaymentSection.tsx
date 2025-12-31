import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Aman Payment Section - Displays Aman-specific payment details
 * Fields: Aman Transaction Id, Phone Number, Tenure, Monthly Paid,
 *         First Installment Date, Last Installment Date, Admin Fees, Discount Code
 */
const AmanPaymentSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const payerInfo = data.sourceOfFunds?.payerInfo;

    // This component should only render if payerInfo exists
    if (!payerInfo) {
        return null;
    }

    return (
        <DetailsSection title={t('Aman Payment Details')}>
            <SectionRowItem
                title={t('Aman Transaction Id')}
                value={formatText(payerInfo.transactionId?.toString())}
            />
            <SectionRowItem
                title={t('Phone Number')}
                value={formatText(payerInfo.phoneNumber || payerInfo.mobileNumber || payerInfo.mobile)}
            />
            <SectionRowItem
                title={t('Tenure')}
                value={formatText(payerInfo.tenure?.toString())}
            />
            <SectionRowItem
                title={t('Monthly Paid')}
                value={formatAmount(payerInfo.emi, t('EGP'))}
            />
            <SectionRowItem
                title={t('First Installment Date')}
                value={formatText(payerInfo.firstEmiDueDate)}
            />
            <SectionRowItem
                title={t('Last Installment Date')}
                value={formatText(payerInfo.lastInstallmentDate)}
            />
            <SectionRowItem
                title={t('Admin Fees')}
                value={formatAmount(payerInfo.adminFees, t('EGP'))}
            />
            <SectionRowItem
                title={t('Discount Code')}
                value={formatText((payerInfo as any).discountCode)}
            />
        </DetailsSection>
    );
};

export default AmanPaymentSection;
