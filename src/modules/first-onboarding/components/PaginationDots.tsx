import { View } from 'react-native';
import { MotiView } from 'moti';

interface PaginationDotsProps {
    total: number;
    activeIndex: number;
}

const PaginationDots = ({ total, activeIndex }: PaginationDotsProps) => {
    return (
        <View className="flex-row justify-center items-center gap-2">
            {Array.from({ length: total }).map((_, index) => (
                <MotiView
                    key={index}
                    animate={{
                        width: index === activeIndex ? 24 : 8,
                        backgroundColor: index === activeIndex ? '#2563EB' : '#D1D5DB',
                    }}
                    transition={{
                        type: 'spring',
                        damping: 15,
                        stiffness: 200,
                    }}
                    style={{
                        height: 8,
                        borderRadius: 4,
                    }}
                />
            ))}
        </View>
    );
};

export default PaginationDots;
