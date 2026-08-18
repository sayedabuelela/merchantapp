import { currencyNumber } from "@/src/core/utils/number-fields"
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem"
import { memo } from "react"
import { ExtraFee } from "../../payment-links.model"

const ExtraFeesList = ({ extraFees, currency, totalAmountWithoutFees }: { extraFees: ExtraFee[], currency: string, totalAmountWithoutFees: number }) => {
    return (
        <>
            {extraFees.map((fee, index) => {
                const value =
                    fee.flatFee && fee.rate
                        ? `${currencyNumber(fee.flatFee + (totalAmountWithoutFees * (fee.rate / 100)))} ${currency}`
                        : fee.flatFee
                            ? `${currencyNumber(fee.flatFee)} ${currency}`
                            : fee.rate
                                ? `${fee.rate}%`
                                : undefined;
                // Rows are direct children of the section's gap container, so
                // spacing stays uniform with the rest of the Summary.
                return <SectionRowItem key={`${fee?.name}${index}`} title={fee.name} value={value} />;
            })}
        </>
    )
}

export default memo(ExtraFeesList)
