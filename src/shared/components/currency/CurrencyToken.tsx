import { useTranslation } from 'react-i18next';
import { I18nManager, View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import { currencyLabel } from '@/src/core/constants/currencies';

const isRTL = I18nManager.isRTL;

/**
 * Explicit line heights, as an RTL/LTR pair. The RTL values clear
 * NotoNaskhArabic's ascenders and descenders — the hamza on أ, the tail of ي —
 * which a single LTR-tuned number clips outright. They still come in under
 * FontText's blanket 1.8x multiplier, so the pill stays shorter than the amount
 * line it labels. Mirrors LH in DualAmount.tsx and RecordCard.tsx.
 */
const LH = {
    sm: isRTL ? 18 : 13,
    lg: isRTL ? 20 : 15,
};

interface CurrencyTokenProps {
    /** Display code, e.g. "USD". Already run through toDisplayCode by the caller. */
    code: string;
    /** 'lg' pairs with the detail header and the 16px fee/item amounts; 'sm' with list cards and the ≈ line. */
    size?: 'sm' | 'lg';
    className?: string;
}

/**
 * A currency promoted to a tinted tag — the virtual-currency marker.
 *
 * Only ever rendered for a virtual currency: EGP is the settlement default, so
 * marking it would be noise, and a real foreign-currency record keeps its label
 * as plain trailing text. The tag calls out *virtual*, not merely "not EGP".
 * Status already owns green/amber/red, so this draws from the ocean family and
 * can never be misread as an order state.
 *
 * Built as a sibling View rather than a nested <Text>: React Native drops
 * padding and borderRadius on nested Text nodes, so the tag shape is
 * unreachable inline. Every other chip in this app is a standalone element too.
 *
 * The label is the full translated title — "USD" in English, "دولار أمريكي" in
 * Arabic — so it shrinks and truncates rather than pushing the number it labels
 * out of a narrow card column.
 */
export default function CurrencyToken({ code, size = 'sm', className }: CurrencyTokenProps) {
    const { t } = useTranslation();
    if (!code) return null;
    return (
        <View
            className={cn(
                'bg-surface-accent border border-stroke-accent rounded-[2px] px-[3px] shrink min-w-0 self-center',
                className,
            )}
        >
            <FontText
                type="body"
                weight="semi"
                className={cn('text-primary', size === 'lg' ? 'text-xs' : 'text-xxs')}
                // Explicit lineHeight is load-bearing: FontText applies a 1.8x multiplier in
                // RTL to any mapped size class, which would make the tag taller than the
                // amount line it sits on. An inline style wins over that multiplier — which
                // is also why it has to carry its own RTL value rather than one LTR number.
                // No uppercase/letterSpacing — Latin settings that do nothing for "دولار أمريكي",
                // and currencyLabel already returns an uppercase code in English.
                style={{ lineHeight: size === 'lg' ? LH.lg : LH.sm }}
                numberOfLines={1}
            >
                {currencyLabel(t, code)}
            </FontText>
        </View>
    );
}
