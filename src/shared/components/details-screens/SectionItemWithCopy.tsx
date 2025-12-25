import { cn } from '@/src/core/utils/cn';
import FontText from '@/src/shared/components/FontText';
import { PressableScale } from 'pressto';
import { View } from 'react-native';
import { DocumentDuplicateIcon } from 'react-native-heroicons/outline';
import { useClipboard } from '../../hooks/useClipboard';

interface Props {
    icon?: React.ReactNode;
    title: string;
    value?: string | React.ReactNode;
    valueClassName?: string;
    labelClassName?: string;
}

const SectionItemWithCopy = ({ icon, title, value, valueClassName, labelClassName }: Props) => {
    if (!value) return null;
    const { copy, isCopied } = useClipboard();
    const handleCopy = async () => {
        if (typeof value === 'string') {
            await copy(value)
        }
    }
    return (
        <View className='flex-row items-start'>
            {icon && icon}
            <View className={cn(icon ? 'ml-2' : '')}>
                <FontText type="body" weight="regular" className={cn("text-content-secondary text-sm mb-1 self-start", labelClassName)}>{title}</FontText>
                <View className='flex-row items-center'>
                    <FontText type="body" weight="semi" className={cn("text-content-primary text-sm self-start mr-1", valueClassName)}>{value}</FontText>
                    <PressableScale onPress={handleCopy}>
                        <DocumentDuplicateIcon size={18} />
                    </PressableScale>
                </View>
            </View>
        </View>
    )
}
export default SectionItemWithCopy;