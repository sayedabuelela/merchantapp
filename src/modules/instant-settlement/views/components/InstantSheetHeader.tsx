import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { XMarkIcon } from 'react-native-heroicons/outline';

/**
 * Feature-specific bottom-sheet header with a NEUTRAL close button.
 * (The shared `BottomSheetHeader` uses a red close style; the Instant Settlement
 * screenshots show a neutral one — documented minimal exception, §9/§10.)
 */
const InstantSheetHeader = memo(
    ({ title, onClose }: { title: string; onClose: () => void }) => (
        <View className="flex-row justify-between items-center mb-6">
            <FontText type="head" weight="bold" className="text-content-primary text-xl">
                {title}
            </FontText>
            <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 bg-surface-secondary rounded-full items-center justify-center"
            >
                <XMarkIcon size={18} color="#556767" />
            </TouchableOpacity>
        </View>
    ),
);

InstantSheetHeader.displayName = 'InstantSheetHeader';

export default InstantSheetHeader;
