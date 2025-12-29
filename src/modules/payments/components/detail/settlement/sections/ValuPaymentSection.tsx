import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Valu Payment Section - Displays VALU-specific payment details
 * Fields: Loan Number, Customer Name, National ID, Tenure, Monthly Paid,
 * First/Last Installment Date, Admin Fees, Down Payment, Due Amount, Cash Back, To U, Mobile Number
 */
const ValuPaymentSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const payerInfo = data.sourceOfFunds?.payerInfo;

    if (!payerInfo) {
        return null;
    }

    return (
        <DetailsSection title={t('Valu Payment Details')}>
            <SectionRowItem
                title={t('Loan Number')}
                value={formatText(payerInfo.loanNumber?.toString())}
            />
            <SectionRowItem
                valueClassName="capitalize"
                title={t('Customer Name')}
                value={formatText(payerInfo.customerName)}
            />
            <SectionRowItem
                title={t('Customer National Id')}
                value={formatText(payerInfo.nationalID)}
            />
            <SectionRowItem
                title={t('Tenure')}
                value={payerInfo.tenure?.toString() ?? '-'}
            />
            <SectionRowItem
                title={t('Monthly Paid')}
                value={formatAmount(payerInfo.emi)}
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
                value={formatAmount(payerInfo.adminFees)}
            />
            <SectionRowItem
                title={t('Down Payment')}
                value={formatAmount(payerInfo.downPayment)}
            />
            <SectionRowItem
                title={t('Due Amount')}
                value={formatAmount(payerInfo.financedAmount)}
            />
            <SectionRowItem
                title={t('Cash Back')}
                value={formatAmount(payerInfo.CashbackAmount)}
            />
            <SectionRowItem
                title={t('To U')}
                value={formatAmount(payerInfo.ToUAmount)}
            />
            <SectionRowItem
                title={t('Mobile Number')}
                value={formatText(payerInfo.mobileNumber)}
            />
        </DetailsSection>
    );
};

export default ValuPaymentSection;
