import { View } from "react-native";
import { OrderDetailPayment, OrderDetailHistoryItem } from "@/src/modules/payments/payments.model";
import { useTranslation } from "react-i18next";
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";
import FontText from "@/src/shared/components/FontText";
import { useLanguage } from "@/src/core/contexts/LanguageContext";
import { BanknotesIcon, CheckIcon, ShieldCheckIcon, XMarkIcon } from "react-native-heroicons/outline";
import { ContactSettlementIcon, ValuSettlementIcon, AmanSettlementIcon, BasataSettlementIcon, SouhoolaSettlementIcon, RefundSettlementIcon } from "@/src/shared/assets/svgs";

interface Props {
    order: OrderDetailPayment;
}

interface HistoryCardProps {
    historyItem: OrderDetailHistoryItem;
}

const formatHistoryDate = (dateInput: string): string => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const relativeDate = formatRelativeDate(dateInput, false);
    const time = formatAMPM(dateInput);

    return `${day} ${month} ${year} • ${relativeDate} ${time}`;
};

const getPhoneNumber = (item: OrderDetailHistoryItem): string | null => {
    if (item.sourceOfFunds?.payerInfo?.mobileNumber) {
        return item.sourceOfFunds.payerInfo.mobileNumber;
    }
    if (item.sourceOfFunds?.payerAccount) {
        return item.sourceOfFunds.payerAccount;
    }
    return null;
};

const getPaymentMethodName = (item: OrderDetailHistoryItem): string => {
    if (item.method === 'valu') return 'Valu';
    if (item.method === 'wallet') {
        if (item.provider === 'vodafone') return 'Vodafone Cash';
        if (item.provider === 'orange') return 'Orange Cash';
        if (item.provider === 'etisalat') return 'Etisalat Cash';
        return 'Wallet';
    }
    if (item.method === 'card') return 'Card';
    if (item.method === 'cash') return 'Cash';
    return item.method || 'Payment';
};

const getHistoryDescription = (item: OrderDetailHistoryItem, t: (key: string) => string, language: string): string => {
    const phone = getPhoneNumber(item);
    const paymentMethod = getPaymentMethodName(item);

    // Transaction items (have operation and transactionId)
    if (item.operation && item.transactionId) {
        const amount = item.amount ? `${item.amount} EGP` : '';

        switch (item.operation) {
            case 'pay':
                return t(`Successful payment with ${paymentMethod}`);
            case 'refund':
                return t(`Successfully refunded ${amount} due to customer request. It may take a few days for the money to reach the customer`);
            case 'verify_customer':
                return phone
                    ? t(`${paymentMethod} client was successfuly verified using ${phone}`)
                    : t('Customer verification completed');
            case 'inquiry':
                return phone
                    ? t(`Customer choose installment plan successfully ${phone}`)
                    : t('Payment inquiry completed');
            case 'initiate_valu':
                return phone
                    ? t(`Succeeded getting Valu Customer Information using ${phone}`)
                    : t('Valu payment initiated');
            case 'initiate_r2p':
                if (item.status.toUpperCase() === 'FAILURE' && item.transactionResponseMessage) {
                    const errorMsg = language === 'ar'
                        ? item.transactionResponseMessage.ar
                        : item.transactionResponseMessage.en;
                    return phone
                        ? t(`Failed to send R2P to wallet ${phone} ${errorMsg}`)
                        : t(`Failed to send R2P: ${errorMsg}`);
                }
                return t(`${paymentMethod} payment initiated`);
            case 'payment_key_request':
                return t('Order keys verified successfully');
            case 'order_register':
                return t('Order registered successfully');
            case 'merchant_login':
                return t(`${paymentMethod} service initiated successfully`);
            default:
                return t('Transaction') + `: ${item.operation}`;
        }
    }

    // Status change items (only have status)
    switch (item.status.toUpperCase()) {
        case 'CREATED':
            return t('Session created');
        case 'OPENED':
            return t('Payment Intent');
        case 'PENDING':
            return t('New payment started');
        case 'PAID':
            return t('Payment completed');
        case 'FAILED':
            return t('Payment failed');
        case 'EXPIRED':
            return t('Session expired');
        case 'REFUNDED':
            return t('Payment refunded');
        case 'SUCCESS':
            // For transaction success, use response message if available
            if (item.transactionResponseMessage) {
                return language === 'ar'
                    ? item.transactionResponseMessage.ar
                    : item.transactionResponseMessage.en;
            }
            return t('Transaction successful');
        case 'FAILURE':
            // For transaction failure, use response message if available
            if (item.transactionResponseMessage) {
                const errorMsg = language === 'ar'
                    ? item.transactionResponseMessage.ar
                    : item.transactionResponseMessage.en;
                return errorMsg;
            }
            return t('Transaction failed');
        default:
            return t('Status updated to') + ` ${item.status}`;
    }
};

interface HistoryIconData {
    icon: React.ReactNode;
    backgroundColor: string;
}

const getHistoryIcon = (item: OrderDetailHistoryItem): HistoryIconData => {
    const method = item.method?.toLowerCase();
    const provider = item.provider?.toLowerCase();

    // 1. Handle refund operations FIRST (always show refund icon, even if successful)
    if (item.operation === 'refund') {
        return {
            icon: <RefundSettlementIcon />,
            backgroundColor: '#D5D9D9'
        };
    }

    // 2. Handle main payment success (pay operation with SUCCESS status)
    if (item.operation === 'pay' && item.status.toUpperCase() === 'SUCCESS') {
        return {
            icon: <CheckIcon size={16} color="#fff" />,
            backgroundColor: '#4AAB4E'
        };
    }

    // 3. Handle FAILURE/FAILED status (for any operation)
    if (item.status.toUpperCase() === 'FAILURE' || item.status.toUpperCase() === 'FAILED') {
        return {
            icon: <XMarkIcon size={16} color="#fff" />,
            backgroundColor: '#A50017'
        };
    }

    // 4. Handle payment method specific icons (for items with method/provider)
    // This includes operations like verify_customer, inquiry, initiate_valu, etc. with SUCCESS status

    if (method === 'valu' || provider === 'valu') {
        return {
            icon: <ValuSettlementIcon />,
            backgroundColor: '#D5D9D9'
        };
    }

    if (method === 'aman' || provider === 'aman') {
        return {
            icon: <AmanSettlementIcon />,
            backgroundColor: '#D5D9D9'
        };
    }

    if (method === 'basata' || provider === 'basata') {
        return {
            icon: <BasataSettlementIcon />,
            backgroundColor: '#D5D9D9'
        };
    }

    if (method === 'souhoola' || provider === 'souhoola') {
        return {
            icon: <SouhoolaSettlementIcon />,
            backgroundColor: '#D5D9D9'
        };
    }

    if (method === 'contact' || provider === 'contact') {
        return {
            icon: <ContactSettlementIcon />,
            backgroundColor: '#D5D9D9'
        };
    }

    // 5. Handle specific operations (for items without payment method)
    if (item.operation === 'verify_customer' || item.operation === '3dsecure') {
        return {
            icon: <ShieldCheckIcon size={16} color="#556767" />,
            backgroundColor: '#D5D9D9'
        };
    }

    // 6. Handle status-based icons (fallback for items without method/provider/operation)
    switch (item.status.toUpperCase()) {
        case 'CREATED':
            return {
                icon: <BanknotesIcon size={16} color="#556767" />,
                backgroundColor: '#D5D9D9'
            };
        case 'OPENED':
            return {
                icon: <BanknotesIcon size={16} color="#556767" />,
                backgroundColor: '#D5D9D9'
            };
        case 'PENDING':
            return {
                icon: <BanknotesIcon size={16} color="#556767" />,
                backgroundColor: '#D5D9D9'
            };
        default:
            // Default icon for any other status
            return {
                icon: <BanknotesIcon size={16} color="#556767" />,
                backgroundColor: '#D5D9D9'
            };
    }
};

const HistoryCard = ({ historyItem }: HistoryCardProps) => {
    const { t } = useTranslation();
    const { currentLanguage } = useLanguage();

    const description = getHistoryDescription(historyItem, t, currentLanguage);
    const formattedDate = formatHistoryDate(historyItem.date);
    const { icon, backgroundColor } = getHistoryIcon(historyItem);

    // Build the header with date and optional transaction ID
    const header = historyItem.transactionId
        ? `${formattedDate} • ${historyItem.transactionId}`
        : formattedDate;

    return (
        <View className="flex-row items-start p-4 rounded border border-tertiary mb-2 gap-x-4">
            {/* status icon */}
            <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor }}
            >
                {icon}
            </View>
            <View className="flex-1">
                <FontText
                    type="body"
                    weight="regular"
                    className="text-sm text-content-secondary self-start mb-1"
                >
                    {header}
                </FontText>
                <FontText
                    type="body"
                    weight="regular"
                    className="text-sm text-content-primary self-start"
                >
                    {description}
                </FontText>
            </View>
        </View>
    );
};

const HistoryTab = ({ order }: Props) => {
    const { t } = useTranslation();

    const history = order.history || [];

    if (history.length === 0) {
        return (
            <View className="p-4 items-center justify-center">
                <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                    {t('No history available')}
                </FontText>
            </View>
        );
    }

    return (
        <View className="mt-4">
            {history.map((item, index) => (
                <HistoryCard key={`${item.date}-${index}`} historyItem={item} />
            ))}
        </View>
    );
};

export default HistoryTab;
