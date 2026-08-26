import { I18nManager, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';

const isRTL = I18nManager.isRTL;

/**
 * Small neutral pill reading "Virtual", marking a virtual currency in the picker and
 * beside a stat amount. Deliberately neutral rather than ocean-tinted: it sits on the
 * `#F1F6FF` stats card, which is the ocean tint itself, so a tinted pill would vanish
 * into its own background. `CurrencyToken` — which sits on white — carries the tint.
 */
export default function VirtualBadge({ className }: { className?: string }) {
    const { t } = useTranslation();
    return (
        <View className={cn('px-0.5 py-0.5 rounded-sm bg-[#F5F6F6] border border-[#E8EAEA] self-center', className)}>
            <FontText
                type="body"
                weight="regular"
                className="text-xxs text-center"
                // Explicit lineHeight is load-bearing: FontText applies a 1.8x multiplier
                // in RTL to any mapped size class, which would make the pill taller than
                // the code it sits beside. An inline style wins over that multiplier —
                // which is also why it needs its own RTL value: a single LTR-tuned number
                // clips the descender of "افتراضي" outright.
                // No uppercase/letterSpacing — Latin settings that do nothing for "افتراضي".
                style={{ color: '#556767', lineHeight: isRTL ? 18 : 13 }}
                numberOfLines={1}
            >
                {t('Virtual')}
            </FontText>
        </View>
    );
}
