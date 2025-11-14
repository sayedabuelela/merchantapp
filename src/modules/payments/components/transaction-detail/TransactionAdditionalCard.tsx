import { useTranslation } from 'react-i18next';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { TransactionDetail } from '../../payments.model';

interface TransactionAdditionalCardProps {
    transaction: TransactionDetail;
}

/**
 * Additional transaction information card
 */
export const TransactionAdditionalCard = ({ transaction }: TransactionAdditionalCardProps) => {
    const { t } = useTranslation();

    const hasAdditionalInfo =
        transaction.order?.orderReference ||
        transaction.origin ||
        transaction.paymentOrigin ||
        transaction.metaData?.kashierOriginType ||
        transaction.metaData?.kashierOriginDetails?.id ||
        transaction.discount ||
        (transaction.labels && transaction.labels.length > 0) ||
        transaction.isVoided ||
        transaction.isReversed;

    if (!hasAdditionalInfo) return null;

    return (
        <DetailsSection title={t('Additional Information')}>
            {transaction.order?.orderReference && (
                <SectionRowItem title={t('Order Reference')} value={transaction.order.orderReference} />
            )}
            {transaction.origin && (
                <SectionRowItem title={t('Origin')} value={transaction.origin} />
            )}
            {transaction.paymentOrigin && (
                <SectionRowItem title={t('Payment Origin')} value={transaction.paymentOrigin} />
            )}
            {transaction.metaData?.kashierOriginType && (
                <SectionRowItem title={t('Origin Type')} value={transaction.metaData.kashierOriginType} />
            )}
            {transaction.metaData?.kashierOriginDetails?.id && (
                <SectionRowItem title={t('Origin ID')} value={transaction.metaData.kashierOriginDetails.id} />
            )}
            {transaction.discount && (
                <SectionRowItem title={t('Discount')} value={transaction.discount} />
            )}
            {transaction.labels && transaction.labels.length > 0 && (
                <SectionRowItem title={t('Labels')} value={transaction.labels.join(', ')} />
            )}
            {transaction.isVoided && <SectionRowItem title={t('Is Voided')} value={t('Yes')} />}
            {transaction.isReversed && <SectionRowItem title={t('Is Reversed')} value={t('Yes')} />}
        </DetailsSection>
    );
};
