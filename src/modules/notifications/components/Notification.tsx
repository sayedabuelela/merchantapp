import { TouchableOpacity, View, I18nManager } from "react-native"
import FontText from "@/src/shared/components/FontText"
import { useTranslation } from "react-i18next"
import { NotificationData } from "../notification.model"
import { cn } from "@/src/core/utils/cn"
import { router } from "expo-router"
import { formatRelativeDate, formatTime } from "@/src/core/utils/dateUtils"
const isRTL = I18nManager.isRTL;

interface NotificationProps extends NotificationData {
    onPress: () => void;
}

const Notification = ({ _id,
    createdAt,
    seen,
    data,
    onPress }: NotificationProps) => {
    const { t } = useTranslation()

    const handlePress = () => {
        // Call the onPress callback to mark as seen
        onPress()

        // Navigate to the transaction screen
        if (data.transactionId) {
            router.push(`/payments/transaction/${data.transactionId}` as any)
        } else if (data.orderId) {
            // Navigate to order screen if only orderId is available
            router.push(`/payments/order/${data.orderId}` as any)
        }
    }
    console.log("data?.paymentType : ", data?.paymentType);
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

                <FontText type="body" weight="bold" className={cn("text-content-primary text-sm mx-1")}>
                    {data?.customerName}
                </FontText>

                <FontText
                    type="body"
                    weight="regular"
                    className="text-content-primary text-sm"
                >
                    {t("proccedPaid")}
                </FontText>

                <FontText
                    type="body"
                    weight="bold"
                    className="text-content-primary mx-0.5 text-sm"
                >
                    {data?.amount} {t(data?.currency)}{" "}
                </FontText>

                <FontText
                    type="body"
                    weight="regular"
                    className="text-content-primary capitalize text-sm"
                >
                    {/* {t("for")}  */}
                    {t(`${isRTL ? "for" : "for "}${data?.paymentType}`)}
                    {/* {data?.paymentType !== "paymentRequest"
                        ? t(`${data?.paymentType}`)
                        : t(`${data?.paymentType}.notification`)} */}
                </FontText>

                <FontText
                    type="body"
                    weight="bold"
                    className="text-content-primary mx-1 text-sm"
                >
                    ({data?.originId})
                </FontText>

            </View>

            <FontText type="body" weight="semi" className="text-[#999999] text-xs">
                {formatRelativeDate(createdAt, false, true)} {t('at')} {formatTime(createdAt)}
            </FontText>
        </TouchableOpacity>
    )
}

export default Notification