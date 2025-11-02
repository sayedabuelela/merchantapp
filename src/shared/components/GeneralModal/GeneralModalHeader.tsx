import { TouchableOpacity, View } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import { XMarkIcon } from 'react-native-heroicons/outline'

const GeneralModalHeader = ({
    title,
    onClose
}: {
    title: string;
    onClose: () => void;
}) => {
    return (
        <View className="flex-row justify-between items-center mb-6">
            <FontText type="head" weight="bold" className="text-content-hint text-xl">
                {title}
            </FontText>
            <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 bg-[#F1F6FF] rounded-full items-center justify-center"
            >
                <XMarkIcon size={18} color="#0F172A" />
            </TouchableOpacity>
        </View>
    )
}

export default GeneralModalHeader