import { CheckIcon, ShieldCheckIcon, XMarkIcon, BanknotesIcon, EnvelopeIcon, ShoppingCartIcon } from "react-native-heroicons/outline";
import {
    ContactSettlementIcon,
    ValuSettlementIcon,
    AmanSettlementIcon,
    BasataSettlementIcon,
    SouhoolaSettlementIcon,
    RefundSettlementIcon,
    ContactHistoryIcon,
    ValuHistoryIcon,
    AmanHistoryIcon,
    SouhoolaHistoryIcon
} from "@/src/shared/assets/svgs";
import { OrderDetailHistoryItem, RelatedTransaction } from "@/src/modules/payments/payments.model";

export interface HistoryIconData {
    icon: React.ReactNode;
    backgroundColor: string;
}

// Color constants - exported for reuse
export const COLORS = {
    SUCCESS: '#4AAB4E',
    FAILURE: '#A50017',
    NEUTRAL: '#D5D9D9',
    ICON_GRAY: '#556767',
    ICON_WHITE: '#fff',
} as const;

// Icon configurations - exported for reuse
export const ICONS = {
    SUCCESS: <CheckIcon size={16} color={COLORS.ICON_WHITE} />,
    FAILURE: <XMarkIcon size={16} color={COLORS.ICON_WHITE} />,
    SHIELD: <ShieldCheckIcon size={16} color={COLORS.ICON_GRAY} />,
    ENVELOPE: <EnvelopeIcon size={16} color={COLORS.ICON_GRAY} />,
    BANKNOTES: <BanknotesIcon size={16} color={COLORS.ICON_GRAY} />,
    REFUND: <RefundSettlementIcon />,
    VALU: <ValuHistoryIcon />,
    AMAN: <AmanHistoryIcon />,
    BASATA: <BasataSettlementIcon />,
    SOUHOOLA: <SouhoolaHistoryIcon />,
    CONTACT: <ContactHistoryIcon />,
    ABANDONED: <ShoppingCartIcon size={16} color={COLORS.ICON_WHITE} />,
} as const;

/**
 * Administrative operations that happen before actual payment
 * These operations are for setup, registration, and verification
 */
const ADMINISTRATIVE_OPERATIONS = [
    'merchant_login',
    'order_register',
    'payment_key_request',
] as const;

/**
 * Creates a neutral icon configuration with gray background
 */
const createNeutralIcon = (icon: React.ReactNode): HistoryIconData => ({
    icon,
    backgroundColor: COLORS.NEUTRAL,
});

/**
 * Payment method to icon mapping
 */
const PAYMENT_METHOD_ICONS: Record<string, HistoryIconData> = {
    valu: createNeutralIcon(ICONS.VALU),
    aman: createNeutralIcon(ICONS.AMAN),
    basata: createNeutralIcon(ICONS.BASATA),
    souhoola: createNeutralIcon(ICONS.SOUHOOLA),
    contact: createNeutralIcon(ICONS.CONTACT),
};

/**
 * Gets the appropriate icon for a payment method or provider
 */
const getPaymentMethodIcon = (item: OrderDetailHistoryItem): HistoryIconData | null => {
    const method = item.method?.toLowerCase();
    const provider = item.provider?.toLowerCase();
    console.log('method : ',method);
    console.log('provider : ',provider);
    
    return PAYMENT_METHOD_ICONS[method || ''] || PAYMENT_METHOD_ICONS[provider || ''] || null;
};

/**
 * Gets the appropriate icon for a history item based on operation, status, and payment method
 */
export const getHistoryIcon = (item: OrderDetailHistoryItem): HistoryIconData => {
    const status = item.status.toUpperCase();

    // 1. Handle refund operations FIRST (always show refund icon, even if successful)
    if (item.operation === 'refund') {
        return createNeutralIcon(ICONS.REFUND);
    }

    // 2. Handle main payment success (pay operation with SUCCESS status)
    if (item.operation === 'pay' && status === 'SUCCESS') {
        return {
            icon: ICONS.SUCCESS,
            backgroundColor: COLORS.SUCCESS,
        };
    }

    // 3. Handle FAILURE/FAILED status (for any operation)
    if (status === 'FAILURE' || status === 'FAILED' || status === 'ABANDONED') {
        return {
            icon: status === 'ABANDONED' ? ICONS.ABANDONED : ICONS.FAILURE,
            backgroundColor: COLORS.FAILURE,
        };
    }

    // 4. Handle administrative operations (setup, registration, verification)
    if (item.operation && ADMINISTRATIVE_OPERATIONS.includes(item.operation as any)) {
        return createNeutralIcon(ICONS.ENVELOPE);
    }

    // 5. Handle payment method specific icons (for items with method/provider)
    const methodIcon = getPaymentMethodIcon(item);
    if (methodIcon) {
        return methodIcon;
    }

    // 6. Handle specific operations (for items without payment method)
    if (item.operation === 'verify_customer' || item.operation === '3dsecure') {
        return createNeutralIcon(ICONS.SHIELD);
    }

    // 7. Default fallback icon
    return createNeutralIcon(ICONS.BANKNOTES);
};

/**
 * Gets the appropriate icon for a transaction history item (RelatedTransaction)
 * Simplified version for transaction history which doesn't have as many operation types
 */
export const getTransactionHistoryIcon = (item: RelatedTransaction): HistoryIconData => {
    const operation = item.operation?.toLowerCase();
    const status = item.status;

    // 1. Handle refund operations first (always show refund icon)
    if (operation === 'refund') {
        return createNeutralIcon(ICONS.REFUND);
    }

    // 2. Handle main payment success (pay operation with SUCCESS status)
    if (operation === 'pay' && status === 'SUCCESS') {
        return {
            icon: ICONS.SUCCESS,
            backgroundColor: COLORS.SUCCESS,
        };
    }

    // 3. Handle FAILURE/FAILED status (for any operation)
    if (status === 'FAILURE' || status === 'FAILED') {
        return {
            icon: ICONS.FAILURE,
            backgroundColor: COLORS.FAILURE,
        };
    }

    // 4. Default fallback
    return createNeutralIcon(ICONS.BANKNOTES);
};
