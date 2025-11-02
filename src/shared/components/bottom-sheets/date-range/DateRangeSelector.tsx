import { cn } from '@/src/core/utils/cn';
import { formatDateRange } from '@/src/core/utils/dateUtils';
import FontText from '@/src/shared/components/FontText';
import { COMMON_STYLES } from '@/src/shared/styles/main';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';

interface DateRangeSelectorProps {
    label: string;
    from: Date | undefined;
    to: Date | undefined;
    onPress: () => void;
    t: any;
}

export const DateRangeSelector = memo(({ label, from, to, onPress, t }: DateRangeSelectorProps) => (
    <View className="mb-6">
        <FontText type="body" weight="semi" className={'text-content-secondary text-sm mb-2 self-start'}>
            {label}
        </FontText>
        <Pressable
            onPress={onPress}
            className="flex-row items-center w-full px-3 h-11 bg-white border border-stroke-input rounded"
        >
            <CalendarDaysIcon size={18} color="#556767" />
            <FontText
                type="body"
                weight="regular"
                className={cn(
                    'self-center ml-2',
                    from && to ? 'text-content-primary text-sm' : 'text-placeholder-color text-sm'
                )}
            >
                {formatDateRange(from, to, t)}
            </FontText>
        </Pressable>
    </View>
));