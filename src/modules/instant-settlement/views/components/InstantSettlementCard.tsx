import { cn } from "@/src/core/utils/cn"
import { formatAMPM } from "@/src/core/utils/dateUtils"
import { currencyNumber } from "@/src/core/utils/number-fields"
import StatusBox from "@/src/modules/payment-links/components/StatusBox"
import { CheckBoxSquareEmptyIcon, CheckBoxSquareFilledIcon } from "@/src/shared/assets/svgs"
import FontText from "@/src/shared/components/FontText"
import { useRouter } from "expo-router"
import React from "react"
import { useTranslation } from "react-i18next"
import { Pressable, View } from "react-native"
import { SettlementTransaction } from "../../instant-settlement.model"

interface InstantSettlementCardProps {
    transaction: SettlementTransaction;
    isSelected?: boolean;
    onToggleSelect?: (transaction: SettlementTransaction) => void;
}

const InstantSettlementCard = ({ transaction, isSelected = false, onToggleSelect }: InstantSettlementCardProps) => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <View className="border-[1.5px] rounded border-tertiary pl-3  pr-3 py-4 mb-2">
            <View className="flex-row justify-between mb-1 gap-x-2">
                <Pressable onPress={() => onToggleSelect?.(transaction)}>
                    {isSelected ? <CheckBoxSquareFilledIcon /> : <CheckBoxSquareEmptyIcon />}
                </Pressable>
                <Pressable className="flex-1" onPress={() => router.push(`/payments/transaction/${transaction.transactionId}`)}>
                    <View className="flex-row items-center justify-between mb-1">
                        <FontText type="body" weight="regular" className="text-content-primary text-xs">
                            <FontText type="body" weight="regular" className="text-content-primary text-xs capitalize">
                                {transaction.method}
                            </FontText>
                            {/* {transaction.channel ? ` · ${transaction.channel}` : ''} */}
                        </FontText>
                        <FontText type="body" weight="bold" className={cn("text-content-primary text-sm", 'ml-auto')}>
                            {currencyNumber(transaction.amount)} {t(transaction.currency)}
                        </FontText>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {formatAMPM(transaction.createdAt)}
                        </FontText>
                        <FontText type="body" weight="regular" className={cn("text-content-secondary text-xs",)}>
                            {currencyNumber(transaction?.pccFees?.settledAmount)} {t(transaction.currency)}
                        </FontText>
                    </View>
                    {/* <View className="flex-row justify-end mt-1">
                        <StatusBox status={transaction.status} />
                    </View> */}
                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-1 flex-shrink flex-row items-center gap-x-1 ">
                            {transaction.transactionId && (
                                <FontText type="body" weight="regular"
                                    numberOfLines={1}
                                    className="text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary"
                                >
                                    {transaction.transactionId}
                                </FontText>
                            )}
                            {transaction.merchantOrderId && (
                                <FontText type="body"
                                    weight="regular"
                                    numberOfLines={1}
                                    className="flex-shrink text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary">
                                    {transaction.merchantOrderId}
                                </FontText>
                            )}
                        </View>
                        <StatusBox className='ms-4' status={transaction.status} />
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default InstantSettlementCard
