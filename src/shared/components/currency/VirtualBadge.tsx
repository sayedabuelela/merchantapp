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
                className="text-[9px] text-center uppercase"
                style={{ color: '#556767', letterSpacing: 0.2 }}
                numberOfLines={1}
            >
                {t('Virtual')}
            </FontText>
        </View>
    );
}
