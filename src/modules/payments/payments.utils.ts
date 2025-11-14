import { SourceOfFunds } from './payments.model';

/**
 * Type guards for identifying payment types
 */

export const isCardPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;
    return !!(sourceOfFunds.maskedCard || sourceOfFunds.cardBrand || sourceOfFunds.issuer);
};

export const isValuPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;
    return sourceOfFunds.type === 'VALU' || !!sourceOfFunds.payerInfo;
};

export const isWalletPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;
    return !!(sourceOfFunds.payerAccount && sourceOfFunds.payScheme);
};

export const isCashPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;
    return sourceOfFunds.type === 'Cash';
};

export type PaymentType = 'card' | 'valu' | 'wallet' | 'cash' | 'unknown';

export const getPaymentType = (sourceOfFunds?: SourceOfFunds): PaymentType => {
    if (!sourceOfFunds) return 'unknown';

    if (isValuPayment(sourceOfFunds)) return 'valu';
    if (isCashPayment(sourceOfFunds)) return 'cash';
    if (isWalletPayment(sourceOfFunds)) return 'wallet';
    if (isCardPayment(sourceOfFunds)) return 'card';

    return 'unknown';
};
