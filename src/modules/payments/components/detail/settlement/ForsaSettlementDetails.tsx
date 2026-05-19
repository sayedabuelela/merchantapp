import { View } from 'react-native';
import { SettlementData } from './adapters';
import {
    OrderInfoSection,
    TerminalInfoSection,
    FeesSection,
    ForsaPaymentSection,
} from './sections';

interface Props {
    data: SettlementData;
}

/**
 * Forsa Settlement Details - Comprehensive settlement view for Forsa BNPL payments
 *
 * Layout differs based on context:
 * - Order Details: Forsa Payment Details + Fees section
 * - Transaction Details: Forsa Payment Details + Order Info section
 *
 * Detection: Order data has settlementAmount, transaction data does not
 */
const ForsaSettlementDetails = ({ data }: Props) => {
    const payerInfo = data.sourceOfFunds?.payerInfo;

    if (!payerInfo) {
        return null;
    }

    const isOrderView = data.settlementAmount !== undefined;

    return (
        <View className="mt-4">
            <ForsaPaymentSection data={data} />

            <TerminalInfoSection data={data} />

            {isOrderView ? (
                <FeesSection data={data} />
            ) : (
                <OrderInfoSection data={data} />
            )}
        </View>
    );
};

export default ForsaSettlementDetails;
