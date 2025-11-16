import { MPGS_VOID_WINDOWS } from '@app/pages/portals/merchant/transactions/models/transaction.models';

const normalizeString = (str?: string): string =>
  (str ?? '').trim().toLowerCase();

const bankCutOffChecker = (
  bankName: keyof typeof MPGS_VOID_WINDOWS | undefined,
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

export const isVoidOptionAvailable = (transaction: {
  date: string;
  provider: string;
  trxType?: string;
  type?: string;
  status?: string;
  totalRefundedAmount: number;
  isVoided: boolean;
  pcc?: {
    rfs_due_after: number;
    financial_institution: keyof typeof MPGS_VOID_WINDOWS;
  };
  amount?: number;
  transactions?: any[];
}): boolean => {
  if (!transaction) return false;

  const {
    date,
    provider,
    trxType,
    type,
    status,
    totalRefundedAmount,
    isVoided,
    pcc,
    transactions,
  } = transaction;

  const transactionDate = new Date(date);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  const isMpgsProvider = normalizeString(provider) === 'mpgs';
  const isPaymentType = [trxType, type].some(t =>
    ['payment', 'دفع', 'authorize', 'capture'].includes(normalizeString(t))
  );
  const isApprovedTransaction = [
    'approved',
    'success',
    'paid',
    'authorized',
  ].includes(normalizeString(status));
  const isTotalRefundAmountEqualZero = totalRefundedAmount === 0;
  const isAlreadyVoided = isVoided;
  const isRfsDateEqualZero = pcc?.rfs_due_after === 0;
  const isValidBankVoidWindow = bankCutOffChecker(
    pcc?.financial_institution,
    transactionDate
  );
  const isAuthorizeAndCaptured =
    [trxType, type].some(t => ['authorize'].includes(normalizeString(t))) &&
    transactions?.find(trx => trx.operation === 'capture');

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
export const isCaptureOptionAvailable = (transaction: {
  date: string;
  provider: string;
  trxType?: string;
  type?: string;
  status?: string;
  isVoided: boolean;
  amount?: number;
  transactions?: any[];
  lastTransactionType?: string;
}): boolean => {
  if (!transaction) return false;

  const {
    date,
    provider,
    trxType,
    type,
    status,
    isVoided,
    transactions,
    lastTransactionType,
  } = transaction;

  const transactionDate = new Date(date);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  const isMpgsProvider = normalizeString(provider) === 'mpgs';
  const isPaymentType = [trxType, type].some(t =>
    ['authorize'].includes(normalizeString(t))
  );
  const isApprovedTransaction = [
    'approved',
    'success',
    'paid',
    'authorized',
  ].includes(normalizeString(status));
  const isAlreadyCaptured = transactions?.find(
    trx => trx.operation === 'capture'
  );
  const isAlreadyVoided = isVoided;
  const isLatestTransactionIsAuthorize =
    (lastTransactionType && lastTransactionType === 'authorize') ||
    transactions?.[transactions.length - 1]?.operation === 'authorize' ||
    false;

  return (
    isMpgsProvider &&
    isPaymentType &&
    isApprovedTransaction &&
    !isAlreadyCaptured &&
    isLatestTransactionIsAuthorize &&
    !isAlreadyVoided
  );
};
