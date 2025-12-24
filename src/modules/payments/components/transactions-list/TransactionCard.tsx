import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import FontText from "@/src/shared/components/FontText"
import { currencyNumber } from "@/src/core/utils/number-fields"
import { ArrowSmallDownIcon, ArrowSmallUpIcon, EnvelopeIcon, UserIcon } from "react-native-heroicons/outline"
import { useTranslation } from "react-i18next"
import { cn } from "@/src/core/utils/cn"
import React from "react";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";
import { Transaction } from "@/src/modules/payments/payments.model";
import { PhoneIcon } from "react-native-heroicons/mini";
import { formatAMPM } from "@/src/core/utils/dateUtils";
import IconBox from "@/src/shared/components/wrappers/IconBox"
import { PressableScale } from "pressto"

// const IconBox = ({ children }: { children: React.ReactNode }) => {
//     return (
//         <View className="w-4 h-4 p-0.5 rounded-full bg-tertiary items-center justify-center">
//             {children}
//         </View>
//     )
// }

interface TransactionCardProps {
    transaction: Transaction;
    onOpenActions?: (transaction: Transaction) => void;
}

const TransactionCard = ({ transaction, onOpenActions }: TransactionCardProps) => {
    const { t } = useTranslation();
    const {
        _id,
        status,
        amount,
        currency,
        totalCapturedAmount,
        transactionId,
        orderReference,
        merchantOrderId,
        storeName,
        dateTime,
        method,
        channel,
        createdAt,
        provider,
        type,
        transactionResponseMessage
    } = transaction;

    const isApproved = status === 'Approved';
    const isPayment = type === 'PAYMENT';
    const isRefund = type === 'REFUND';
    const is3DSecureVerify = type === '3DSECURE_VERIFY';


    const handleLongPress = () => {
        if (onOpenActions) {
            onOpenActions(transaction);
        }
    };
    console.log('status : ', status);
    return (
        <Link href={`/payments/transaction/${transactionId}`} asChild>
            <PressableScale onLongPress={handleLongPress}>
                <View className="border-[1.5px] rounded border-tertiary p-4 mb-2 ">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-x-2">
                            <IconBox className={cn(
                                (isPayment && isApproved)
                                    ? 'bg-[#D1FFD3] border border-[#AEFFB2]'
                                    : 'bg-[#FFEAED] border border-[#FEE4E7]'
                            )}>
                                {(isPayment && isApproved) ? (
                                    <ArrowSmallDownIcon size={10} color={'#1A541D'} />
                                ) : (
                                    <ArrowSmallUpIcon size={10} color={'#A50017'} />
                                )}
                            </IconBox>

                            <FontText type="body" weight="regular"
                                className="text-content-secondary text-xs capitalize">
                                {type}
                            </FontText>

                        </View>
                        <FontText type="body" weight="bold"
                            className={cn("text-content-primary text-sm")}>
                            {currencyNumber(amount)} {t(currency)}
                        </FontText>
                    </View>
                    {/* method and channel */}
                    <View className="flex-row items-center justify-between">
                        {method && (
                            <FontText type="body" weight="regular"
                                className="text-content-primary text-xs capitalize">
                                {method} - {channel}
                            </FontText>
                        )}
                        <StatusBox status={status} />
                    </View>
                    {/* <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                    {t('To')} {'Account Name'}
                </FontText> */}
                    <FontText type="body" weight="regular" className="text-content-secondary text-xs mb-2 mt-1">
                        {/* {type} .  */}
                        {formatAMPM(createdAt)}
                    </FontText>
                    <View className="flex-row items-center">
                        {transactionId && (
                            <FontText type="body" weight="regular"
                                className="text-content-secondary text-[10px] uppercase mr-1 bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary">
                                {transactionId}
                            </FontText>
                        )}
                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary">
                            {merchantOrderId}
                        </FontText>
                    </View>
                    {/* <View className="gap-y-2 border-t border-tertiary pt-2 mt-2">
                    <View className="flex-row items-center gap-x-4">
                        <View className="flex-row items-center gap-x-1">
                            <UserIcon size={10} color="#556767"/>
                            <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                Customer Name
                            </FontText>
                        </View>
                        <View className="flex-row items-center gap-x-1">
                            <PhoneIcon size={10} color="#556767"/>
                            <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                01012345678
                            </FontText>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-x-1">
                        <EnvelopeIcon size={10} color="#556767"/>
                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                            sabu@email.com
                        </FontText>
                    </View>
                </View> */}
                </View>
            </PressableScale>
        </Link>
    )
}

export default TransactionCard
