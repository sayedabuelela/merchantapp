import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import {useTranslation} from 'react-i18next';
import {formatAmount, formatText} from '@/src/modules/payments/utils/formatters';
import {SettlementData} from '../adapters';
import {formatDateByLocale} from '@/src/core/utils/dateUtils';

interface Props {
    data: SettlementData;
}

/**
 * Forsa Payment Section - Displays Forsa BNPL-specific payment details
 * Same shape as Valu: Loan Number, Customer Name, National ID, Tenure,
 * Monthly Paid, First/Last Installment Date, Admin Fees, Down Payment,
 * Due Amount, Cash Back, To U, Mobile Number
 */
const ForsaPaymentSection = ({data}: Props) => {
    const {t} = useTranslation();

    const payerInfo = data.sourceOfFunds?.payerInfo;

    if (!payerInfo) {
        return null;
    }
    return (
        <DetailsSection title={t('Forsa Payment Details')}>
            <SectionRowItem
                title={t('Loan Number')}
                value={formatText(payerInfo.loan_id?.toString())}
            />
            <SectionRowItem
                title={t('Plan ID')}
                value={formatText(payerInfo.planId?.toString())}
            />
            <SectionRowItem
                title={t('Customer Mobile Number')}
                value={payerInfo.phone}
            />
            <SectionRowItem
                title={t('Category')}
                value={formatText(payerInfo.categoryId?.toString())}
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

export default ForsaPaymentSection;
