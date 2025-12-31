import { SourceOfFunds, InstallmentDetails } from './payments.model';

/**
 * BNPL payment type constants - using Set for O(1) lookup
 */
const BNPL_TYPES_SET = new Set(['valu', 'aman', 'souhoola', 'contact','mogo']);

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

export type PaymentType = 'card' | 'valu' | 'aman' | 'souhoola' |'contact' | 'mogo' | 'wallet' | 'cash' | 'unknown';
export type BnPlPaymentType = 'valu' | 'aman' | 'souhoola' |'contact' | 'mogo';
export const getPaymentType = (sourceOfFunds?: SourceOfFunds): PaymentType => {
    if (!sourceOfFunds) return 'unknown';

    if (isBnPlPayment(sourceOfFunds)) return sourceOfFunds.type?.toLowerCase() as BnPlPaymentType;
    if (isCashPayment(sourceOfFunds)) return 'cash';
    if (isWalletPayment(sourceOfFunds)) return 'wallet';
    if (isCardPayment(sourceOfFunds)) return 'card';

    return 'unknown';
};

/**
 * Checks if payment is specifically a Contact BNPL payment
 * Used to determine if OTP refund flow is required
 */
export const isContactBnplPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;

    // Check type field (case-insensitive)
    if (sourceOfFunds.type) {
        return sourceOfFunds.type.trim().toLowerCase() === 'contact';
    }

    return false;
};

/**
 * Checks if payment is specifically a VALU BNPL payment
 * Used to route to VALU-specific settlement details
 */
export const isValuBnplPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;

    // Check type field (case-insensitive)
    if (sourceOfFunds.type) {
        return sourceOfFunds.type.trim().toLowerCase() === 'valu';
    }

    return false;
};

/**
 * Checks if payment is a card payment with bank installments
 * Used to route to BankInstallmentSettlementDetails
 */
export const isCardInstallmentPayment = (
    sourceOfFunds?: SourceOfFunds,
    installmentDetails?: InstallmentDetails
): boolean => {
    // Must be a card payment with installment details
    return isCardPayment(sourceOfFunds) && !!installmentDetails;
};

/**
 * Checks if payment is specifically a Mogo BNPL payment
 * Used to route to Mogo-specific settlement details
 */
export const isMogoBnplPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;

    // Check type field (case-insensitive)
    if (sourceOfFunds.type) {
        return sourceOfFunds.type.trim().toLowerCase() === 'mogo';
    }

    return false;
};

/**
 * Checks if payment is specifically a Souhoola BNPL payment
 * Used to route to Souhoola-specific settlement details
 */
export const isSouhoolaBnplPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;

    // Check type field (case-insensitive)
    if (sourceOfFunds.type) {
        return sourceOfFunds.type.trim().toLowerCase() === 'souhoola';
    }

    return false;
};

/**
 * Checks if payment is specifically an Aman BNPL payment
 * Used to route to Aman-specific settlement details
 */
export const isAmanBnplPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    if (!sourceOfFunds) return false;

    // Check type field (case-insensitive)
    if (sourceOfFunds.type) {
        return sourceOfFunds.type.trim().toLowerCase() === 'aman';
    }

    return false;
};