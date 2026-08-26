import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';

/**
 * Small neutral pill marking a virtual currency, styled like StatusBox variants.
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
                // the code it sits beside. An inline style wins over that multiplier.
                // No uppercase/letterSpacing — Latin settings that do nothing for "افتراضي".
                style={{ color: '#556767', lineHeight: 13 }}
                numberOfLines={1}
            >
                {t('Virtual')}
            </FontText>
        </View>
    );
}
