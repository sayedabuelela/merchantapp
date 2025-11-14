import { TransactionDetail } from '@/src/modules/payments/payments.model';
import {
    isValuPayment,
    isWalletPayment,
    isCashPayment,
} from '@/src/modules/payments/payments.utils';
import ValuSettlementDetails from '@/src/modules/payments/components/transaction-detail/settlement/ValuSettlementDetails';
import WalletSettlementDetails from '@/src/modules/payments/components/transaction-detail/settlement/WalletSettlementDetails';
import CashSettlementDetails from '@/src/modules/payments/components/transaction-detail/settlement/CashSettlementDetails';

interface Props {
    transaction: TransactionDetail;
}

/**
 * Smart wrapper component that renders the appropriate settlement details
 * based on the payment type (VALU, Wallet, Cash, etc.)
 */
const SettlementTab = ({ transaction }: Props) => {
    const sourceOfFunds = transaction.sourceOfFunds;

    // VALU payments (installments)
    if (isValuPayment(sourceOfFunds)) {
        return <ValuSettlementDetails transaction={transaction} />;
    }

    // Wallet payments (Vodafone Cash, Orange Cash, etc.)
    if (isWalletPayment(sourceOfFunds)) {
        return <WalletSettlementDetails transaction={transaction} />;
    }

    // Cash payments or any other payment type
    // Shows basic financial summary (amount, fees, etc.)
    if (isCashPayment(sourceOfFunds)) {
        return <CashSettlementDetails transaction={transaction} />;
    }

    // Fallback: Show basic financial summary for unknown payment types
    return <CashSettlementDetails transaction={transaction} />;
};

export default SettlementTab;
