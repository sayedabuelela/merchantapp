import { currencyNumber } from "@/src/core/utils/number-fields"
import { memo } from "react"
import { View } from "react-native"
import { InvoiceItem } from "../../payment-links.model"
import SummaryItem from "./SummaryItem"

const InvoiceItemsList = ({ items, currency }: { items: InvoiceItem[], currency: string }) => {
    console.log('items', items)
    return (
        <View >
            {items.map((item, index) => (
                <SummaryItem
                    key={`${item?.description}${index}`}
                    title={`${item.description} x ${item.quantity}`}
                    value={`${currencyNumber(item?.subTotal)} ${currency}`}
                />
            ))}
        </View>
    )
}

export default memo(InvoiceItemsList)