import { cn } from "@/src/core/utils/cn"
import { formatAMPM } from "@/src/core/utils/dateUtils"
import { currencyNumber } from "@/src/core/utils/number-fields"
import StatusBox from "@/src/modules/payment-links/components/StatusBox"
import { SettlementTransaction } from "../../instant-settlement.model"
import { CheckBoxSquareEmptyIcon, CheckBoxSquareFilledIcon } from "@/src/shared/assets/svgs"
import FontText from "@/src/shared/components/FontText"
import { PressableScale } from "pressto"
import React from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"

interface InstantSettlementCardProps {
    transaction: SettlementTransaction;
    isSelected?: boolean;
    onToggleSelect?: (transaction: SettlementTransaction) => void;
}

const InstantSettlementCard = ({ transaction, isSelected = false, onToggleSelect }: InstantSettlementCardProps) => {
    const { t } = useTranslation();

    const handlePress = () => {
        onToggleSelect?.(transaction);
    };

    return (
        <PressableScale onPress={handlePress}>
            <View className="border-[1.5px] rounded border-tertiary p-4 mb-2">
                <View className="flex-row justify-between mb-1 gap-x-2">
                    <View>
                        {isSelected ? <CheckBoxSquareFilledIcon /> : <CheckBoxSquareEmptyIcon />}
                    </View>
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                            <FontText type="body" weight="regular" className="text-content-primary text-xs">
                                <FontText type="body" weight="regular" className="text-content-primary text-xs capitalize">
                                    {transaction.method}
                                </FontText>
                                {transaction.channel ? ` · ${transaction.channel}` : ''}
                            </FontText>
                            <FontText type="body" weight="bold" className={cn("text-content-primary text-sm", 'ml-auto')}>
                                {currencyNumber(transaction.amount)} {t('EGP')}
                            </FontText>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                                {formatAMPM(transaction.createdAt)}
                            </FontText>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-x-1 mt-2">
                                {transaction.transactionId && (
                                    <FontText type="body" weight="regular"
                                        className="text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary"
                                    >
                                        {transaction.transactionId}
                                    </FontText>
                                )}
                                {transaction.merchantOrderId && (
                                    <FontText type="body"
                                        weight="regular"
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        className="max-w-[120px] text-content-secondary text-[10px] bg-[#F8F9F9] py-0.5 px-1 rounded-[2px] border border-tertiary">
                                        {transaction.merchantOrderId}
                                    </FontText>
                                )}
                            </View>
                            <StatusBox status={transaction.status} />
                        </View>
                    </View>
                </View>
            </View>
        </PressableScale>
    )
}

export default InstantSettlementCard
