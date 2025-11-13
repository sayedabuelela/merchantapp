import FontText from '@/src/shared/components/FontText';
import {View} from 'react-native';
import {PaymentStatus} from '../payment-links.model';
import {SessionStatus, TransactionStatus} from "@/src/modules/payments/payments.model";

const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
    PAID: {backgroundColor: '#D1FFD3', color: '#1A541D'},
    TRANSFERRED: {backgroundColor: '#D1FFD3', color: '#1A541D'},
    APPROVED: {backgroundColor: '#D1FFD3', color: '#1A541D'},
    OVERDUE: {backgroundColor: '#FFEAED', color: '#A50017'},
    CANCELLED: {backgroundColor: '#F5F6F6', color: '#919C9C'},
    EXPIRED: {backgroundColor: '#F5F6F6', color: '#919C9C'},
    UNPAID: {backgroundColor: '#FFF7E8', color: '#B77801'},
    PENDING: {backgroundColor: '#FFF7E8', color: '#B77801'},
    INITIATED: {backgroundColor: '#FFF7E8', color: '#956200'},
    "AWAITING_APPROVAL": {backgroundColor: '#FFF7E8', color: '#956200'},
    REJECTED: {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    DECLINED: {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    ABANDONED: {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    REVERSED: {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    VOIDED: {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    REFUNDED: {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    "PARTIALLY_REFUNDED": {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    FAILED: {backgroundColor: "rgba(255, 234, 232, 0.5)", color: '#A50017'},
    OPENED: {backgroundColor: "#f8f9f9", color: '#556767'},
};

export default function StatusBox({status}: { status?: PaymentStatus | SessionStatus | TransactionStatus | string }) {
    if (!status) return null;
    const upperCaseStatus = status.toUpperCase();
    const style = statusStyles[upperCaseStatus] || { backgroundColor: '#F5F6F6', color: '#556767' };

    return (
        <View
            className='px-1 py-0.5 rounded-sm self-start'
            style={{backgroundColor: style.backgroundColor}}
        >
            <FontText type="body" weight="regular"
                      className={'text-[10px] text-center'}
                      style={{color: style.color}}
            >
                {upperCaseStatus?.replace(/_/g, ' ')}
            </FontText>
        </View>
    )
}