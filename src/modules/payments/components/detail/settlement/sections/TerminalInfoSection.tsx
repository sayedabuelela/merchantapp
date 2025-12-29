import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from '../adapters';

interface Props {
    data: SettlementData;
}

/**
 * Terminal Info Section - Displays POS terminal information
 * Only rendered when payment is POS and posTerminal data exists
 */
const TerminalInfoSection = ({ data }: Props) => {
    const { t } = useTranslation();

    // Only render for POS payments with terminal data
    const isPosPayment = data.paymentChannel?.toLowerCase() === 'pos';
    const hasTerminalData = data.posTerminal?.terminalId || data.posTerminal?.serialNo ||
                           data.posTerminal?.branchName || data.posTerminal?.branchAddress;

    if (!isPosPayment || !hasTerminalData) {
        return null;
    }

    return (
        <DetailsSection title={t('Terminal Info')} className="mt-4">
            <SectionRowItem
                title={t('Terminal Id')}
                value={formatText(data.posTerminal?.terminalId)}
            />
            <SectionRowItem
                title={t('Serial No')}
                value={formatText(data.posTerminal?.serialNo)}
            />
            <SectionRowItem
                title={t('Branch Name')}
                value={formatText(data.posTerminal?.branchName)}
            />
            <SectionRowItem
                title={t('Branch Address')}
                value={formatText(data.posTerminal?.branchAddress)}
            />
        </DetailsSection>
    );
};

export default TerminalInfoSection;
