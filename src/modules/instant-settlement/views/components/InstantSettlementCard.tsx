import { cn } from "@/src/core/utils/cn"
import { formatAMPM } from "@/src/core/utils/dateUtils"
import { currencyNumber } from "@/src/core/utils/number-fields"
import { CheckBoxSquareEmptyIcon, CheckBoxSquareFilledIcon } from "@/src/shared/assets/svgs"
import FontText from "@/src/shared/components/FontText"
import { useRouter } from "expo-router"
import React from "react"
import { useTranslation } from "react-i18next"
import { Pressable, View } from "react-native"
import { EnvelopeIcon, UserIcon } from "react-native-heroicons/outline"
import { PhoneIcon } from "react-native-heroicons/mini"
import type { EligibleTransaction } from "../../domain/instant-settlement.models"
import StatusBox from "@/src/modules/payment-links/components/StatusBox"

interface InstantSettlementCardProps {
    transaction: EligibleTransaction;
    isSelected?: boolean;
    onToggleSelect?: (transaction: EligibleTransaction) => void;
}

const CURRENCY = 'EGP';

const InstantSettlementCard = ({ transaction, isSelected = false, onToggleSelect }: InstantSettlementCardProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { customer } = transaction;
    const hasCustomer = !!(customer && (customer.name || customer.phone || customer.email));

    return (
        <View className="border-[1.5px] rounded border-tertiary pl-3 pr-3 py-4 mb-2">
            <View className="flex-row justify-between mb-1 gap-x-2">
                <Pressable onPress={() => onToggleSelect?.(transaction)}>
                    {isSelected ? <CheckBoxSquareFilledIcon /> : <CheckBoxSquareEmptyIcon />}
                </Pressable>
                <Pressable className="flex-1" onPress={() => router.push(`/payments/transaction/${transaction.id}`)}>
                    {/* method + gross (bold) */}
                    <View className="flex-row items-center justify-between mb-1">
                        <FontText type="body" weight="regular" className="text-content-primary text-xs capitalize">
                            {transaction.method}
                        </FontText>
                        <FontText type="body" weight="bold" className={cn("text-content-primary text-sm", 'ml-auto')}>
                            {currencyNumber(transaction.amount)} {t(CURRENCY)}
                        </FontText>
                    </View>
                    {/* time + net (grey) */}
                    <View className="flex-row items-center justify-between">
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {formatAMPM(transaction.createdAt)}
                        </FontText>
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {currencyNumber(transaction.settlementAmount)} {t(CURRENCY)}
                        </FontText>
                    </View>
                    {/* refs + optional status badge */}
                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-1 flex-shrink flex-row items-center gap-x-1">
                            {!!transaction.id && (
                                <FontText type="body" weight="regular"
                                    numberOfLines={1}
                                    className="text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary"
                                >
                                    {transaction.id}
                                </FontText>
                            )}
                            {!!transaction.orderId && (
                                <FontText type="body" weight="regular"
                                    numberOfLines={1}
                                    className="flex-shrink text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary">
                                    {transaction.orderId}
                                </FontText>
                            )}
                        </View>
                        {/* render only if API returned a status — never fabricate APPROVED (§6/§8) */}
                        <StatusBox className="ms-4" status={transaction.status} />
                    </View>
                    {/* optional customer row */}
                    {hasCustomer && (
                        <View className="gap-y-2 border-t border-tertiary pt-2 mt-2">
                            <View className="flex-row items-center gap-x-4">
                                {!!customer?.name && (
                                    <View className="flex-row items-center gap-x-1">
                                        <UserIcon size={10} color="#556767" />
                                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                            {customer.name}
                                        </FontText>
                                    </View>
                                )}
                                {!!customer?.phone && (
                                    <View className="flex-row items-center gap-x-1">
                                        <PhoneIcon size={10} color="#556767" />
                                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                            {customer.phone}
                                        </FontText>
                                    </View>
                                )}
                            </View>
                            {!!customer?.email && (
                                <View className="flex-row items-center gap-x-1">
                                    <EnvelopeIcon size={10} color="#556767" />
                                    <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                        {customer.email}
                                    </FontText>
                                </View>
                            )}
                        </View>
                    )}
                </Pressable>
            </View>
        </View>
    )
}

export default InstantSettlementCard
