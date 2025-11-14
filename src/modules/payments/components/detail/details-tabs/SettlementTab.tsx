import { OrderDetailPayment } from "@/src/modules/payments/payments.model"
import {
    isValuPayment,
    isWalletPayment,
    isCashPayment
} from "@/src/modules/payments/payments.utils"
import {
    ValuSettlementDetails,
    WalletSettlementDetails,
    CashSettlementDetails,
    adaptOrderData
} from "@/src/modules/payments/components/detail/settlement"

interface Props {
    order: OrderDetailPayment;
}

/**
 * Smart wrapper component that renders the appropriate settlement details
 * based on the payment type (VALU, Wallet, Cash, etc.)
 */
const SettlementTab = ({ order }: Props) => {
    const sourceOfFunds = order.sourceOfFunds;
    const settlementData = adaptOrderData(order);

    // VALU payments (installments)
    if (isValuPayment(sourceOfFunds)) {
        return <ValuSettlementDetails data={settlementData} />;
    }

    // Wallet payments (Vodafone Cash, Orange Cash, etc.)
    if (isWalletPayment(sourceOfFunds)) {
        return <WalletSettlementDetails data={settlementData} />;
    }

    // Cash payments or any other payment type
    // Shows basic financial summary (amount, fees, etc.)
    if (isCashPayment(sourceOfFunds)) {
        return <CashSettlementDetails data={settlementData} />;
    }

    // Fallback: Show basic financial summary for unknown payment types
    return <CashSettlementDetails data={settlementData} />;
}

export default SettlementTab