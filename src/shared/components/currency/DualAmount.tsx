import { ReactNode } from 'react';
import { I18nManager, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { BASE_CURRENCY, isVirtualCurrency, isVirtualRecord, toDisplayCode } from '@/src/core/constants/currencies';
import { cn } from '@/src/core/utils/cn';
import useCurrencyConversionEnabled from '@/src/shared/hooks/useCurrencyConversionEnabled';
import CurrencyToken from './CurrencyToken';

const isRTL = I18nManager.isRTL;

/**
 * Explicit line heights, with headroom: FontText scales a mapped size class by
 * 1.0-1.125 on device width, so text-sm is already 15px on the 390px phone the
 * design models. The RTL values clear NotoNaskhArabic's taller metrics without
 * FontText's blanket 1.8x multiplier.
 */
const LH = {
    amountSm: isRTL ? 22 : 18,
    amountLg: isRTL ? 32 : 26,
    subLine: isRTL ? 20 : 16,
};

interface DualAmountProps {
    /** Settled/base amount (EGP side) */
    amount: number | string | null | undefined;
    /** Settled/base currency code (usually "EGP") */
    currency?: string | null;
    /** Original virtual amount, when the record is virtual-origin */
    virtualAmount?: number | string | null;
    /** Virtual currency id or code (e.g. "USD_VIRTUAL") */
    virtualCurrency?: string | null;
    /** Which amount is the primary line. 'virtual' for virtual-currency views, 'egp' for the EGP view */
    primary?: 'egp' | 'virtual';
    size?: 'sm' | 'lg';
    /**
     * Rendered at the end of the primary amount line, inside the same row.
     * Detail headers pass their status badge + chip here so those sit on the
     * amount line rather than vertically centring against the whole block.
     */
    trailing?: ReactNode;
    className?: string;
}

interface AmountLineProps {
    value: number | string | null | undefined;
    currency?: string | null;
    prefix?: string;
    textClassName: string;
    lineHeight: number;
    tokenSize?: 'sm' | 'lg';
    bold?: boolean;
    type?: 'body' | 'head';
    trailing?: ReactNode;
}

/**
 * One money line: "299.99 USD" — with the code promoted to a tinted tag when,
 * and only when, it is a virtual currency. A real foreign-currency record keeps
 * the code as plain trailing text, which is the whole point: the marker calls
 * out *virtual*, not merely "not EGP".
 */
const AmountLine = ({
    value,
    currency,
    prefix = '',
    textClassName,
    lineHeight,
    tokenSize = 'sm',
    bold,
    type = 'body',
    trailing,
}: AmountLineProps) => {
    const { t } = useTranslation();
    const display = toDisplayCode(currency) || BASE_CURRENCY;
    const tokenised = isVirtualCurrency(currency);
    const number = currencyNumber(Number(value ?? 0));

    const text = (
        <FontText
            type={type}
            weight={bold ? 'bold' : 'regular'}
            className={textClassName}
            style={{ lineHeight }}
            numberOfLines={1}
        >
            {`${prefix}${number}${tokenised ? '' : ` ${t(display)}`}`}
        </FontText>
    );

    if (!tokenised && !trailing) return text;

    return (
        <View className="flex-row items-center gap-x-1">
            {text}
            {tokenised && <CurrencyToken code={display} size={tokenSize} />}
            {/* ms-1 tops the row's 4px gap up to the 8px the header badge wants,
                while the token stays tight against the number it labels */}
            {trailing && (
                <View className="flex-row items-center gap-x-2 ms-1">{trailing}</View>
            )}
        </View>
    );
};

/**
 * Renders an amount with its currency. For virtual-origin records (feature flag on),
 * renders a primary + secondary "≈ equivalent" pair, with the virtual code shown as
 * a tinted tag on whichever line carries it.
 * Falls back to exactly the legacy single line otherwise — the flag guard for all
 * amount displays lives here.
 * Values are always backend-provided; no client-side conversion happens here.
 */
export default function DualAmount({
    amount,
    currency,
    virtualAmount,
    virtualCurrency,
    primary = 'virtual',
    size = 'sm',
    trailing,
    className,
}: DualAmountProps) {
    const isEnabled = useCurrencyConversionEnabled();
    const isLg = size === 'lg';

    const primaryTextClasses = isLg
        ? 'text-content-primary text-xl'
        : 'text-content-primary text-sm';
    // Both the card's settles line and the detail header's are 12px / light-gray
    const secondaryTextClasses = 'text-light-gray text-xs';
    const primaryLH = isLg ? LH.amountLg : LH.amountSm;

    const isDual = isEnabled && isVirtualRecord({ virtualAmount, virtualCurrency });

    if (!isDual) {
        return (
            <View className={className}>
                <AmountLine
                    value={amount}
                    currency={currency}
                    bold
                    textClassName={primaryTextClasses}
                    lineHeight={primaryLH}
                    tokenSize={isLg ? 'lg' : 'sm'}
                    type={isLg ? 'head' : 'body'}
                    trailing={trailing}
                />
            </View>
        );
    }

    const egp = { value: amount, currency: currency ?? BASE_CURRENCY };
    const virtual = { value: virtualAmount, currency: virtualCurrency };
    // An uncaptured record (abandoned/expired) has no settled figure, so it leads with
    // the charged amount rather than a hollow bold "0.00 EGP". The equivalent line is
    // still rendered underneath — reading "0.00 EGP" there — so every row in the list
    // carries the same two-line shape whatever its status.
    const hasBase = amount !== null && amount !== undefined && amount !== '';
    const primaryIsVirtual = primary !== 'egp' || !hasBase;
    const first = primaryIsVirtual ? virtual : egp;
    const second = primaryIsVirtual ? egp : virtual;

    return (
        <View className={cn(isLg ? 'gap-y-1' : 'gap-y-0.5', className)}>
            <AmountLine
                {...first}
                bold
                textClassName={primaryTextClasses}
                lineHeight={primaryLH}
                tokenSize={isLg ? 'lg' : 'sm'}
                type={isLg ? 'head' : 'body'}
                trailing={trailing}
            />
            <AmountLine
                {...second}
                prefix="≈ "
                textClassName={secondaryTextClasses}
                lineHeight={LH.subLine}
                tokenSize="sm"
            />
        </View>
    );
}
