import { Link } from "expo-router"
import RecordCard, { RecordChip, RecordMetaItem } from "@/src/shared/components/cards/RecordCard"
import DualAmount from "@/src/shared/components/currency/DualAmount"
import { ArrowSmallDownIcon, ArrowSmallUpIcon, EnvelopeIcon, UserIcon } from "react-native-heroicons/outline"
import { cn } from "@/src/core/utils/cn"
import React from "react";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";
import { Transaction } from "@/src/modules/payments/payments.model";
import { PhoneIcon } from "react-native-heroicons/mini";
import { formatAMPM } from "@/src/core/utils/dateUtils";
import IconBox from "@/src/shared/components/wrappers/IconBox"
import { PressableScale } from "pressto"
import { objectHasKeys } from "@/src/core/utils/objects"
import { getEffectiveTransactionStatus } from "../../utils/posStatus.utils"

interface TransactionCardProps {
    transaction: Transaction;
    onOpenActions?: (transaction: Transaction) => void;
    // Which amount leads for virtual-origin transactions: 'virtual' in a virtual-currency view, 'egp' in the EGP view
    amountPrimary?: 'egp' | 'virtual';
}

const TransactionCard = ({ transaction, onOpenActions, amountPrimary = 'egp' }: TransactionCardProps) => {
    const {
        amount,
        currency,
        transactionId,
        merchantOrderId,
        method,
        channel,
        createdAt,
        type,
        customer,
        operation
    } = transaction;

    const effectiveStatus = getEffectiveTransactionStatus(transaction);
    const isPayment = (type === 'PAYMENT' || operation === 'pay');
    const hasCustomer = customer !== undefined && objectHasKeys(customer);

    // Built up front so an all-empty row never reserves space
    const chips = [
        { value: transactionId, uppercase: true },
        { value: merchantOrderId, uppercase: false },
    ].filter((c) => !!c.value);

    const handleLongPress = () => {
        if (onOpenActions) {
            onOpenActions(transaction);
        }
    };

    return (
        <Link href={`/payments/transaction/${transactionId}`} asChild>
            <PressableScale onLongPress={handleLongPress}>
                <RecordCard
                    leading={
                        <IconBox className={cn(
                            isPayment
                                ? 'bg-[#D1FFD3] border border-[#AEFFB2]'
                                : 'bg-[#FFEAED] border border-[#FEE4E7]'
                        )}>
                            {isPayment ? (
                                <ArrowSmallDownIcon size={10} color={'#1A541D'} />
                            ) : (
                                <ArrowSmallUpIcon size={10} color={'#A50017'} />
                            )}
                        </IconBox>
                    }
                    // The direction arrow already encodes payment vs refund, so the
                    // method/channel pair leads here, matching the order card.
                    title={method ? `${method} - ${channel}` : (type || operation)}
                    subtitle={formatAMPM(createdAt)}
                    chips={chips.length ? (
                        <>
                            {chips.map((chip) => (
                                <RecordChip key={chip.value} uppercase={chip.uppercase}>
                                    {chip.value}
                                </RecordChip>
                            ))}
                        </>
                    ) : undefined}
                    amount={
                        <DualAmount
                            amount={amount}
                            currency={currency}
                            virtualAmount={transaction.virtualAmount}
                            virtualCurrency={transaction.virtualCurrency}
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

export default TransactionCard
