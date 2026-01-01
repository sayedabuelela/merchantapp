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
 * Mogo Payment Section - Displays Mogo-specific payment details
 * Fields: First Installment Date, Tenure, Down Payment, Financed amount,
 * Installment amount, Loan amount, Plan ID, Phone Number
 */
const MogoPaymentSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const payerInfo = data.sourceOfFunds?.payerInfo;

    if (!payerInfo) {
        return null;
    }

    const [day, month, year] = payerInfo?.firstInstallmentDate?.split("/") ?? [];
    console.log('payerInfo?.firstInstallmentDate : ', day, month, year);

    return (
        <DetailsSection title={t('Mogo Payment Details')}>
            <SectionRowItem
                title={t('First Installment Date')}
                value={formatDateByLocale(new Date(year, day - 1, month))}
            />
            <SectionRowItem
                title={t('Tenure')}
                value={payerInfo.months?.toString() ?? '-'}
            />
            <SectionRowItem
                title={t('Down Payment')}
                value={formatAmount(payerInfo.downPayment, t('EGP'))}
            />
            <SectionRowItem
                title={t('Financed amount')}
                value={formatAmount(payerInfo.financedAmount, t('EGP'))}
            />
            <SectionRowItem
                title={t('Installment amount')}
                value={formatAmount(payerInfo.installmentAmount, t("EGP"))}
            />
            <SectionRowItem
                title={t('Loan amount')}
                value={formatAmount(payerInfo.loanAmount, t("EGP"))}
            />
            {/* <SectionRowItem
                title={t('Plan ID')}
                value={formatText(payerInfo.planId)}
            /> */}
            <SectionRowItem
                title={t('Phone Number')}
                value={formatText(payerInfo.phoneNumber)}
            />
        </DetailsSection>
    );
};

export default MogoPaymentSection;
