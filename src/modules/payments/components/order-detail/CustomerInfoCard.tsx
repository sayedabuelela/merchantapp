import { useTranslation } from 'react-i18next';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { OrderDetailPayment } from '../../payments.model';

interface CustomerInfoCardProps {
    order: OrderDetailPayment;
}

/**
 * Customer information card
 */
export const CustomerInfoCard = ({ order }: CustomerInfoCardProps) => {
    const { t } = useTranslation();

    const customerName = order.metaData?.kashierOriginDetails?.customerName;
    const customerEmail = order.metaData?.kashierOriginDetails?.customerEmail;
    const customerPhone = order.metaData?.kashierOriginDetails?.customerPhone;

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
