import { MotiView } from 'moti';
import { View } from 'react-native';
import { Image } from 'expo-image';

const OrdersHero = () => (
    <View className="flex-1 items-center justify-center h-72 w-full ">
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 100, damping: 15 }}
        >
            {/* <OnboardingSlide1AllIcons width={400} height={500} /> */}
            <Image
                source={require('@/src/shared/assets/images/first-onboarding/third-slide/third-slide-all-icons.png')}
                // className="w-50 h-50"
                style={{ width: 400, height: '110%' }}
                contentFit="scale-down"
            />
        </MotiView>
    </View>
);

export default OrdersHero;
