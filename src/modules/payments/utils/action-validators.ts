/**
 * Action Validators for Payment Operations (Void, Refund, Capture)
 *
 * This file contains business logic for determining when void and refund
 * operations are available based on transaction properties, bank cutoff times,
 * and payment method constraints.
 */

import type { OrderDetailPayment, TransactionDetail } from '../payments.model';

// Bank-specific void windows (cutoff times in 24-hour format)
export const MPGS_VOID_WINDOWS = {
  bm: { hour: 23, minute: 59 },    // Banque Misr - 11:59 PM
  nbe: { hour: 17, minute: 59 },   // National Bank of Egypt - 5:59 PM
  qnb: { hour: 23, minute: 0 },    // Qatar National Bank - 11:00 PM
} as const;

type BankName = keyof typeof MPGS_VOID_WINDOWS;

/**
 * Normalizes strings for comparison (trim + lowercase)
 */
const normalizeString = (str?: string | null): string =>
  (str ?? '').trim().toLowerCase();

/**
 * Checks if current time is within 24 hours of the transaction date
 * This is the default void window when no bank-specific cutoff applies
 */
const isWithin24Hours = (transactionDate: Date): boolean => {
  const currentTime = new Date();
  const hoursDiff = (currentTime.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff < 24;
};

/**
 * Checks if current time is within the bank's void window
 *
 * The void window starts at the bank's cutoff time on the transaction date
 * and ends at the same cutoff time the next day.
 */
const bankCutOffChecker = (
  bankName: BankName | undefined,
  transactionDate: Date
): boolean => {
  if (
    !bankName ||
    !(transactionDate instanceof Date) ||
    !MPGS_VOID_WINDOWS[bankName]
  ) {
    return false;
  }

  const { hour, minute } = MPGS_VOID_WINDOWS[bankName];
  const currentTime = new Date();

  const voidWindowStart = new Date(transactionDate);
  voidWindowStart.setHours(hour, minute, 0, 0);

  const voidWindowEnd = new Date(voidWindowStart);
  if (transactionDate >= voidWindowStart) {
    voidWindowEnd.setDate(voidWindowEnd.getDate() + 1);
  }

  return currentTime < voidWindowEnd;
};

/**
 * Determines if void operation is available for an order
 *
 * Void Rules:
 * - Card Online: Yes (with void validations for MPGS)
 * - Card POS: NO
 * - Wallet: NO
 * - BNPL (Valu, Aman, Sohoola, Contact): NO
 * - Bank Installments: NO
 * - Instapy: NO
 * - Basata: NO
 *
 * For MPGS cards (Online only):
 * - Payment/authorize/capture transaction type
 * - Approved/success/paid/authorized status
 * - No refunds processed yet (totalRefundedAmount === 0)
 * - Not already voided
 * - RFS date is not zero (pcc.rfs_due_after !== 0)
 * - Within bank's void window
 * - Not an authorize-and-captured transaction
 */
export const isVoidAvailable = (order: OrderDetailPayment): boolean => {
  if (!order) return false;

  const {
    createdAt,
    provider,
    status,
    refundedAmount,
    pcc,
    history,
    lastTransactionType,
    method,
    paymentChannel,
    installmentDetails,
  } = order;

  // RULE: No void for Installment Orders (Detail)
  if (installmentDetails) return false;

  // RULE: No void for POS transactions
  const isPosTransaction = normalizeString(paymentChannel) === 'pos';
  if (isPosTransaction) return false;

  // RULE: Only Card payments can be voided (Online only)
  // Wallet, BNPL, Bank Installments, Instapy, Basata - NO VOID
  const isCardMethod = normalizeString(method) === 'card';
  if (!isCardMethod) return false;

  // Common checks for all card payments
  const isApprovedTransaction = [
    'approved',
    'success',
    'paid',
    'authorized',
  ].includes(normalizeString(status));

  const isTotalRefundAmountEqualZero = refundedAmount === 0;

  const isAlreadyVoided = normalizeString(status) === 'voided';

  // Basic validation - applies to all card payments
  if (!isApprovedTransaction || !isTotalRefundAmountEqualZero || isAlreadyVoided) {
    return false;
  }

  // Parse transaction date for time-based checks
  const transactionDate = new Date(createdAt);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  // MPGS-specific validation (stricter requirements)
  const isMpgsProvider = normalizeString(provider) === 'mpgs';

  if (isMpgsProvider) {
    const isPaymentType = normalizeString(lastTransactionType)
      ? ['payment', 'pay', 'دفع', 'authorize', 'capture'].includes(normalizeString(lastTransactionType))
      : false;

    const isRfsDateEqualZero = pcc?.rfs_due_after === 0;

    // Bank void window check
    // If bank is known, use bank-specific cutoff; otherwise use 24-hour fallback
    const bankName = pcc?.financial_institution as BankName | undefined;
    const isKnownBank = bankName ? bankName in MPGS_VOID_WINDOWS : false;
    const isValidVoidWindow = isKnownBank
      ? bankCutOffChecker(bankName, transactionDate)
      : isWithin24Hours(transactionDate); // Fallback to 24-hour rule for unknown banks

    const isAuthorizeAndCaptured =
      normalizeString(lastTransactionType) === 'authorize' &&
      history?.some(trx => normalizeString(trx.operation) === 'capture');

    return (
      isPaymentType &&
      !isRfsDateEqualZero &&
      isValidVoidWindow &&
      !isAuthorizeAndCaptured
    );
  }

  // For non-MPGS card payments, apply 24-hour rule
  return isWithin24Hours(transactionDate);
};

/**
 * Determines if refund operation is available for an order
 *
 * Refund Rules:
 * - Card Online: YES
 * - Card POS: YES (requires cardDataToken)
 * - Wallet Online: YES
 * - Wallet POS: YES
 * - BNPL (Valu, Aman, Sohoola, Contact): YES
 * - Bank Installments: NO
 * - Instapy: YES
 * - Basata: NO
 * - Cash: NO
 *
 * Common Requirements:
 * - Status is approved/success/paid
 * - Has refundable amount (totalRefundedAmount < totalCapturedAmount)
 * - Transaction type is not 'authorize' or 'refund'
 *
 * POS Card Refund Exception:
 * - POS card transactions require cardDataToken in sourceOfFunds
 */
export const isRefundAvailable = (order: OrderDetailPayment): boolean => {
  if (!order) return false;

  const {
    status,
    paymentChannel,
    method,
    sourceOfFunds,
    refundedAmount,
    capturedAmount,
    lastTransactionType,
    provider,
    installmentDetails,
  } = order;

  // RULE: No refund for Installment Orders (Detail)
  if (installmentDetails) return false;

  const normalizedMethod = normalizeString(method);
  const normalizedProvider = normalizeString(provider);

  // RULE: No refund for Basata
  if (normalizedProvider === 'basata') return false;

  // RULE: No refund for Bank Installments
  // Bank installments typically have specific providers or method indicators
  const isBankInstallment = normalizedProvider === 'bank_installment' ||
    normalizedProvider === 'bankinstallment' ||
    normalizedMethod === 'bank_installment' ||
    normalizedMethod === 'bankinstallment';
  if (isBankInstallment) return false;

  // RULE: No refund for Cash
  if (normalizedMethod === 'cash') return false;

  // Common status check
  const isApprovedStatus = ['approved', 'success', 'paid', 'partially refunded', 'partially_refunded'].includes(
    normalizeString(status)
  );
  if (!isApprovedStatus) return false;

  // Has refundable amount
  const hasRefundableAmount = refundedAmount < capturedAmount;
  if (!hasRefundableAmount) return false;

  // Transaction type validation
  const isValidTransactionType =
    normalizeString(lastTransactionType) !== 'authorize';
  // && normalizeString(lastTransactionType) !== 'refund';
  if (!isValidTransactionType) return false;

  // POS-specific rules
  const isPosTransaction = normalizeString(paymentChannel) === 'pos';

  if (isPosTransaction) {
    // POS Card requires cardDataToken
    if (normalizedMethod === 'card') {
      return !!sourceOfFunds?.cardDataToken;
    }
    // POS Wallet is allowed
    if (normalizedMethod === 'wallet') {
      return true;
    }
    // Other POS methods - block by default
    return false;
  }

  // Online transactions - Card, Wallet, BNPL (Valu, Aman, Sohoola, Contact), Instapy are all allowed
  // The methods that reach here: card, wallet, valu, aman, sohoola, contact, instapay, etc.
  return true;
};

/**
 * Determines if capture operation is available for an order
 *
 * Capture Requirements:
 * - MPGS provider only
 * - Authorize transaction type (lastTransactionType === 'authorize')
 * - Status is specifically 'AUTHORIZED'
 * - Not already captured
 * - Not already voided
 */
export const isCaptureAvailable = (order: OrderDetailPayment): boolean => {
  if (!order) return false;

  const {
    provider,
    status,
    history,
    lastTransactionType,
  } = order;

  const isMpgsProvider = normalizeString(provider) === 'mpgs';
  if (!isMpgsProvider) return false;

  // Status must be specifically 'authorized'
  const isAuthorizedStatus = normalizeString(status) === 'authorized';
  if (!isAuthorizedStatus) return false;

  // Transaction type must be 'authorize'
  const isAuthorizeType = normalizeString(lastTransactionType) === 'authorize';
  if (!isAuthorizeType) return false;

  // Not already captured
  const isAlreadyCaptured = history?.some(
    trx => normalizeString(trx.operation) === 'capture'
  );
  if (isAlreadyCaptured) return false;

  // Not voided
  const isAlreadyVoided = normalizeString(status) === 'voided';
  if (isAlreadyVoided) return false;

  return true;
};

// ============================================================================
// Transaction Validators (for TransactionDetail type)
// ============================================================================

/**
 * Determines if void operation is available for a transaction
 *
 * Void Rules:
 * - Card Online: Yes (with void validations for MPGS)
 * - Card POS: NO
 * - Wallet: NO
 * - BNPL (Valu, Aman, Sohoola, Contact): NO
 * - Bank Installments: NO
 * - Instapy: NO
 * - Basata: NO
 *
 * For MPGS cards (Online only):
 * - Payment/authorize/capture transaction type
 * - Approved/success/paid/authorized status
 * - No refunds processed yet (totalRefundedAmount === 0)
 * - Not already voided
 * - RFS date is not zero (pcc.rfs_due_after !== 0)
 * - Within bank's void window
 * - Not an authorize-and-captured transaction
 */
export const isVoidAvailableForTransaction = (transaction: TransactionDetail): boolean => {
  if (!transaction) return false;

  const {
    date,
    provider,
    status,
    totalRefundedAmount,
    pcc,
    transactions,
    trxType,
    method,
    paymentChannel,
    installmentDetails,
  } = transaction;

  // RULE: No void for Installment Transactions (Detail)
  if (installmentDetails) return false;

  // RULE: No void for POS transactions
  const isPosTransaction = normalizeString(paymentChannel) === 'pos';
  if (isPosTransaction) return false;

  // RULE: Only Card payments can be voided (Online only)
  // Wallet, BNPL, Bank Installments, Instapy, Basata - NO VOID
  const isCardMethod = normalizeString(method) === 'card';
  if (!isCardMethod) return false;

  // Common checks for all card payments
  const isApprovedTransaction = [
    'approved',
    'success',
    'paid',
    'authorized',
  ].includes(normalizeString(status));

  const isTotalRefundAmountEqualZero = totalRefundedAmount === 0;

  const isAlreadyVoided = transaction.isVoided || normalizeString(status) === 'voided';

  // Basic validation - applies to all card payments
  if (!isApprovedTransaction || !isTotalRefundAmountEqualZero || isAlreadyVoided) {
    return false;
  }

  // Parse transaction date for time-based checks
  const transactionDate = new Date(date);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  // MPGS-specific validation (stricter requirements)
  const isMpgsProvider = normalizeString(provider) === 'mpgs';

  if (isMpgsProvider) {
    const isPaymentType = normalizeString(trxType)
      ? ['payment', 'pay', 'دفع', 'authorize', 'capture'].includes(normalizeString(trxType))
      : false;

    const isRfsDateEqualZero = pcc?.rfs_due_after === 0;

    // Bank void window check
    // If bank is known, use bank-specific cutoff; otherwise use 24-hour fallback
    const bankName = pcc?.financial_institution as BankName | undefined;
    const isKnownBank = bankName ? bankName in MPGS_VOID_WINDOWS : false;
    const isValidVoidWindow = isKnownBank
      ? bankCutOffChecker(bankName, transactionDate)
      : isWithin24Hours(transactionDate); // Fallback to 24-hour rule for unknown banks

    const isAuthorizeAndCaptured =
      normalizeString(trxType) === 'authorize' &&
      transactions?.some(trx => normalizeString(trx.operation) === 'capture');

    return (
      isPaymentType &&
      !isRfsDateEqualZero &&
      isValidVoidWindow &&
      !isAuthorizeAndCaptured
    );
  }

  // For non-MPGS card payments, apply 24-hour rule
  return isWithin24Hours(transactionDate);
};

/**
 * Determines if refund operation is available for a transaction
 *
 * Refund Rules:
 * - Card Online: YES
 * - Card POS: YES (requires cardDataToken)
 * - Wallet Online: YES
 * - Wallet POS: YES
 * - BNPL (Valu, Aman, Sohoola, Contact): YES
 * - Bank Installments: NO
 * - Instapy: YES
 * - Basata: NO
 * - Cash: NO
 *
 * Common Requirements:
 * - Status is approved/success/paid
 * - Has refundable amount (totalRefundedAmount < totalCapturedAmount)
 * - Transaction type is not 'authorize' or 'refund'
 *
 * POS Card Refund Exception:
 * - POS card transactions require cardDataToken in sourceOfFunds
 */
export const isRefundAvailableForTransaction = (transaction: TransactionDetail): boolean => {
  if (!transaction) return false;

  const {
    status,
    paymentChannel,
    method,
    sourceOfFunds,
    totalRefundedAmount,
    totalCapturedAmount,
    trxType,
    provider,
    installmentDetails,
  } = transaction;

  // RULE: No refund for Installment Transactions (Detail)
  if (installmentDetails) return false;

  const normalizedMethod = normalizeString(method);
  const normalizedProvider = normalizeString(provider);

  // RULE: No refund for Basata
  if (normalizedProvider === 'basata') return false;

  // RULE: No refund for Bank Installments
  const isBankInstallment = normalizedProvider === 'bank_installment' ||
    normalizedProvider === 'bankinstallment' ||
    normalizedMethod === 'bank_installment' ||
    normalizedMethod === 'bankinstallment';
  if (isBankInstallment) return false;

  // RULE: No refund for Cash
  if (normalizedMethod === 'cash') return false;

  // Common status check
  const isApprovedStatus = ['approved', 'success', 'paid', 'partially refunded', 'partially_refunded'].includes(
    normalizeString(status)
  );
  if (!isApprovedStatus) return false;

  // Has refundable amount
  const hasRefundableAmount = totalRefundedAmount < totalCapturedAmount;
  if (!hasRefundableAmount) return false;

  // Transaction type validation
  const isValidTransactionType =
    normalizeString(trxType) !== 'authorize' &&
    normalizeString(trxType) !== 'refund';
  if (!isValidTransactionType) return false;

  // POS-specific rules
  const isPosTransaction = normalizeString(paymentChannel) === 'pos';

  if (isPosTransaction) {
    // POS Card requires cardDataToken
    if (normalizedMethod === 'card') {
      return !!sourceOfFunds?.cardDataToken;
    }
    // POS Wallet is allowed
    if (normalizedMethod === 'wallet') {
      return true;
    }
    // Other POS methods - block by default
    return false;
  }

  // Online transactions - Card, Wallet, BNPL (Valu, Aman, Sohoola, Contact), Instapy are all allowed
  return true;
};

/**
 * Determines if capture operation is available for a transaction
 *
 * Capture Requirements:
 * - MPGS provider only
 * - Authorize transaction type (trxType === 'authorize')
 * - Status is specifically 'AUTHORIZED'
 * - Not already captured
 * - Not already voided
 */
export const isCaptureAvailableForTransaction = (transaction: TransactionDetail): boolean => {
  if (!transaction) return false;

  const {
    provider,
    status,
    transactions,
    trxType,
  } = transaction;

  const isMpgsProvider = normalizeString(provider) === 'mpgs';
  if (!isMpgsProvider) return false;

  // Status must be specifically 'authorized'
  const isAuthorizedStatus = normalizeString(status) === 'authorized';
  if (!isAuthorizedStatus) return false;

  // Transaction type must be 'authorize'
  const isAuthorizeType = normalizeString(trxType) === 'authorize';
  if (!isAuthorizeType) return false;

  // Not already captured
  const isAlreadyCaptured = transactions?.some(
    trx => normalizeString(trx.operation) === 'capture'
  );
  if (isAlreadyCaptured) return false;

  // Not voided
  const isAlreadyVoided = transaction.isVoided || normalizeString(status) === 'voided';
  if (isAlreadyVoided) return false;

  return true;
};
