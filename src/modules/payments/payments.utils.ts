import { SourceOfFunds } from './payments.model';

/**
 * BNPL payment type constants - using Set for O(1) lookup
 */
const BNPL_TYPES_SET = new Set(['valu', 'aman', 'souhoola', 'contact']);

/**
 * Type guards for identifying payment types
 */

export const isCardPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;
    return !!(sourceOfFunds.maskedCard || sourceOfFunds.cardBrand || sourceOfFunds.issuer);
};

export const isBnPlPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;

    // Primary check: type field (case-insensitive)
    if (sourceOfFunds.type) {
        const normalizedType = sourceOfFunds.type.trim().toLowerCase();
        if (BNPL_TYPES_SET.has(normalizedType)) {
            return true;
        }
    }

    // Fallback: payerInfo exists and it's not another payment type
    // This handles cases where type might be missing but payerInfo is present
    if (sourceOfFunds.payerInfo &&
        !isCardPayment(sourceOfFunds) &&
        !isWalletPayment(sourceOfFunds) &&
        sourceOfFunds.type?.toLowerCase() !== 'cash') {
        return true;
    }

    return false;
};

export const isWalletPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;
    return !!(sourceOfFunds.payerAccount && sourceOfFunds.payScheme);
};

export const isCashPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;
    return sourceOfFunds.type?.toLowerCase() === 'cash';
};

export type PaymentType = 'card' | 'valu' | 'aman' | 'souhoola' | 'wallet' | 'cash' | 'unknown';

export const getPaymentType = (sourceOfFunds?: SourceOfFunds): PaymentType => {
    if (!sourceOfFunds) return 'unknown';

    if (isBnPlPayment(sourceOfFunds)) return 'valu';
    if (isCashPayment(sourceOfFunds)) return 'cash';
    if (isWalletPayment(sourceOfFunds)) return 'wallet';
    if (isCardPayment(sourceOfFunds)) return 'card';

    return 'unknown';
};