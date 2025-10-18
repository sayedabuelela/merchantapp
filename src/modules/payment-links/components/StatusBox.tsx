import FontText from '@/src/shared/components/FontText';
import { View } from 'react-native';
import { PaymentStatus } from '../payment-links.model';

const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
    PAID: { backgroundColor: '#D1FFD3', color: '#1A541D' },
    OVERDUE: { backgroundColor: '#FFEAED', color: '#A50017' },
    CANCELLED: { backgroundColor: '#F5F6F6', color: '#919C9C' },
    EXPIRED: { backgroundColor: '#F5F6F6', color: '#919C9C' },
    UNPAID: { backgroundColor: '#FFF7E8', color: '#956200' },
    INITIATED: { backgroundColor: '#FFF7E8', color: '#956200' },
    "AWAITING_APPROVAL": { backgroundColor: '#FFF7E8', color: '#956200' },
    REJECTED: { backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017' },
};

export default function StatusBox({ status }: { status?: PaymentStatus }) {
    if (!status) return null;
    const upperCaseStatus = status.toUpperCase();
    return (
        <View
            className='px-1 py-0.5 rounded-sm self-start mt-0.5'
            style={{ backgroundColor: statusStyles[upperCaseStatus].backgroundColor }}
        >
            <FontText type="body" weight="regular"
                className={'text-xs text-center'}
                style={{ color: statusStyles[upperCaseStatus].color, }}
            >
                {upperCaseStatus?.replace(/_/g, ' ')}
            </FontText>
        </View>
    )
}
