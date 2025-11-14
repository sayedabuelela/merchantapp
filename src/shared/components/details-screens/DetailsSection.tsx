import {cn} from '@/src/core/utils/cn';
import FontText from '@/src/shared/components/FontText';
import {View} from 'react-native';

interface Props {
    icon?: React.ReactNode;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const DetailsSection = ({icon, title, children, className}: Props) => {
    return (
        <View className={cn(`p-4 border border-tertiary rounded gap-y-2`, className)}>
            {title && (
                <View className='flex-row items-center border-b border-tertiary pb-2 mb-2'>
                    {icon && icon}
                    <FontText type="body" weight="bold"
                              className="text-content-secondary ml-2 text-base self-start">{title}</FontText>
                </View>
            )}
            {children}
        </View>
    )
}
export default DetailsSection;