import { cn } from '@/src/core/utils/cn';
import FontText from '@/src/shared/components/FontText';
import { View } from 'react-native';

interface Props {
    icon?: React.ReactNode;
    title: string;
    value?: string | React.ReactNode;
    valueClassName?: string;
    labelClassName?: string;
}

const SectionItem = ({ icon, title, value, valueClassName, labelClassName }: Props) => {
    if (!value) return null;
    return (
        <View className='flex-row items-start'>
            {icon && icon}
            <View className='ml-2'>
                <FontText type="body" weight="regular" className={cn("text-content-secondary text-sm mb-1 self-start", labelClassName)}>{title}</FontText>
                <FontText type="body" weight="semi" className={cn("text-content-primary text-sm self-start", valueClassName)}>{value}</FontText>
            </View>
        </View>
    )
}
export default SectionItem;