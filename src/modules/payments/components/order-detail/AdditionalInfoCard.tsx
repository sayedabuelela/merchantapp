import { useTranslation } from 'react-i18next';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
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
        <DetailsSection title={t('Additional Information')}>
            {terminalId && terminalId !== 'NA' && (
                <SectionRowItem title={t('Terminal ID')} value={terminalId} />
            )}
            {originType && <SectionRowItem title={t('Origin Type')} value={originType} />}
            {originId && <SectionRowItem title={t('Origin ID')} value={originId} />}
        </DetailsSection>
    );
};
