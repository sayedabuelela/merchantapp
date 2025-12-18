import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import { SessionStatus, TransactionStatus } from '../../payments.model';

interface StatusBadgeProps {
    status: SessionStatus | TransactionStatus | string;
    type?: 'order' | 'transaction';
}

/**
 * Colored status badge for orders and transactions
 */
export const StatusBadge = ({ status, type = 'order' }: StatusBadgeProps) => {
    const getStatusStyles = () => {
        const upperStatus = status.toUpperCase();

        // Order statuses
        if (type === 'order') {
            switch (upperStatus) {
                case 'PAID':
                    return { bg: 'bg-[#D1FFD3]', text: 'text-[#1A541D]' };
                case 'OPENED':
                case 'PENDING':
                    return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' };
                case 'FAILED':
                case 'EXPIRED':
                    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
                case 'REFUNDED':
                case 'PARTIALLY REFUND':
                case 'REFUND PENDING':
                    return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' };
                case 'VOIDED':
                case 'REVERSED':
                    return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
                default:
                    return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
            }
        }

        // Transaction statuses
        switch (upperStatus) {
            case 'APPROVED':
                return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
            case 'PENDING':
                return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' };
            case 'DECLINED':
            case 'REJECTED':
                return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
            case 'VOIDED':
            case 'CANCELLED':
                return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
            default:
                return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
        }
    };

    const styles = getStatusStyles();

    return (
        <View className={cn('px-2 py-0.5 rounded-sm', styles.bg)}>
            <FontText type="body" weight="regular" className={cn('text-xs text-center', styles.text)}>
                {status}
            </FontText>
        </View>
    );
};
