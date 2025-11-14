import { useTranslation } from 'react-i18next';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { TransactionDetail } from '../../payments.model';
import { UserIcon, EnvelopeIcon, PhoneIcon } from 'react-native-heroicons/outline';

interface TransactionCustomerCardProps {
    transaction: TransactionDetail;
}

/**
 * Transaction customer information card
 */
export const TransactionCustomerCard = ({ transaction }: TransactionCustomerCardProps) => {
    const { t } = useTranslation();

    const customerName = transaction.metaData?.kashierOriginDetails?.customerName;
    const customerEmail = transaction.metaData?.kashierOriginDetails?.customerEmail;
    const customerPhone = transaction.metaData?.kashierOriginDetails?.customerPhone;

    const hasCustomerInfo = customerName || customerEmail || customerPhone;

    if (!hasCustomerInfo) return null;

    return (
        <DetailsSection title={t('Customer Information')}>
            {customerName && (
                <SectionRowItem
                    title={t('Customer Name')}
                    value={customerName}
                />
            )}
            {customerEmail && (
                <SectionRowItem
                    title={t('Email')}
                    value={customerEmail}
                />
            )}
            {customerPhone && (
                <SectionRowItem
                    title={t('Phone')}
                    value={customerPhone}
                />
            )}
        </DetailsSection>
    );
};
