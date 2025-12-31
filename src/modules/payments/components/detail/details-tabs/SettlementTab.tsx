import { OrderDetailPayment } from "@/src/modules/payments/payments.model"
import {
    isWalletPayment,
    isCashPayment,
    isBnPlPayment,
    isContactBnplPayment,
    isValuBnplPayment,
    isMogoBnplPayment,
    isSouhoolaBnplPayment,
    isAmanBnplPayment,
    isCardInstallmentPayment,
    isCardPayment
} from "@/src/modules/payments/payments.utils"
import {
    BnPlSettlementDetails,
    WalletSettlementDetails,
    CashSettlementDetails,
    ContactSettlementDetails,
    ValuSettlementDetails,
    MogoSettlementDetails,
    SouhoolaSettlementDetails,
    AmanSettlementDetails,
    BankInstallmentSettlementDetails,
    CardOnlineSettlementDetails,
    adaptOrderData
} from "@/src/modules/payments/components/detail/settlement"

interface Props {
    order: OrderDetailPayment;
}

/**
 * Smart wrapper component that renders the appropriate settlement details
 * based on the payment type (VALU, Wallet, Cash, Contact, Bank Installment, Card Online, etc.)
 */
const SettlementTab = ({ order }: Props) => {
    const sourceOfFunds = order.sourceOfFunds;
    const settlementData = adaptOrderData(order);

    // Card payments with bank installments (must check before regular card payments)
    if (isCardInstallmentPayment(sourceOfFunds, order.installmentDetails)) {
        return <BankInstallmentSettlementDetails data={settlementData} />;
    }

    // Regular card payments (without installments)
    if (isCardPayment(sourceOfFunds)) {
        return <CardOnlineSettlementDetails data={settlementData} />;
    }

    // VALU BNPL payments (must check before generic BnPl)
    if (isValuBnplPayment(sourceOfFunds)) {
        return <ValuSettlementDetails data={settlementData} />;
    }

    // Mogo BNPL payments (must check before generic BnPl)
    if (isMogoBnplPayment(sourceOfFunds)) {
        return <MogoSettlementDetails data={settlementData} />;
    }

    // Souhoola BNPL payments (must check before generic BnPl)
    if (isSouhoolaBnplPayment(sourceOfFunds)) {
        return <SouhoolaSettlementDetails data={settlementData} />;
    }

    // Aman BNPL payments (must check before generic BnPl)
    if (isAmanBnplPayment(sourceOfFunds)) {
        return <AmanSettlementDetails data={settlementData} />;
    }

    // Contact BNPL payments (must check before generic BnPl)
    if (isContactBnplPayment(sourceOfFunds)) {
        return <ContactSettlementDetails data={settlementData} />;
    }

    // Other BNPL payments (fallback)
    if (isBnPlPayment(sourceOfFunds)) {
        return <BnPlSettlementDetails data={settlementData} />;
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