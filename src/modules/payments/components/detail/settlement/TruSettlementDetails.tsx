import { View } from 'react-native';
import { SettlementData } from './adapters';
import {
    OrderInfoSection,
    TerminalInfoSection,
    FeesSection,
    TruPaymentSection,
} from './sections';

interface Props {
    data: SettlementData;
}

/**
 * Tru Settlement Details - Comprehensive settlement view for Tru BNPL payments
 *
 * Layout differs based on context:
 * - Order Details: Tru Payment Details + Fees section
 * - Transaction Details: Tru Payment Details + Order Info section
 */
const TruSettlementDetails = ({ data }: Props) => {
    const payerInfo = data.sourceOfFunds?.payerInfo;

    if (!payerInfo) {
        return null;
    }

    const isOrderView = data.settlementAmount !== undefined;

    return (
        <View className="mt-4">
            <TruPaymentSection data={data} />
            <TerminalInfoSection data={data} />
            {isOrderView ? (
                <FeesSection data={data} />
            ) : (
                <OrderInfoSection data={data} />
            )}
        </View>
    );
};

export default TruSettlementDetails;
