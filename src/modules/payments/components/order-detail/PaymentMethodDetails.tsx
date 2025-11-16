import { SourceOfFunds } from '@/src/modules/payments/payments.model';
import {
    isCardPayment,
    isValuPayment,
    isWalletPayment,
    isCashPayment,
} from '@/src/modules/payments/payments.utils';
import { CardPaymentDetails } from './CardPaymentDetails';
import { ValuPaymentDetails } from './ValuPaymentDetails';
import { WalletPaymentDetails } from './WalletPaymentDetails';
import { CashPaymentDetails } from './CashPaymentDetails';

interface PaymentMethodDetailsProps {
    sourceOfFunds?: SourceOfFunds;
    paymentChannel?: string;
}

/**
 * Smart wrapper component that renders the appropriate payment details
 * based on the payment type (Card, VALU, Wallet, Cash)
 */
export const PaymentMethodDetails = ({ sourceOfFunds, paymentChannel }: PaymentMethodDetailsProps) => {
    console.log('sourceOfFunds',sourceOfFunds);
    
    if (!sourceOfFunds) return null;

    // Determine payment type and render appropriate component
    if (isValuPayment(sourceOfFunds)) {
        return <ValuPaymentDetails sourceOfFunds={sourceOfFunds} paymentChannel={paymentChannel} />;
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
