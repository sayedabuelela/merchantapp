import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import { currencyShortLabel } from '@/src/core/constants/currencies';

interface CurrencyTokenProps {
    /** Display code, e.g. "USD". Already run through toDisplayCode by the caller. */
    code: string;
    /** 'lg' pairs with the detail-header amount; 'sm' with list cards and the ≈ line. */
    size?: 'sm' | 'lg';
    className?: string;
}

/**
 * A currency code promoted to a tinted tag — the virtual-currency marker.
 *
 * Only ever rendered for a virtual currency: EGP is the settlement default, so
 * marking it would be noise. Status already owns green/amber/red, so this draws
 * from the ocean family and can never be misread as an order state.
 *
 * Built as a sibling View rather than a nested <Text>: React Native drops
 * padding and borderRadius on nested Text nodes, so the tag shape is
 * unreachable inline. Every other chip in this app is a standalone element too.
 *
 * Rendered through `currencyShortLabel`, never `currencyLabel`: the amount keys
 * translate to the full name ("الدولار الأمريكي"), which would blow a 10px tag
 * into a phrase. Full names belong to the picker and to amounts, not here.
 */
export default function CurrencyToken({ code, size = 'sm', className }: CurrencyTokenProps) {
    const { t } = useTranslation();
    if (!code) return null;
    return (
        <View className={cn('bg-surface-accent rounded-[2px] px-[3px] shrink-0', className)}>
            <FontText
                type="body"
                weight="semi"
                className={cn('text-primary uppercase', size === 'lg' ? 'text-xs' : 'text-xxs')}
                // Explicit lineHeight is load-bearing: FontText applies a 1.8x multiplier in
                // RTL to any mapped size class, which would make the tag taller than the
                // amount line it sits on. An inline style wins over that multiplier.
                style={{ lineHeight: size === 'lg' ? 15 : 13, letterSpacing: 0.4 }}
                numberOfLines={1}
            >
                {currencyShortLabel(t, code)}
            </FontText>
        </View>
    );
}
