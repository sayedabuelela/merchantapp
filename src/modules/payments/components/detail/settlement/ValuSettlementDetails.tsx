import { View } from 'react-native';
import { SettlementData } from './adapters';
import {
    OrderInfoSection,
    TerminalInfoSection,
    FeesSection,
    ValuPaymentSection,
} from './sections';

interface Props {
    data: SettlementData;
}

/**
 * Valu Settlement Details - Comprehensive settlement view for VALU payments
 *
 * Layout differs based on context:
 * - Order Details: Valu Payment Details + Fees section
 * - Transaction Details: Valu Payment Details + Order Info section
 *
 * Detection: Order data has settlementAmount, transaction data does not
 */
const ValuSettlementDetails = ({ data }: Props) => {
    const payerInfo = data.sourceOfFunds?.payerInfo;

    // This component should only render if payerInfo exists
    if (!payerInfo) {
        return null;
    }
    console.log('ValuSettlementDetails : ', data);
    // Determine if this is order view or transaction view
    // Order data has settlementAmount, transaction data does not
    const isOrderView = data.settlementAmount !== undefined;

    return (
        <View className="mt-4">
            {/* Valu Payment Details - Always visible */}
            <ValuPaymentSection data={data} />

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

export default ValuSettlementDetails;
