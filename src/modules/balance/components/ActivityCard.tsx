import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import { Activity } from "../balance.model"
import FontText from "@/src/shared/components/FontText"
import { currencyNumber } from "@/src/core/utils/number-fields"
import { ArrowSmallDownIcon, ArrowSmallUpIcon } from "react-native-heroicons/outline"
import { useTranslation } from "react-i18next"
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils"
import { cn } from "@/src/core/utils/cn"
import IconBox from "@/src/shared/components/wrappers/IconBox"

// const IconBox = ({ children }: { children: React.ReactNode }) => {
//     return (
//         <View className="w-4 h-4  rounded-full bg-tertiary items-center justify-center">
//             {children}
//         </View>
//     )
// }

const ActivityCard = ({
    _id,
    operation,
    origin,
    amount,
    createdAt,
    accountName,
    fromBalance
}: {
    _id: string;
    operation: string;
    origin: string;
    amount: number;
    createdAt: string;
    accountName: string;
    fromBalance?: boolean;
}) => {
    const { t } = useTranslation();

    // OUT operations: money going out (down arrow, red)
    const outOperations = ['payout', 'transfer', 'refund', 'deduct'];

    // IN operations: money coming in (up arrow, green)
    const inOperations = ['topup', 'adjustment', 'rate adjustment', 'opening balance', 'refund cancel', 'settlement', 'release','payment'];

    const isOutOperation = outOperations.includes(operation.toLowerCase());
    const isInOperation = inOperations.includes(operation.toLowerCase());
    // out is arrow up 
    // in is arrow down
    return (
        <Link
            href={`/balance/${_id}`} asChild>
            <Pressable className="border-[1.5px] rounded border-tertiary p-4 mb-2 gap-y-1">
                <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center gap-x-2">
                        <IconBox className="bg-tertiary">
                            {isInOperation ? (
                                <ArrowSmallDownIcon size={10} color={'#4AAB4E'} />
                            ) : (
                                <ArrowSmallUpIcon size={10} color={'#A50017'} />
                            )}
                        </IconBox>
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs capitalize">
                            {t(operation)}
                        </FontText>

                    </View>
                    <FontText type="body" weight="bold"
                        className={cn("text-content-primary text-base ml-1"
                            // ,isInOperation && "text-success"
                        )}>

                        {/* {isInOperation && "+"} */}
                        {currencyNumber(amount)} {t('EGP')}
                    </FontText>
                </View>
                <FontText type="body" weight="regular" className="text-content-primary text-xs">
                    {accountName}
                </FontText>
                {/* <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                    {t('To')} {'Account Name'}
                </FontText> */}
                <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                    {operation === "payout" && `${formatRelativeDate(createdAt)} - `}{formatAMPM(createdAt)}
                </FontText>
            </Pressable>
        </Link>
    )
}

export default ActivityCard