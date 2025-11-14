import { useTranslation } from 'react-i18next';
import { DetailSection, DetailRow } from '../detail';
import { OrderDetailPayment } from '../../payments.model';

interface AdditionalInfoCardProps {
    order: OrderDetailPayment;
}

/**
 * Additional order information (branch, terminal, etc.)
 */
export const AdditionalInfoCard = ({ order }: AdditionalInfoCardProps) => {
    const { t } = useTranslation();

    const terminalId = order.posTerminal?.terminalId;
    const originType = order.metaData?.kashierOriginType;
    const originId = order.metaData?.kashierOriginDetails?.id;

    const hasAdditionalInfo =
        (terminalId && terminalId !== 'NA') ||
        originType ||
        originId;

    if (!hasAdditionalInfo) return null;

    return (
        <DetailSection title={t('Additional Information')}>
            {terminalId && terminalId !== 'NA' && (
                <DetailRow label={t('Terminal ID')} value={terminalId} />
            )}
            {originType && <DetailRow label={t('Origin Type')} value={originType} />}
            {originId && <DetailRow label={t('Origin ID')} value={originId} />}
        </DetailSection>
    );
};
