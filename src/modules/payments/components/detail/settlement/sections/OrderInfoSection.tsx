import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Order Info Section - Displays settlement fees and merchant information
 * Used in Transaction Details view for all BnPl payment types
 */
const OrderInfoSection = ({ data }: Props) => {
    const { t } = useTranslation();

    // Only render if we have at least one value to show
    const hasData = data.fees || data.vat || data.authorizationId ||
        data.merchantType || data.merchantReference || data.earlySettlementFees;
    console.log('earlySettlementFees : ', data.earlySettlementFees);

    if (!hasData) {
        return null;
    }

    return (
        <DetailsSection title={t('Order Info')} className='mt-6'>
            <SectionRowItem
                title={t('Kashier Fees')}
                value={formatAmount(data.fees, t('EGP'))}
            />
            <SectionRowItem
                title={t('Fees After 14% VAT')}
                value={formatAmount((Number(data.vat) + Number(data.fees)).toFixed(2), t('EGP'))}
            />
            <SectionRowItem
                title={t('Authorization ID')}
                value={formatText(data.authorizationId)}
            />
            <SectionRowItem
                title={t('Merchant Type')}
                value={formatText(data.merchantType?.toUpperCase())}
            />
            <SectionRowItem
                title={t('Merchant Reference')}
                value={formatText(data.merchantReference)}
            />
            {data.earlySettlementFees !== undefined && (
                <SectionRowItem
                    title={t('Early Settlement Fees')}
                    value={formatAmount(data.earlySettlementFees, t('EGP'))}
                />
            )}
        </DetailsSection>
    );
};

export default OrderInfoSection;
