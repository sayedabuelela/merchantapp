import { formatRelativeDate } from '@/src/core/utils/dateUtils'
import { currencyNumber } from '@/src/core/utils/number-fields'
import FontText from '@/src/shared/components/FontText'
import { Link } from 'expo-router'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { EllipsisVerticalIcon, QrCodeIcon, ShoppingBagIcon, UserIcon } from 'react-native-heroicons/outline'
import { PaymentLink } from '../payment-links.model'
import StatusBox from './StatusBox'

interface Props {
    paymentLink: PaymentLink;
    onOpenActions: (paymentLink: PaymentLink) => void;
}

const PaymentLinkCard = ({
    paymentLink,
    onOpenActions
}: Props) => {
    const { t } = useTranslation();
    const { customerName, paymentLinkId, dueDate, paymentType, state, paymentStatus, needApproval, isChecker, createdByUserId, totalAmount, currency, invoiceReferenceId, invoiceItems } = paymentLink;
    const onOpen = useCallback(() => onOpenActions(paymentLink), [onOpenActions, paymentLink]);

    return (
        <Link href={`/payment-links/${paymentLinkId}`} asChild>
            <Pressable className='flex-row justify-between border-[1.5px] rounded border-tertiary p-4 mb-2'>
                <View className='flex-row gap-x-1'>
                    <UserIcon size={18} color="#556767" style={{ marginTop: 3 }} />
                    <View>
                        <FontText type="body" weight="semi" className="text-content-secondary text-sm self-start mb-0.5">
                            {customerName}
                        </FontText>
                        <FontText type="body" weight="regular" className="text-light-gray text-xs self-start">
                            {paymentLinkId}{" "}
                            {dueDate && `• ${t("Due")} ${t(formatRelativeDate(dueDate))}`}
                        </FontText>
                        <View className='flex-row items-center gap-x-2 mt-1'>
                            <FontText type="body" weight="bold" className="text-content-primary text-base self-start">
                                {currencyNumber(totalAmount)} {currency}
                            </FontText>
                            <StatusBox status={paymentStatus} />
                        </View>
                        {(invoiceReferenceId !== undefined || paymentType === "professional") && (
                            <View className='flex-row items-center gap-x-3 mt-1'>
                                {paymentType === "professional" && invoiceItems.length > 0 && (
                                    <View className='flex-row items-center gap-x-1'>
                                        <ShoppingBagIcon size={18} color="#839090" />
                                        <FontText type="body" weight="regular" className="text-light-gray text-xs self-start">
                                            {invoiceItems.length}{" "}
                                            {`${t(invoiceItems.length <= 1 ? "Item" : "Items")}`}
                                        </FontText>
                                    </View>
                                )}
                                {invoiceReferenceId && (
                                    <View className='flex-row items-center gap-x-1'>
                                        <QrCodeIcon size={18} color="#839090" />
                                        <FontText type="body" weight="regular" className="text-light-gray text-xs self-start">
                                            {invoiceReferenceId}
                                        </FontText>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                </View>
                <Pressable onPress={onOpen}>
                    <EllipsisVerticalIcon size={19} color="#001F5F" />
                </Pressable>
            </Pressable>
        </Link>
    )
}

export default memo(PaymentLinkCard);
