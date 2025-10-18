import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { XMarkIcon } from 'react-native-heroicons/outline';

const BottomSheetHeader = memo(({ 
    title, 
    onClose 
}: { 
    title: string; 
    onClose: () => void;
}) => (
    <View className="flex-row justify-between items-center mb-6">
        <FontText type="head" weight="bold" className="text-content-primary text-xl">
            {title}
        </FontText>
        <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 bg-red-50 rounded-full items-center justify-center"
        >
            <XMarkIcon size={18} color="#EF4444" />
        </TouchableOpacity>
    </View>
));

export default BottomSheetHeader;