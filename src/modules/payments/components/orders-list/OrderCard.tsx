import { formatAMPM } from "@/src/core/utils/dateUtils"
import { objectHasKeys } from "@/src/core/utils/objects"
import StatusBox from "@/src/modules/payment-links/components/StatusBox"
import { PaymentSession } from "@/src/modules/payments/payments.model"
import RecordCard, { RecordChip, RecordMetaItem } from "@/src/shared/components/cards/RecordCard"
import DualAmount from "@/src/shared/components/currency/DualAmount"
import { getEffectiveOrderStatus } from "../../utils/posStatus.utils"
import { Link } from "expo-router"
import { PressableScale } from "pressto"
import React from "react"
import { EnvelopeIcon, PhoneIcon, UserIcon } from "react-native-heroicons/outline"


interface OrderCardProps {
    payment: PaymentSession;
    onOpenActions?: (payment: PaymentSession) => void;
    // Which amount leads for virtual-origin sessions: 'virtual' in a virtual-currency view, 'egp' in the EGP view
    amountPrimary?: 'egp' | 'virtual';
}

const OrderCard = ({ payment, onOpenActions, amountPrimary = 'egp' }: OrderCardProps) => {
    const { paymentParams, lastTransactionId, _id, updatedAt, method } = payment;
    const effectiveStatus = getEffectiveOrderStatus(payment);
    const customer = paymentParams.customer;
    const hasCustomer = customer !== undefined && objectHasKeys(customer);

    const source =
        paymentParams.interactionSource === 'ECOMMERCE' || paymentParams.interactionSource === undefined
            ? 'Online'
            : paymentParams.interactionSource;

    // Built up front so an all-empty row never reserves space
    const chips = [lastTransactionId, paymentParams.order].filter(Boolean) as string[];

    const handleLongPress = () => {
        if (onOpenActions) {
            onOpenActions(payment);
        }
    };

    return (
        <Link href={`/payments/${_id}`} asChild>
            <PressableScale onLongPress={handleLongPress}>
                <RecordCard
                    title={method ? `${method} - ${source}` : undefined}
                    subtitle={formatAMPM(updatedAt)}
                    chips={chips.length ? (
                        <>
                            {chips.map((chip) => (
                                <RecordChip key={chip}>{chip}</RecordChip>
                            ))}
                        </>
                    ) : undefined}
                    amount={
                        <DualAmount
                            amount={paymentParams.amount}
                            currency={paymentParams.currency}
                            virtualAmount={paymentParams.virtualAmount}
                            virtualCurrency={paymentParams.virtualCurrency}
                            primary={amountPrimary}
                            size="sm"
                            className="items-end"
                        />
                    }
                    status={<StatusBox status={effectiveStatus} />}
                    meta={hasCustomer ? (
                        <>
                            <RecordMetaItem icon={<UserIcon size={12} color="#556767" />}>
                                {customer?.firstName
                                    ? `${customer.firstName} ${customer.lastName ?? ''}`.trim()
                                    : ''}
                            </RecordMetaItem>
                            <RecordMetaItem icon={<PhoneIcon size={12} color="#556767" />}>
                                {customer?.mobilePhone}
                            </RecordMetaItem>
                            <RecordMetaItem icon={<EnvelopeIcon size={12} color="#556767" />}>
                                {customer?.email}
                            </RecordMetaItem>
                        </>
                    ) : null}
                />
            </PressableScale>
        </Link>
    )
}

export default OrderCard
