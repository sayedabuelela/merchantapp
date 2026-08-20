import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem";

interface Props {
    title: string;
    value: string;
    // Muted second line under the value (e.g. "≈ 248.99 EGP" for virtual-currency links)
    secondaryValue?: string;
    summaryLabel?: boolean;
    /** Summing row: hairline rule above it */
    total?: boolean;
    /** Tinted callout row, e.g. the exchange rate */
    highlighted?: boolean;
    className?: string;
}

/**
 * A payment-links Summary row. The data shape is payment-links-specific; the
 * visual shell is the shared details row, so both modules stay in step.
 */
const SummaryItem = ({ title, value, secondaryValue, total, highlighted, className, summaryLabel = false }: Props) => (
    <SectionRowItem
        title={title}
        value={value}
        secondaryValue={secondaryValue}
        total={total}
        highlighted={highlighted}
        labelWeight={summaryLabel ? "semi" : "regular"}
        className={className}
    />
)

export default SummaryItem;
