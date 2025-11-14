import { useTranslation } from 'react-i18next';
import { DetailSection, DetailRow } from '../detail';
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
        <DetailSection title={t('Customer Information')}>
            {customerName && (
                <DetailRow
                    label={t('Customer Name')}
                    value={customerName}
                    icon={<UserIcon size={16} color="#666" />}
                />
            )}
            {customerEmail && (
                <DetailRow
                    label={t('Email')}
                    value={customerEmail}
                    icon={<EnvelopeIcon size={16} color="#666" />}
                />
            )}
            {customerPhone && (
                <DetailRow
                    label={t('Phone')}
                    value={customerPhone}
                    icon={<PhoneIcon size={16} color="#666" />}
                />
            )}
        </DetailSection>
    );
};
