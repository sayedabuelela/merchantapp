import { useTranslation } from 'react-i18next';
import { DetailSection, DetailRow } from '../detail';
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
        <DetailSection title={t('Additional Information')}>
            {transaction.order?.orderReference && (
                <DetailRow label={t('Order Reference')} value={transaction.order.orderReference} />
            )}
            {transaction.origin && (
                <DetailRow label={t('Origin')} value={transaction.origin} />
            )}
            {transaction.paymentOrigin && (
                <DetailRow label={t('Payment Origin')} value={transaction.paymentOrigin} />
            )}
            {transaction.metaData?.kashierOriginType && (
                <DetailRow label={t('Origin Type')} value={transaction.metaData.kashierOriginType} />
            )}
            {transaction.metaData?.kashierOriginDetails?.id && (
                <DetailRow label={t('Origin ID')} value={transaction.metaData.kashierOriginDetails.id} />
            )}
            {transaction.discount && (
                <DetailRow label={t('Discount')} value={transaction.discount} />
            )}
            {transaction.labels && transaction.labels.length > 0 && (
                <DetailRow label={t('Labels')} value={transaction.labels.join(', ')} />
            )}
            {transaction.isVoided && <DetailRow label={t('Is Voided')} value={t('Yes')} />}
            {transaction.isReversed && <DetailRow label={t('Is Reversed')} value={t('Yes')} />}
        </DetailSection>
    );
};
