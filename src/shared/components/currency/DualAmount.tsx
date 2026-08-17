import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { toDisplayCode } from '@/src/core/constants/currencies';
import { cn } from '@/src/core/utils/cn';
import useCurrencyConversionEnabled from '@/src/shared/hooks/useCurrencyConversionEnabled';
import VirtualBadge from './VirtualBadge';

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
    showBadge?: boolean;
    className?: string;
}

/**
 * Renders an amount with its currency. For virtual-origin records (feature flag on),
 * renders a primary + secondary "≈ equivalent" pair with a Virtual badge.
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
    showBadge = true,
    className,
}: DualAmountProps) {
    const { t } = useTranslation();
    const isEnabled = useCurrencyConversionEnabled();

    const primaryTextClasses =
        size === 'lg' ? 'text-content-primary text-xl' : 'text-content-primary text-sm';
    const secondaryTextClasses =
        size === 'lg' ? 'text-content-secondary text-sm' : 'text-content-secondary text-xs';

    const isDual =
        isEnabled && virtualCurrency != null && virtualAmount != null && virtualAmount !== '';

    if (!isDual) {
        return (
            <FontText
                type={size === 'lg' ? 'head' : 'body'}
                weight="bold"
                className={cn(primaryTextClasses, className)}
            >
                {currencyNumber(Number(amount ?? 0))} {t(toDisplayCode(currency) || 'EGP')}
            </FontText>
        );
    }

    const egpLine = `${currencyNumber(Number(amount ?? 0))} ${t(toDisplayCode(currency) || 'EGP')}`;
    const virtualLine = `${currencyNumber(Number(virtualAmount))} ${t(toDisplayCode(virtualCurrency))}`;

    const primaryLine = primary === 'egp' ? egpLine : virtualLine;
    const secondaryLine = primary === 'egp' ? virtualLine : egpLine;

    return (
        <View className={cn('gap-y-0.5', className)}>
            <View className="flex-row items-center gap-x-1.5">
                <FontText
                    type={size === 'lg' ? 'head' : 'body'}
                    weight="bold"
                    className={primaryTextClasses}
                >
                    {primaryLine}
                </FontText>
                {showBadge && <VirtualBadge />}
            </View>
            <FontText type="body" weight="regular" className={secondaryTextClasses}>
                {`≈ ${secondaryLine}`}
            </FontText>
        </View>
    );
}
