import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Deducted Fees Section - Displays bank installment fee breakdown
 * Fields: Bank interest rate, Kashier online processing/transaction fees,
 * Kashier installment service fees, VAT, Total deducted fees
 */
const DeductedFeesSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const fees = data.installmentFees;
    const installment = data.installmentDetails;

    if (!fees) {
        return null;
    }

    // Format percentage display
    const formatPercentage = (value?: number): string => {
        if (value === undefined || value === null) return '0.00%';
        return `${(value * 100).toFixed(2)}%`;
    };

    // Bank interest rate percentage from installmentDetails
    const interestRatePercent = installment?.interestRate !== undefined
        ? `${installment.interestRate.toFixed(2)}%`
        : '0.00%';

    // KOSF rate for transaction fees
    const kosfRatePercent = fees.KOSFRate
        ? `${parseFloat(fees.KOSFRate).toFixed(2)}%`
        : '0.00%';

    // KISF rate for installment service fees
    const kisfRatePercent = fees.KISFRate
        ? `${parseFloat(fees.KISFRate).toFixed(2)}%`
        : '0.00%';

    // VAT percentage
    const vatPercent = formatPercentage(fees.VAT);

    return (
        <DetailsSection title={t('Deducted Fees')} className="mt-6">
            <SectionRowItem
                title={`${t('Bank interest rate')} (${interestRatePercent})`}
                value={formatAmount(fees.interestRateAmount)}
            />
            <SectionRowItem
                title={t('Kashier online processing fees')}
                value={formatAmount(fees.KOSF?.processing ?? 0)}
            />
            <SectionRowItem
                title={`${t('Kashier online transaction fees')} (${kosfRatePercent})`}
                value={formatAmount(fees.KOSFAmount)}
            />
            <SectionRowItem
                title={`${t('Kashier installment service fees')} (${kisfRatePercent})`}
                value={formatAmount(fees.KISFAmount)}
            />
            <SectionRowItem
                title={`${t('VAT')} (${vatPercent})`}
                value={formatAmount(fees.VATAmount)}
            />
            <SectionRowItem
                title={t('Total deducted fees')}
                value={formatAmount(fees.totalDeductedAmount)}
            />
        </DetailsSection>
    );
};

export default DeductedFeesSection;
