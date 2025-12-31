import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from './adapters';
import { OrderInfoSection, TerminalInfoSection } from './sections';

interface Props {
    data: SettlementData;
}

/**
 * BnPl Settlement Details - Comprehensive settlement view for BNPL payments
 * (VALU, Souhoola, Mogo, Aman)
 * Combines Order Info, Terminal Info (for POS), and BNPL-specific payment details
 */
const BnPlSettlementDetails = ({ data }: Props) => {
    const { t } = useTranslation();

    // Access BNPL payment info from sourceOfFunds
    const payerInfo = data.sourceOfFunds?.payerInfo;

    // This component should only render if payerInfo exists
    if (!payerInfo) {
        return null;
    }

    return (
        <View className="mt-4">
            {/* Order Info - Always visible */}
            <OrderInfoSection data={data} />

            {/* Terminal Info - Only for POS transactions */}
            <TerminalInfoSection data={data} />

            {/* BNPL Payment Details */}
            <DetailsSection title={t('BNPL Payment Details')} className="mt-4">
                <SectionRowItem
                    title={t('Mobile Number')}
                    value={formatText(payerInfo.mobileNumber)}
                />
                <SectionRowItem
                    title={t('Loan Number')}
                    value={formatText(payerInfo.loanNumber?.toString())}
                />
                <SectionRowItem
                    valueClassName="capitalize"
                    title={t('Customer Name')}
                    value={formatText(payerInfo.customerName)}
                />
                <SectionRowItem
                    title={t('Customer National Id')}
                    value={formatText(payerInfo.nationalID)}
                />
                <SectionRowItem
                    title={t('Tenure')}
                    value={payerInfo.tenure?.toString()}
                />
                <SectionRowItem
                    title={t('Monthly Paid')}
                    value={formatAmount(payerInfo.emi,t('EGP'))}
                />
                <SectionRowItem
                    title={t('First Installment Date')}
                    value={formatText(payerInfo.firstEmiDueDate)}
                />
                <SectionRowItem
                    title={t('Last Installment Date')}
                    value={formatText(payerInfo.lastInstallmentDate)}
                />
                <SectionRowItem
                    title={t('Financed Amount')}
                    value={formatAmount(payerInfo.financedAmount,t('EGP'))}
                />
                <SectionRowItem
                    title={t('Admin Fees')}
                    value={formatAmount(payerInfo.adminFees,t('EGP'))}
                />
                <SectionRowItem
                    title={t('Down Payment')}
                    value={formatAmount(payerInfo.downPayment,t('EGP'))}
                />
                <SectionRowItem
                    title={t('Cash Back')}
                    value={formatAmount(payerInfo.CashbackAmount,t('EGP'))}
                />
                <SectionRowItem
                    title={t('To U')}
                    value={formatAmount(payerInfo.ToUAmount,t('EGP'))}
                />
            </DetailsSection>
        </View>
    );
};

export default BnPlSettlementDetails;
