import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';

/**
 * An inline advisory inside a details section — no icon, no border, no margin.
 * Callers sit it in a gap container, so spacing stays the section's business.
 *
 * Deliberately carries no explicit line height: FontText's RTL multiplier is
 * what keeps Arabic from clipping across multiple wrapped lines here.
 */
const NoteBox = ({ children, className }: { children: string; className?: string }) => (
    <View className={cn('rounded bg-feedback-warning-bg px-3 py-2.5', className)}>
        <FontText type="body" weight="regular" className="text-feedback-warning-strong text-xs">
            {children}
        </FontText>
    </View>
);

export default NoteBox;
