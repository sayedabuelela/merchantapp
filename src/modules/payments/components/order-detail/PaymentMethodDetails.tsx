import { SourceOfFunds } from '@/src/modules/payments/payments.model';
import {
    isCardPayment,
    isBnPlPayment,
    isWalletPayment,
    isCashPayment,
} from '@/src/modules/payments/payments.utils';
import { CardPaymentDetails } from './CardPaymentDetails';
import { WalletPaymentDetails } from './WalletPaymentDetails';
import { CashPaymentDetails } from './CashPaymentDetails';
import { BnPlPaymentDetails } from './BnPlPaymentDetails';

interface PaymentMethodDetailsProps {
    method: string;
    sourceOfFunds?: SourceOfFunds;
    paymentChannel?: string;
}

/**
 * Smart wrapper component that renders the appropriate payment details
 * based on the payment type (Card, VALU, Wallet, Cash)
 */
export const PaymentMethodDetails = ({ method, sourceOfFunds, paymentChannel }: PaymentMethodDetailsProps) => {

    if (!sourceOfFunds) return null;

    // Determine payment type and render appropriate component
    if (isBnPlPayment(sourceOfFunds)) {
        return <BnPlPaymentDetails method={method} sourceOfFunds={sourceOfFunds} paymentChannel={paymentChannel} />;
    }

    if (isCashPayment(sourceOfFunds)) {
        return <CashPaymentDetails sourceOfFunds={sourceOfFunds} paymentChannel={paymentChannel} />;
    }

    if (isWalletPayment(sourceOfFunds)) {
        return <WalletPaymentDetails sourceOfFunds={sourceOfFunds} paymentChannel={paymentChannel} />;
    }

    if (isCardPayment(sourceOfFunds)) {
        return <CardPaymentDetails sourceOfFunds={sourceOfFunds} paymentChannel={paymentChannel} />;
    }

    // No recognized payment type - don't render anything
    return null;
};
