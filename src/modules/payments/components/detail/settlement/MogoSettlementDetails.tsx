import { View } from 'react-native';
import { SettlementData } from './adapters';
import {
    OrderInfoSection,
    TerminalInfoSection,
    FeesSection,
    MogoPaymentSection,
} from './sections';

interface Props {
    data: SettlementData;
}

/**
 * Mogo Settlement Details - Settlement view for Mogo BNPL payments
 *
 * Layout differs based on context:
 * - Order Details: Mogo Payment Details + Fees section
 * - Transaction Details: Mogo Payment Details + Order Info section
 *
 * Detection: Order data has settlementAmount, transaction data does not
 */
const MogoSettlementDetails = ({ data }: Props) => {
    const payerInfo = data.sourceOfFunds?.payerInfo;

    // This component should only render if payerInfo exists
    if (!payerInfo) {
        return null;
    }

    // Determine if this is order view or transaction view
    // Order data has settlementAmount, transaction data does not
    const isOrderView = data.settlementAmount !== undefined;

    return (
        <View className="mt-4">
            {/* Mogo Payment Details - Always visible */}
            <MogoPaymentSection data={data} />

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

export default MogoSettlementDetails;
