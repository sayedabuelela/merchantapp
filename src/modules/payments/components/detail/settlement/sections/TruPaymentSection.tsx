import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';
import { formatDateByLocale } from '@/src/core/utils/dateUtils';

interface Props {
    data: SettlementData;
}

/**
 * Tru Payment Section - Displays Tru BNPL-specific payment details
 * Fields: Loan Number, National ID, Tenure, Loan Amount,
 * First/Last Installment Date, Admin Fees, Down Payment
 */
const TruPaymentSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const payerInfo = data.sourceOfFunds?.payerInfo;

    if (!payerInfo) {
        return null;
    }

    const startDate = payerInfo.contract?.order?.installment_start_date;
    const endDate = payerInfo.contract?.order?.installment_end_date;

    return (
        <DetailsSection title={t('Tru Payment Details')}>
            <SectionRowItem
                title={t('Loan Number')}
                value={formatText(payerInfo.order?.id?.toString())}
            />
            <SectionRowItem
                title={t('National ID')}
                value={formatText(payerInfo.contract?.borrower?.national_id)}
            />
            <SectionRowItem
                title={t('Tenure')}
                value={payerInfo.contract?.order?.installment_duration?.toString() ?? '-'}
            />
            <SectionRowItem
                title={t('Loan amount')}
                value={formatAmount(payerInfo.order?.amount, t('EGP'))}
            />
            <SectionRowItem
                title={t('First Installment Date')}
                value={startDate ? formatDateByLocale(new Date(startDate)) : '-'}
            />
            <SectionRowItem
                title={t('Last Installment Date')}
                value={endDate ? formatDateByLocale(new Date(endDate)) : '-'}
            />
            <SectionRowItem
                title={t('Admin Fees')}
                value={formatAmount(payerInfo.order?.administrative_fees, t('EGP'))}
            />
            <SectionRowItem
                title={t('Down Payment')}
                value={formatAmount(payerInfo.order?.down_payment, t('EGP'))}
            />
        </DetailsSection>
    );
};

export default TruPaymentSection;
