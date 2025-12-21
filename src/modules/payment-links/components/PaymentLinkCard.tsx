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
import DeliveryStatusBox from './DeliveryStatusBox'
import { cn } from '@/src/core/utils/cn'

interface Props {
    paymentLink: PaymentLink;
    onOpenActions: (paymentLink: PaymentLink) => void;
}

const PaymentLinkCard = ({
    paymentLink,
    onOpenActions
}: Props) => {
    const { t } = useTranslation();
    const { customerName, paymentLinkId, dueDate, paymentType, state, paymentStatus, needApproval, isChecker, createdByUserId, totalAmount, currency, invoiceReferenceId, invoiceItems, lastShareStatus } = paymentLink;
    const onOpen = useCallback(() => onOpenActions(paymentLink), [onOpenActions, paymentLink]);
    // console.log("lastShareStatus : ", lastShareStatus);
    return (
        <Link href={`/payment-links/${paymentLinkId}`} asChild>
            <Pressable className='border-[1.5px] rounded border-tertiary p-4 mb-2  gap-y-2'
                onLongPress={onOpen}
            >
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center'>
                        <StatusBox status={paymentStatus} />
                        <FontText type="body" weight="regular"
                            className="text-content-secondary text-[10px] uppercase ml-2">
                            {paymentLinkId}</FontText>
                    </View>
                    <FontText type="body" weight="bold"
                        className={cn("text-content-primary text-sm")}>
                        {currencyNumber(totalAmount)} {currency}
                    </FontText>
                    {/* <View className='flex-row items-center'> */}
                    {/* <Pressable onPress={onOpen}>
                            <EllipsisVerticalIcon size={19} color="#001F5F" />
                        </Pressable> */}
                    {/* </View> */}
                </View>
                <View className='flex-row items-start'>
                    <UserIcon size={18} color="#556767" style={{ marginTop: 3 }} />
                    <View className='flex-1 ml-1'>
                        <View className='flex-row items-center justify-between'>
                        <FontText type="body" weight="regular"
                            className="text-content-primary text-xs capitalize self-start mt-0.5">
                                {customerName}
                            </FontText>
                            {/* <FontText type="body" weight="semi" className="text-content-secondary text-sm self-start">
                                {customerName}
                            </FontText> */}

                        </View>
                        {dueDate && (
                            <FontText type="body" weight="regular" className="text-light-gray text-xs self-start mt-0.5">
                                {t("Due")} {t(formatRelativeDate(dueDate))}
                            </FontText>
                        )}
                        {(lastShareStatus?.email.status || lastShareStatus?.sms.status) && (
                            <View className='flex-row items-center gap-x-2 mt-2'>
                                {lastShareStatus?.email.status && (
                                    <DeliveryStatusBox delivery_status={lastShareStatus.email.status} />
                                )}
                                {lastShareStatus?.sms.status && (
                                    <DeliveryStatusBox delivery_status={lastShareStatus.sms.status} />
                                )}
                            </View>
                        )}
                        <View className='flex-row items-center gap-x-2 mt-2'>
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
                </View>

                {/* <View className='flex-row gap-x-1'>
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
                </Pressable> */}
            </Pressable>
        </Link>
    )
}

export default memo(PaymentLinkCard);
