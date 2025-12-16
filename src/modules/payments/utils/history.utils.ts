import { OrderDetailHistoryItem } from "@/src/modules/payments/payments.model";
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";

/**
 * Formats a history item date with full details
 * @example "13 Nov 2025 • Yesterday 11:34 AM"
 */
export const formatHistoryDate = (dateInput: string): string => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const relativeDate = formatRelativeDate(dateInput, false);
    const time = formatAMPM(dateInput);

    return `${day} ${month} ${year} • ${relativeDate} ${time}`;
};

/**
 * Extracts phone number from various sources in history item
 */
export const getPhoneNumber = (item: OrderDetailHistoryItem): string | null => {
    if (item.sourceOfFunds?.payerInfo?.mobileNumber) {
        return item.sourceOfFunds.payerInfo.mobileNumber;
    }
    if (item.sourceOfFunds?.payerAccount) {
        return item.sourceOfFunds.payerAccount;
    }
    return null;
};

/**
 * Gets user-friendly payment method name
 */
export const getPaymentMethodName = (item: OrderDetailHistoryItem, t: (key: string, options?: Record<string, any>) => string): string => {
    if (item.method === 'valu') return t('Valu');

    if (item.method === 'wallet') {
        const walletProviders: Record<string, string> = {
            vodafone: 'Vodafone Cash',
            orange: 'Orange Cash',
            etisalat: 'Etisalat Cash',
        };
        return t(walletProviders[item.provider || ''] || 'Wallet');
    }

    if (item.method === 'card') {
        const cardBrand = item.sourceOfFunds?.cardBrand || 'Card';
        const maskedCard = item.sourceOfFunds?.maskedCard || '';
        return t('using {{cardBrand}} {{maskedCard}}', { cardBrand, maskedCard });
    }
    if (item.method === 'cash') return t(`using ${item.sourceOfFunds?.type || 'Cash'}`);

    return item.method || 'Payment';
};

/**
 * Transaction operation descriptions
 */
const getTransactionDescription = (
    item: OrderDetailHistoryItem,
    t: (key: string, options?: Record<string, any>) => string,
): string => {
    const phone = getPhoneNumber(item);
    const paymentMethod = getPaymentMethodName(item, t);
    const amount = item.amount ? `${item.amount} EGP` : '';
    const status = item.status.toUpperCase();

    // Get error message from response (always use English for consistency)
    const errorMsg = item.transactionResponseMessage?.en || '';

    // Handle FAILURE status for all operations
    if (status === 'FAILURE' && errorMsg) {
        const failureMessages: Record<string, string> = {
            merchant_login: t(`Failed to initiate ${paymentMethod} service ${errorMsg}`),
            order_register: t(`Failed to register order ${errorMsg}`),
            payment_key_request: t(`Failed to verify order keys ${errorMsg}`),
            initiate_r2p: phone
                ? t(`Failed to send R2P to wallet ${phone} ${errorMsg}`)
                : t(`Failed to send R2P: ${errorMsg}`),
            verify_customer: phone
                ? t(`Failed to verify ${paymentMethod} customer using ${phone} ${errorMsg}`)
                : t(`Failed to verify customer ${errorMsg}`),
            inquiry: t(`Failed to get installment plan ${errorMsg}`),
            initiate_valu: t(`Failed to get Valu customer information ${errorMsg}`),
        };

        return failureMessages[item.operation || ''] || t(`Transaction failed: ${errorMsg}`);
    }

    // Handle SUCCESS operations
    const operationDescriptions: Record<string, string> = {
        pay: t('Successful payment {{paymentMethod}}', { paymentMethod }),
        refund: t(`Successfully refunded ${amount} due to customer request. It may take a few days for the money to reach the customer`),
        verify_customer: phone
            ? t(`${paymentMethod} client was successfuly verified using ${phone}`)
            : t('Customer verification completed'),
        inquiry: phone
            ? t(`Customer choose installment plan successfully ${phone}`)
            : t('Payment inquiry completed'),
        initiate_valu: phone
            ? t(`Succeeded getting Valu Customer Information using ${phone}`)
            : t('Valu payment initiated'),
        initiate_r2p: t(`${paymentMethod} payment initiated`),
        payment_key_request: t('Order keys verified successfully'),
        order_register: t('Order registered successfully'),
        merchant_login: t(`${paymentMethod} service initiated successfully`),
    };

    return operationDescriptions[item.operation || ''] || t(`Successful ${item.operation?.toLowerCase()} authentication attempt ${paymentMethod}`);
};

/**
 * Status-based descriptions for non-transaction items
 */
const getStatusDescription = (
    item: OrderDetailHistoryItem,
    t: (key: string, options?: Record<string, any>) => string,
): string => {
    const status = item.status.toUpperCase();

    // Handle SUCCESS/FAILURE with response messages (always use English)
    if (status === 'SUCCESS' || status === 'FAILURE') {
        if (item.transactionResponseMessage?.en) {
            return item.transactionResponseMessage.en;
        }
        return status === 'SUCCESS' ? t('Transaction successful') : t('Transaction failed');
    }

    const statusDescriptions: Record<string, string> = {
        CREATED: t('Session created'),
        OPENED: t('Payment Intent'),
        PENDING: t('New payment started'),
        PAID: t('Payment completed'),
        FAILED: t('Payment failed'),
        EXPIRED: t('Session expired'),
        REFUNDED: t('Payment refunded'),
        ABANDONED: t('This transaction was abandoned because the payment incomplete'),
    };

    return statusDescriptions[status] || t('Status updated to') + ` ${item.status}`;
};

/**
 * Gets human-readable description for a history item
 */
export const getHistoryDescription = (
    item: OrderDetailHistoryItem,
    t: (key: string, options?: Record<string, any>) => string,
): string => {
    // Transaction items (have operation and transactionId)
    if (item.operation && item.transactionId) {
        return getTransactionDescription(item, t);
    }

    // Status change items (only have status)
    return getStatusDescription(item, t);
};
