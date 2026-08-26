import { TouchableOpacity, View } from "react-native"
import FontText from "@/src/shared/components/FontText"
import { useTranslation } from "react-i18next"
import { NotificationData } from "../notification.model"
import { cn } from "@/src/core/utils/cn"
import { router } from "expo-router"
import { formatRelativeDate, formatTime } from "@/src/core/utils/dateUtils"
import { ROUTES } from "@/src/core/navigation/routes"
import { currencyLabel } from '@/src/core/constants/currencies';

interface NotificationProps extends NotificationData {
    onPress: () => void;
}

const Notification = ({ _id,
    createdAt,
    seen,
    data,
    message,
    onPress }: NotificationProps) => {
    const { t, i18n } = useTranslation()

    const isInstantSettlement = data?.type === 'instantSettlement'

    const handlePress = () => {
        // Call the onPress callback to mark as seen
        onPress()

        // Instant settlement requests open their details screen. The endpoint
        // takes the UUID — `requestId` is the human ISR-… code and would 404.
        if (isInstantSettlement && data.instantSettlementRequestId) {
            router.push(ROUTES.INSTANT_SETTLEMENT.REQUEST_DETAILS(data.instantSettlementRequestId))
            return
        }

        // Navigate to the transaction screen
        if (data.transactionId) {
            router.push(`/payments/transaction/${data.transactionId}` as any)
        } else if (data.orderId) {
            // Navigate to order screen if only orderId is available
            router.push(`/payments/order/${data.orderId}` as any)
        }
    }

    // Instant settlement notifications carry no customer/amount/originId, so the
    // composed payment sentence below renders as "Your customer paid For
    // Undefined". The API already ships a localized title/body for them.
    if (isInstantSettlement) {
        const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en'
        const localized = message?.[lang] ?? message?.en

        return (
            <TouchableOpacity
                onPress={handlePress}
                className={cn(
                    "border-[1.5px] rounded border-tertiary py-4 px-6 mb-2 gap-y-1 ",
                    !seen && "bg-[#F1F6FF]",
                )}>
                {!!localized?.title && (
                    <FontText type="body" weight="bold" className="text-content-primary text-sm">
                        {localized.title}
                    </FontText>
                )}
                {!!localized?.body && (
                    <FontText type="body" weight="regular" className="text-content-primary text-sm">
                        {localized.body}
                    </FontText>
                )}

                <FontText type="body" weight="semi" className="text-[#999999] text-xs">
                    {formatRelativeDate(createdAt, false, true)} {t('at')} {formatTime(createdAt)}
                </FontText>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={cn(
                "border-[1.5px] rounded border-tertiary py-4 px-6 mb-2 gap-y-1 ",
                !seen && "bg-[#F1F6FF]",
            )}>
            <View className="flex flex-row flex-wrap items-center">

                <FontText type="body" weight="regular" className="text-content-primary text-sm">
                    {t("Your customer")}
                </FontText>
                {data?.customerName !== undefined && data?.customerName !== '' && (
                    <FontText type="body" weight="bold" className={cn("text-content-primary text-sm ml-1")}>
                        {data?.customerName}
                    </FontText>
                )}
                <FontText
                    type="body"
                    weight="regular"
                    className="text-content-primary text-sm ml-1"
                >
                    {t("proccedPaid")}
                </FontText>

                <FontText
                    type="body"
                    weight="bold"
                    className="text-content-primary mx-0.5 text-sm"
                >
                    {data?.amount} {data?.currency ? currencyLabel(t, data.currency) : ''}{" "}
                </FontText>

                <FontText
                    type="body"
                    weight="regular"
                    className="text-content-primary capitalize text-sm"
                >
                    {`${t('for')} ${t(data?.paymentType ?? '')}`}
                    {/* {data?.paymentType !== "paymentRequest"
                        ? t(`${data?.paymentType}`)
                        : t(`${data?.paymentType}.notification`)} */}
                </FontText>
                {data?.originId !== undefined && data?.originId !== '' && (
                    <FontText
                        type="body"
                        weight="bold"
                        className="text-content-primary mx-1 text-sm"
                    >
                        ({data?.originId})
                    </FontText>
                )}

            </View>

            <FontText type="body" weight="semi" className="text-[#999999] text-xs">
                {formatRelativeDate(createdAt, false, true)} {t('at')} {formatTime(createdAt)}
            </FontText>
        </TouchableOpacity>
    )
}

export default Notification