import { CURRENCY_FLAGS, toDisplayCode } from '@/src/core/constants/currencies';

interface CurrencyFlagProps {
    /** Currency code or virtual id (USD, USD_VIRTUAL, EGP...) */
    currency?: string | null;
    size?: number;
}

/**
 * Renders the flag SVG for a currency code; null when no flag asset exists.
 */
export default function CurrencyFlag({ currency, size = 20 }: CurrencyFlagProps) {
    const Flag = CURRENCY_FLAGS[toDisplayCode(currency)];
    if (!Flag) return null;
    return <Flag width={size} height={size} />;
}
