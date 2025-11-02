import { Link } from "expo-router"
import { View } from "react-native"
import { Activity } from "../balance.model"
import FontText from "@/src/shared/components/FontText"
import { currencyNumber } from "@/src/core/utils/number-fields"
import { ArrowSmallDownIcon, ArrowSmallUpIcon } from "react-native-heroicons/outline"
import { useTranslation } from "react-i18next"
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils"
import { cn } from "@/src/core/utils/cn"

const IconBox = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="w-4 h-4 p-0.5 rounded-full bg-tertiary items-center justify-center">
            {children}
        </View>
    )
}

const ActivityCard = ({
    _id,
    origin,
    amount,
    createdAt,
    accountName,
    fromBalance
}: {
    _id: string;
    origin: string;
    amount: number;
    createdAt: string;
    accountName: string;
    fromBalance?: boolean;
}) => {
    const { t } = useTranslation();
    // console.log('origin !== "transfers" && fromBalance : ',origin !== "transfers" && fromBalance);
    
    return (
        <Link
            href={`/balance/${_id}`} asChild>
            <View className="border-[1.5px] rounded border-tertiary p-4 mb-2 gap-y-1">
                <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center gap-x-2">
                        <IconBox>
                            {origin === "transfers" ? <ArrowSmallUpIcon size={10} color={'#A50017'} /> : <ArrowSmallDownIcon size={10} color={'#4AAB4E'} />}
                        </IconBox>
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {t(origin === "transfers" ? "Transfer" : "Payment")}
                        </FontText>
                    </View>
                    <FontText type="body" weight="bold"
                        className={cn("text-content-primary text-base leading-5 ml-1",
                            (origin !== "transfers" && fromBalance) && "text-success")}>
                        {(origin !== "transfers" && fromBalance) && "+"}{currencyNumber(amount)} EGP
                    </FontText>
                </View>
                <FontText type="body" weight="regular" className="text-content-primary text-xs">
                    {accountName}
                </FontText>
                <FontText type="body" weight="regular" className="text-content-primary text-xs">
                    {t('To')} {'Account Name'}
                </FontText>
                <FontText type="body" weight="regular" className="text-content-primary text-xs">
                    {origin !== "transfers" && `${formatRelativeDate(createdAt)} - `}{formatAMPM(createdAt)}
                </FontText>
            </View>
        </Link>
    )
}

export default ActivityCard