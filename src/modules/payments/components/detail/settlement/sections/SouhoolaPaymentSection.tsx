import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Souhoola Payment Section - Displays Souhoola-specific payment details
 * Fields: Loan Number, Phone Number, Tenure, First/Last Installment Date, Admin Fees, Down Payment
 */
const SouhoolaPaymentSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const payerInfo = data.sourceOfFunds?.payerInfo;

    // This component should only render if payerInfo exists
    if (!payerInfo) {
        return null;
    }

    return (
        <DetailsSection title={t('Souhoola Payment Details')}>
            <SectionRowItem
                title={t('Loan Number')}
                value={formatText(payerInfo.loanNumber?.toString())}
            />
            <SectionRowItem
                title={t('Phone Number')}
                value={formatText(payerInfo.phoneNumber)}
            />
            <SectionRowItem
                title={t('Tenure')}
                value={formatText(payerInfo.tenure?.toString())}
            />
            <SectionRowItem
                title={t('First Installment Date')}
                value={formatText(payerInfo.firstEmiDueDate || payerInfo.firstInstallmentDate)}
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
                title={t('Down Payment')}
                value={formatAmount(payerInfo.downPayment, t('EGP'))}
            />
        </DetailsSection>
    );
};

export default SouhoolaPaymentSection;
