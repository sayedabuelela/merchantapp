import { View } from 'react-native';
import { SettlementData } from './adapters';
import {
    OrderInfoSection,
    TerminalInfoSection,
    FeesSection,
    CardPaymentSection,
} from './sections';

interface Props {
    data: SettlementData;
}

/**
 * Card Online Settlement Details - Settlement view for regular card payments (without installments)
 *
 * Layout differs based on context:
 * - Order Details: Card Payment Details + Fees section
 * - Transaction Details: Card Payment Details + Order Info section
 *
 * Detection: Order data has settlementAmount, transaction data does not
 */
const CardOnlineSettlementDetails = ({ data }: Props) => {
    const sourceOfFunds = data.sourceOfFunds;

    // This component should only render if card data exists
    if (!sourceOfFunds?.maskedCard) {
        return null;
    }

    // Determine if this is order view or transaction view
    // Order data has settlementAmount, transaction data does not
    const isOrderView = data.settlementAmount !== undefined;

    return (
        <View className="mt-4">
            {/* Card Payment Details - Always visible */}
            <CardPaymentSection data={data} />

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

export default CardOnlineSettlementDetails;
