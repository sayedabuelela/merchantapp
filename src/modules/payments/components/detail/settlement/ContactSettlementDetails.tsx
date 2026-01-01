import { View } from 'react-native';
import { SettlementData } from './adapters';
import { OrderInfoSection, TerminalInfoSection, ContactPaymentSection } from './sections';

interface Props {
    data: SettlementData;
}

/**
 * Contact Settlement Details - Comprehensive settlement view for Contact BNPL payments
 * Combines Order Info, Terminal Info (for POS), and Contact-specific payment details
 */
const ContactSettlementDetails = ({ data }: Props) => {
    return (
        <View className="mt-4">
            {/* Contact Payment Details - Contact-specific information */}
            <ContactPaymentSection data={data} />
            {/* Terminal Info - Only for POS transactions */}
            <TerminalInfoSection data={data} />
            {/* Order Info - Always visible */}
            <OrderInfoSection data={data} />
        </View>
    );
};

export default ContactSettlementDetails;
