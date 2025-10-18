import { currencyNumber } from "@/src/core/utils/number-fields"
import FontText from "@/src/shared/components/FontText"
import { memo } from "react"
import { View } from "react-native"
import { ExtraFee } from "../../payment-links.model"

const ExtraFeesList = ({ extraFees, currency, totalAmountWithoutFees }: { extraFees: ExtraFee[], currency: string, totalAmountWithoutFees: number }) => {
    return (
        <View>
            {extraFees.map((fee, index) => (
                <View
                    key={`${fee?.name}${index}`}
                    className="flex-row items-center justify-between mt-2"
                >
                    <FontText type="body" weight="semi" className="text-content-secondary self-start text-sm">{fee.name}</FontText>
                    <View className="flex-row items-center">
                        {fee.flatFee && fee.rate ?
                            <FontText type="body" weight="bold" className="text-content-primary self-start text-sm">
                                {`${currencyNumber(fee.flatFee + ((totalAmountWithoutFees * (fee.rate / 100))))} ${currency}`}
                            </FontText>
                            : fee.flatFee ?
                                <FontText type="body" weight="bold" className="text-content-primary self-start text-sm">{`${currencyNumber(fee.flatFee)} ${currency}`}</FontText>
                                : fee.rate ?
                                    <FontText type="body" weight="bold" className="text-content-primary self-start text-sm">{`${fee.rate}%`}</FontText>
                                    : null
                        }
                    </View>
                </View>
            ))}
        </View>
    )
}

export default memo(ExtraFeesList)