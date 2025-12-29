import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Fees Section - Displays settlement fees and amounts
 * Used in Order Details view for all BnPl payment types
 */
const FeesSection = ({ data }: Props) => {
    const { t } = useTranslation();

    // Only render if we have at least one value to show
    const hasData = data.fees || data.vat || data.settlementAmount ||
                    data.rfsDate || data.earlySettlementFees;

    if (!hasData) {
        return null;
    }

    return (
        <DetailsSection title={t('Fees')} className='mt-6'>
            <SectionRowItem
                title={t('Kashier Fees')}
                value={formatAmount(data.fees)}
            />
            <SectionRowItem
                title={t('Fees After 14% VAT')}
                value={formatAmount((Number(data.vat) + Number(data.fees)).toFixed(2))}
            />
            <SectionRowItem
                title={t('Settlement Amount')}
                value={formatAmount(data.settlementAmount)}
            />
            <SectionRowItem
                title={t('Ready for settlement date')}
                value={formatText(data.rfsDate)}
            />
            <SectionRowItem
                title={t('Early Settlement Fees')}
                value={formatAmount(data.earlySettlementFees)}
            />
        </DetailsSection>
    );
};

export default FeesSection;
