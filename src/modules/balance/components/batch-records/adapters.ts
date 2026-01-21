import { ActivityRecord, TransactionRecord } from "../../balance.model";
import { Transaction } from "@/src/modules/payments/payments.model";

/**
 * Props interface for ActivityCard component
 */
export interface ActivityCardProps {
  _id: string;
  operation: string;
  origin: string;
  amount: number;
  createdAt: string;
  accountName: string;
  currency: string;
  fromBalance?: boolean;
}

/**
 * Adapts ActivityRecord (from batch API) to ActivityCard props
 */
export const adaptActivityRecordToCardProps = (
  record: ActivityRecord,
  accountName?: string
): ActivityCardProps => ({
  _id: record.recordId,
  operation: record.recordOperation,
  origin: record.originReference ?? "payout",
  amount: record.recordAmount,
  createdAt: record.recordCreatedAt,
  accountName: accountName ?? record.accountId ?? "",
  currency: "EGP",
  fromBalance: true,
});

/**
 * Adapts TransactionRecord (from batch API) to Transaction type for TransactionCard
 * Only maps fields needed for card display
 */
export const adaptTransactionRecordToTransaction = (
  record: TransactionRecord
): Transaction => ({
  _id: record.transactionId,
  transactionId: record.transactionId,
  amount: record.amount ?? record.recordAmount ?? 0,
  currency: "EGP",
  method: record.method ?? "",
  channel: record.channel ?? "",
  createdAt: record.transactionDate ?? record.recordCreatedAt ?? "",
  operation: record.operation,
  type: record.operation === "pay" ? "PAYMENT" : "REFUND",
  status: "Approved", // Batch records are already settled
  // Required fields with defaults for card display
  isManualRefund: false,
  isPOSPortalRefund: false,
  labels: [],
  merchantId: "",
  storeName: "",
  orderReference: record.orderId ?? "",
  merchantOrderId: "",
  totalCapturedAmount: record.amount ?? 0,
  totalRefundedAmount: 0,
  totalAuthorizedAmount: "",
  sourceOfFunds: {},
  paymentType: "",
  paymentAgreement: "",
  provider: "",
  id: record.transactionId,
  lastStatus: "CAPTURED",
  isVoided: false,
  isCancelled: false,
  dateToFilter: "",
  date: "",
  responseDate: "",
  formattedDate: "",
  dateTime: record.transactionDate ?? "",
  lastModifiedDate: "",
  issuer: "",
  issuerAuthorizationCode: null,
  transactionResponseCode: "",
  transactionResponseMessage: { en: "", ar: "" },
  pcc: { operations: [] },
  transactions: [],
  __v: 0,
});

/**
 * Type guard for ActivityRecord
 */
export const isActivityRecord = (
  record: ActivityRecord | TransactionRecord
): record is ActivityRecord => record.type === "record";

/**
 * Type guard for TransactionRecord
 */
export const isTransactionRecord = (
  record: ActivityRecord | TransactionRecord
): record is TransactionRecord => record.type === "transaction";
