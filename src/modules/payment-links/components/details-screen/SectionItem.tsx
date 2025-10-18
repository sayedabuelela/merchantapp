import { cn } from '@/src/core/utils/cn';
import FontText from '@/src/shared/components/FontText';
import { View } from 'react-native';

interface Props {
    icon: React.ReactNode;
    title: string;
    value?: string | React.ReactNode;
    valueClassName?: string;
}

const SectionItem = ({ icon, title, value, valueClassName }: Props) => {
    if (!value) return null;
    return (
        <View className='flex-row items-start'>
            {icon}
            <View className='ml-2'>
                <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-1 self-start">{title}</FontText>
                <FontText type="body" weight="semi" className={cn("text-content-primary text-base self-start", valueClassName)}>{value}</FontText>
            </View>
        </View>
    )
}
export default SectionItem;