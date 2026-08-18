import { cn } from '@/src/core/utils/cn';
import FontText from '@/src/shared/components/FontText';
import { View } from 'react-native';

interface Props {
    icon?: React.ReactNode;
    title?: string;
    /** Optional control at the end of the header row, e.g. a collapse chevron */
    trailing?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const DetailsSection = ({ icon, title, trailing, children, className }: Props) => {
    return (
        <View className={cn(`p-4 border border-tertiary rounded gap-y-2.5`, className)}>
            {title && (
                <View className='flex-row items-center justify-between mb-0.5'>
                    <View className='flex-row items-center flex-1'>
                        {icon && icon}
                        <FontText type="body" weight="bold"
                            className={cn("text-content-secondary text-base self-start", icon ? 'ms-2' : '')}>{title}</FontText>
                    </View>
                    {trailing}
                </View>
            )}
            {children}
        </View>
    )
}
export default DetailsSection;
