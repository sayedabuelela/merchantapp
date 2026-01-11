import { cn } from "@/src/core/utils/cn"
import { formatAMPM } from "@/src/core/utils/dateUtils"
import { currencyNumber } from "@/src/core/utils/number-fields"
import { objectHasKeys } from "@/src/core/utils/objects"
import StatusBox from "@/src/modules/payment-links/components/StatusBox"
import { PaymentSession } from "@/src/modules/payments/payments.model"
import FontText from "@/src/shared/components/FontText"
import { Link } from "expo-router"
import { PressableScale } from "pressto"
import React from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { EnvelopeIcon, PhoneIcon, UserIcon } from "react-native-heroicons/outline"


interface OrderCardProps {
    payment: PaymentSession;
    onOpenActions?: (payment: PaymentSession) => void;
}

const OrderCard = ({ payment, onOpenActions }: OrderCardProps) => {
    const { t } = useTranslation();
    const { paymentParams, status, capturedAmount, targetTransactionId, lastTransactionId, _id, createdAt, method } = payment;
    const isPaid = status === 'PAID';

    const handleLongPress = () => {
        if (onOpenActions) {
            onOpenActions(payment);
        }
    };

    return (
        <Link href={`/payments/${_id}`} asChild>
            <PressableScale onLongPress={handleLongPress}>
                <View className="border-[1.5px] rounded border-tertiary p-4 mb-2 ">
                    <View className="flex-row items-center justify-between mb-1">
                        {/* <View className="flex-row items-center gap-x-2">
                            <IconBox className={cn(isPaid ? 'bg-[#D1FFD3] border border-[#AEFFB2]' : 'bg-[#FFEAED] border border-[#FEE4E7]')}>
                                {isPaid ? (
                                    <ArrowSmallDownIcon size={10} color={'#1A541D'} />
                                ) : (
                                    <ArrowSmallUpIcon size={10} color={'#A50017'} />
                                )}
                            </IconBox>
                        </View> */}
                        {method && (
                            <FontText type="body" weight="regular" className="text-content-primary text-xs ">
                                <FontText type="body" weight="regular"
                                    className="text-content-primary text-xs capitalize">
                                    {method}
                                </FontText>
                                {' - '}{(paymentParams.interactionSource === 'ECOMMERCE' || paymentParams.interactionSource === undefined) ? 'Online' : paymentParams.interactionSource}
                            </FontText>
                        )}
                        <FontText type="body" weight="bold"
                            className={cn("text-content-primary text-sm", !method && 'ml-auto')}>
                            {currencyNumber(paymentParams.amount)} {t(paymentParams.currency)}
                        </FontText>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {formatAMPM(createdAt)}
                        </FontText>
                        <StatusBox status={status} />
                    </View>

                    <View className="flex-row items-center gap-x-1 mt-2">
                        {lastTransactionId && (
                            <FontText type="body" weight="regular"
                                className="text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary"
                            >
                                {lastTransactionId}
                            </FontText>
                        )}
                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary">
                            {paymentParams.order}
                        </FontText>
                    </View>
                    {(paymentParams.customer !== undefined && objectHasKeys(paymentParams.customer)) && (
                        <View className="gap-y-2 border-t border-tertiary pt-2 mt-2">
                            <View className="flex-row items-center gap-x-4">
                                {paymentParams.customer?.firstName && (
                                    <View className="flex-row items-center gap-x-1">
                                        <UserIcon size={10} color="#556767" />
                                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                            {`${paymentParams.customer?.firstName} ${paymentParams.customer?.lastName !== undefined ? paymentParams.customer?.lastName : ''}`}
                                        </FontText>
                                    </View>
                                )}
                                {paymentParams.customer?.mobilePhone && (
                                    <View className="flex-row items-center gap-x-1">
                                        <PhoneIcon size={10} color="#556767" />
                                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                            {paymentParams.customer?.mobilePhone}
                                        </FontText>
                                    </View>
                                )}
                            </View>
                            {paymentParams.customer?.email && (
                                <View className="flex-row items-center gap-x-1">
                                    <EnvelopeIcon size={10} color="#556767" />
                                    <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                        {paymentParams.customer?.email}
                                    </FontText>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </PressableScale>
        </Link>
    )
}

export default OrderCard