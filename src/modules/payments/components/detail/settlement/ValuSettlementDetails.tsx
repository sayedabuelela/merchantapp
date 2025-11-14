import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { formatAmount, formatText } from '@/src/modules/payments/utils/formatters';
import { SettlementData } from './adapters';

interface Props {
    data: SettlementData;
}

const ValuSettlementDetails = ({ data }: Props) => {
    const { t } = useTranslation();

    // Access VALU payment info from sourceOfFunds
    const payerInfo = data.sourceOfFunds?.payerInfo;

    // This component should only render if payerInfo exists
    if (!payerInfo) {
        return null;
    }

    return (
        <View className="mt-4">
            <DetailsSection>
                <SectionRowItem
                    title={t('Mobile Number')}
                    value={formatText(payerInfo.mobileNumber)}
                />
                <SectionRowItem
                    title={t('Loan Number')}
                    value={formatText(payerInfo.loanNumber)}
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
                    value={formatAmount(payerInfo.emi)}
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
                    value={formatAmount(payerInfo.financedAmount)}
                />
                <SectionRowItem
                    title={t('Admin Fees')}
                    value={formatAmount(payerInfo.adminFees)}
                />
                <SectionRowItem
                    title={t('Down Payment')}
                    value={formatAmount(payerInfo.downPayment)}
                />
                <SectionRowItem
                    title={t('Cash Back')}
                    value={formatAmount(payerInfo.CashbackAmount)}
                />
                <SectionRowItem
                    title={t('To U')}
                    value={formatAmount(payerInfo.ToUAmount)}
                />
            </DetailsSection>
        </View>
    );
};

export default ValuSettlementDetails;
