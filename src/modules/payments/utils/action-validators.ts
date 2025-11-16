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
  nbe: { hour: 21, minute: 0 },     // National Bank of Egypt - 9:00 PM
  cib: { hour: 21, minute: 0 },     // Commercial International Bank - 9:00 PM
  alex: { hour: 23, minute: 59 },   // Bank of Alexandria - 11:59 PM
  aaib: { hour: 23, minute: 59 },   // Arab African International Bank - 11:59 PM
  misr: { hour: 23, minute: 59 },   // Banque Misr - 11:59 PM
  saib: { hour: 23, minute: 59 },   // Société Arabe Internationale de Banque - 11:59 PM
  fab: { hour: 23, minute: 59 },    // First Abu Dhabi Bank - 11:59 PM
  anz: { hour: 23, minute: 59 },    // ANZ Bank - 11:59 PM
} as const;

type BankName = keyof typeof MPGS_VOID_WINDOWS;

/**
 * Normalizes strings for comparison (trim + lowercase)
 */
const normalizeString = (str?: string | null): string =>
  (str ?? '').trim().toLowerCase();

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
 * Void Requirements:
 * - MPGS provider only
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
  } = order;

  const transactionDate = new Date(createdAt);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  const isMpgsProvider = normalizeString(provider) === 'mpgs';

  const isPaymentType = normalizeString(lastTransactionType)
    ? ['payment', 'pay', 'دفع', 'authorize', 'capture'].includes(normalizeString(lastTransactionType))
    : false;

  const isApprovedTransaction = [
    'approved',
    'success',
    'paid',
    'authorized',
  ].includes(normalizeString(status));

  const isTotalRefundAmountEqualZero = refundedAmount === 0;

  const isAlreadyVoided = normalizeString(status) === 'voided';

  const isRfsDateEqualZero = pcc?.rfs_due_after === 0;

  const isValidBankVoidWindow = bankCutOffChecker(
    pcc?.financial_institution as BankName,
    transactionDate
  );

  const isAuthorizeAndCaptured =
    normalizeString(lastTransactionType) === 'authorize' &&
    history?.some(trx => normalizeString(trx.operation) === 'capture');

  return (
    isMpgsProvider &&
    isPaymentType &&
    isApprovedTransaction &&
    isTotalRefundAmountEqualZero &&
    !isAlreadyVoided &&
    !isRfsDateEqualZero &&
    isValidBankVoidWindow &&
    !isAuthorizeAndCaptured
  );
};

/**
 * Determines if refund operation is available for an order
 *
 * Refund Requirements:
 * - Status is approved or success
 * - Not a POS transaction (unless POS refund is available)
 * - Payment method is not cash
 * - No installment details (excludes VALU)
 * - Has refundable amount (totalRefundedAmount < totalCapturedAmount)
 * - Transaction type is not 'authorize' or 'refund'
 *
 * POS Refund Exception:
 * - POS transactions are refundable if:
 *   - Payment method is card
 *   - cardDataToken exists in sourceOfFunds
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
  } = order;

  const isApprovedStatus = ['approved', 'success', 'paid'].includes(
    normalizeString(status)
  );

  const isPosTransaction = normalizeString(paymentChannel) === 'pos';

  const isPosRefundAvailable =
    isPosTransaction &&
    normalizeString(method) === 'card' &&
    !!sourceOfFunds?.cardDataToken;

  const isCashPayment = normalizeString(method) === 'cash';

  const hasInstallmentDetails = !!sourceOfFunds?.payerInfo; // VALU installment

  const hasRefundableAmount = refundedAmount < capturedAmount;

  const isValidTransactionType =
    normalizeString(lastTransactionType) !== 'authorize' &&
    normalizeString(lastTransactionType) !== 'refund';

  return (
    isApprovedStatus &&
    (!isPosTransaction || isPosRefundAvailable) &&
    !isCashPayment &&
    !hasInstallmentDetails &&
    hasRefundableAmount &&
    isValidTransactionType
  );
};

/**
 * Determines if capture operation is available for an order
 *
 * Capture Requirements:
 * - MPGS provider only
 * - Authorize transaction type
 * - Approved/success/paid/authorized status
 * - Not already captured
 * - Not already voided
 * - Latest transaction type is 'authorize'
 */
export const isCaptureAvailable = (order: OrderDetailPayment): boolean => {
  if (!order) return false;

  const {
    createdAt,
    provider,
    status,
    history,
    lastTransactionType,
  } = order;

  const transactionDate = new Date(createdAt);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  const isMpgsProvider = normalizeString(provider) === 'mpgs';

  const isAuthorizeType = normalizeString(lastTransactionType) === 'authorize';

  const isApprovedTransaction = [
    'approved',
    'success',
    'paid',
    'authorized',
  ].includes(normalizeString(status));

  const isAlreadyCaptured = history?.some(
    trx => normalizeString(trx.operation) === 'capture'
  );

  const isAlreadyVoided = normalizeString(status) === 'voided';

  const isLatestTransactionIsAuthorize =
    normalizeString(lastTransactionType) === 'authorize' ||
    !!(history && history.length > 0 &&
     normalizeString(history[history.length - 1]?.operation) === 'authorize');

  return (
    isMpgsProvider &&
    isAuthorizeType &&
    isApprovedTransaction &&
    !isAlreadyCaptured &&
    isLatestTransactionIsAuthorize &&
    !isAlreadyVoided
  );
};

// ============================================================================
// Transaction Validators (for TransactionDetail type)
// ============================================================================

/**
 * Determines if void operation is available for a transaction
 *
 * Same requirements as order void but adapted for TransactionDetail structure
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
  } = transaction;

  const transactionDate = new Date(date);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  const isMpgsProvider = normalizeString(provider) === 'mpgs';

  const isPaymentType = normalizeString(trxType)
    ? ['payment', 'pay', 'دفع', 'authorize', 'capture'].includes(normalizeString(trxType))
    : false;

  const isApprovedTransaction = [
    'approved',
    'success',
    'paid',
    'authorized',
  ].includes(normalizeString(status));

  const isTotalRefundAmountEqualZero = totalRefundedAmount === 0;

  const isAlreadyVoided = transaction.isVoided || normalizeString(status) === 'voided';

  const isRfsDateEqualZero = pcc?.rfs_due_after === 0;

  const isValidBankVoidWindow = bankCutOffChecker(
    pcc?.financial_institution as BankName,
    transactionDate
  );

  const isAuthorizeAndCaptured =
    normalizeString(trxType) === 'authorize' &&
    transactions?.some(trx => normalizeString(trx.operation) === 'capture');

  return (
    isMpgsProvider &&
    isPaymentType &&
    isApprovedTransaction &&
    isTotalRefundAmountEqualZero &&
    !isAlreadyVoided &&
    !isRfsDateEqualZero &&
    isValidBankVoidWindow &&
    !isAuthorizeAndCaptured
  );
};

/**
 * Determines if refund operation is available for a transaction
 *
 * Same requirements as order refund but adapted for TransactionDetail structure
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
  } = transaction;

  const isApprovedStatus = ['approved', 'success', 'paid'].includes(
    normalizeString(status)
  );

  const isPosTransaction = normalizeString(paymentChannel) === 'pos';

  const isPosRefundAvailable =
    isPosTransaction &&
    normalizeString(method) === 'card' &&
    !!sourceOfFunds?.cardDataToken;

  const isCashPayment = normalizeString(method) === 'cash';

  const hasInstallmentDetails = !!sourceOfFunds?.payerInfo; // VALU installment

  const hasRefundableAmount = totalRefundedAmount < totalCapturedAmount;

  const isValidTransactionType =
    normalizeString(trxType) !== 'authorize' &&
    normalizeString(trxType) !== 'refund';

  return (
    isApprovedStatus &&
    (!isPosTransaction || isPosRefundAvailable) &&
    !isCashPayment &&
    !hasInstallmentDetails &&
    hasRefundableAmount &&
    isValidTransactionType
  );
};
