import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters'; import { formatRelativeDate } from '@/src/core/utils/dateUtils';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}
const formatInstallmentDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    // Extract date part before the time (e.g., "10/5/2024" from "10/5/2024 12:00:00 AM")
    const datePart = dateString.split(' ')[0];
    const [month, day, year] = datePart.split('/').map(Number);
    if (!month || !day || !year) return '-';
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return '-';
    return formatRelativeDate(date);
};
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
                value={formatText(payerInfo.months?.toString())}
            />
            <SectionRowItem
                title={t('Monthly Paid')}
                value={formatAmount(payerInfo.monthlyAmount, t('EGP'))}
            />
            <SectionRowItem
                title={t('First Installment Date')}
                value={formatInstallmentDate(payerInfo.firstInstallmentDate)}
            />
            <SectionRowItem
                title={t('Last Installment Date')}
                value={formatInstallmentDate(payerInfo.lastInstallmentDate)}
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
