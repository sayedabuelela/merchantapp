import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Installment Details Section - Displays bank installment plan details
 * Fields: Plan Name/ID, Plan Financing, Bank Name/Abb/ID, Bank's Terms & Conditions,
 * Plan Interest Rate/Duration, Monthly Installment Amount, Authorized Amount,
 * Original Amount, Settlement Amount
 */
const InstallmentDetailsSection = ({ data }: Props) => {
    const { t, i18n } = useTranslation();

    const installment = data.installmentDetails;

    if (!installment) {
        return null;
    }

    const isArabic = i18n.language === 'ar';

    // Format plan name based on language
    const planName = isArabic
        ? installment.planName?.nameAr || installment.planName?.nameEn
        : installment.planName?.nameEn || installment.planName?.nameAr;

    // Format plan financing display
    const planFinancingText = installment.planFinancing
        ? t('Card Holder Finance (CHF)')
        : t('Merchant Finance (MF)');

    // Format bank info: Name / Abbreviation / ID
    const bankName = isArabic
        ? installment.installmentBank?.nameAr || installment.installmentBank?.nameEn
        : installment.installmentBank?.nameEn || installment.installmentBank?.nameAr;

    const bankInfo = [
        bankName,
        installment.installmentBank?.abbreviation,
        installment.FISystemId
    ].filter(Boolean).join(' / ');

    // Format interest rate and duration: X% / Y Month(s)
    const interestRate = installment.interestRate ?? 0;
    const duration = installment.planDuration ?? 0;
    const monthLabel = duration === 1 ? t('Month') : t('Months');
    const interestDuration = `${interestRate}% / ${duration} ${monthLabel}`;

    return (
        <DetailsSection title={t('Installment Details')} className="mt-6">
            <SectionRowItem
                title={t('Plan Name / ID')}
                value={formatText(planName)}
            />
            <SectionRowItem
                title={t('Plan Financing')}
                value={planFinancingText}
            />
            <SectionRowItem
                title={t('Bank Name / Abb. / ID')}
                value={formatText(bankInfo)}
            />
            <SectionRowItem
                title={t("Bank's Terms & Conditions")}
                value="-"
            />
            <SectionRowItem
                title={t('Plan Interest Rate / Duration')}
                value={interestDuration}
            />
            <SectionRowItem
                title={t('Monthly Installment Amount')}
                value={formatAmount(installment.installmentAmountPerMonth,t('EGP'))}
            />
            <SectionRowItem
                title={t('Authorized Amount')}
                value={formatAmount(installment.authorizedAmount,t('EGP'))}
            />
            <SectionRowItem
                title={t('Original Amount')}
                value={formatAmount(installment.originalAmount, t('EGP'))}
            />
            <SectionRowItem
                title={t('Settlement Amount')}
                value={formatAmount(installment.settlementAmount, t('EGP'))}
            />
        </DetailsSection>
    );
};

export default InstallmentDetailsSection;
