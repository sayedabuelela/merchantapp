import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Card Payment Section - Displays card payment details
 * Fields: Card holder Name, Card Type, Card number, Expiry Date
 */
const CardPaymentSection = ({ data }: Props) => {
    const { t } = useTranslation();

    const sourceOfFunds = data.sourceOfFunds;

    if (!sourceOfFunds?.maskedCard) {
        return null;
    }

    // Format expiry date as MM / YY
    const expiryDate = sourceOfFunds.expiryMonth && sourceOfFunds.expiryYear
        ? `${sourceOfFunds.expiryMonth} / ${sourceOfFunds.expiryYear}`
        : '-';

    return (
        <DetailsSection title={t('Card Payment Details')}>
            <SectionRowItem
                valueClassName="capitalize"
                title={t('Card holder Name')}
                value={formatText(sourceOfFunds.cardHolderName)}
            />
            <SectionRowItem
                title={t('Card Type')}
                value={formatText(sourceOfFunds.cardBrand)}
            />
            <SectionRowItem
                title={t('Card number')}
                value={formatText(sourceOfFunds.maskedCard)}
            />
            <SectionRowItem
                title={t('Expiry Date')}
                value={expiryDate}
            />
        </DetailsSection>
    );
};

export default CardPaymentSection;
