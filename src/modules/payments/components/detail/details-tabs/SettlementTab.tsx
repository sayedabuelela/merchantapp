import { OrderDetailPayment } from "@/src/modules/payments/payments.model"
import {
    isValuPayment,
    isWalletPayment,
    isCashPayment
} from "@/src/modules/payments/payments.utils"
import {
    ValuSettlementDetails,
    WalletSettlementDetails,
    CashSettlementDetails
} from "@/src/modules/payments/components/order-detail/settlement"

interface Props {
    order: OrderDetailPayment;
}

/**
 * Smart wrapper component that renders the appropriate settlement details
 * based on the payment type (VALU, Wallet, Cash, etc.)
 */
const SettlementTab = ({ order }: Props) => {
    const sourceOfFunds = order.sourceOfFunds;

    // VALU payments (installments)
    if (isValuPayment(sourceOfFunds)) {
        return <ValuSettlementDetails order={order} />;
    }

    // Wallet payments (Vodafone Cash, Orange Cash, etc.)
    if (isWalletPayment(sourceOfFunds)) {
        return <WalletSettlementDetails order={order} />;
    }

    // Cash payments or any other payment type
    // Shows basic financial summary (amount, fees, etc.)
    if (isCashPayment(sourceOfFunds)) {
        return <CashSettlementDetails order={order} />;
    }

    // Fallback: Show basic financial summary for unknown payment types
    return <CashSettlementDetails order={order} />;
}

export default SettlementTab