import { View } from 'react-native';
import { SettlementData } from './adapters';
import {
    OrderInfoSection,
    TerminalInfoSection,
    FeesSection,
    CardPaymentSection,
    InstallmentDetailsSection,
    DeductedFeesSection,
} from './sections';

interface Props {
    data: SettlementData;
}

/**
 * Bank Installment Settlement Details - Settlement view for card payments with bank installments
 *
 * Layout differs based on context:
 * - Order Details: Card Payment Details + Installment Details + Deducted Fees + Fees section
 * - Transaction Details: Card Payment Details + Installment Details + Deducted Fees + Order Info section
 *
 * Detection: Order data has settlementAmount, transaction data does not
 */
const BankInstallmentSettlementDetails = ({ data }: Props) => {
    const hasInstallment = data.installmentDetails && data.installmentFees;

    // This component should only render if installment data exists
    if (!hasInstallment) {
        return null;
    }

    // Determine if this is order view or transaction view
    // Order data has settlementAmount, transaction data does not
    const isOrderView = data.settlementAmount !== undefined;

    return (
        <View className="mt-4">
            {/* Card Payment Details - Always visible */}
            <CardPaymentSection data={data} />

            {/* Installment Details - Always visible */}
            <InstallmentDetailsSection data={data} />

            {/* Deducted Fees - Always visible */}
            <DeductedFeesSection data={data} />

            {/* Terminal Info - Only for POS transactions */}
            <TerminalInfoSection data={data} />

            {isOrderView ? (
                /* Order Details view: Show Fees section */
                <FeesSection data={data} />
            ) : (
                /* Transaction Details view: Show Order Info section */
                <OrderInfoSection data={data} />
            )}
        </View>
    );
};

export default BankInstallmentSettlementDetails;
