import { MotiView } from 'moti';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { OnboardingSlide5KashierLogo } from '@/src/shared/assets/svgs';

const NotificationsHero = () => (
    <View className="flex-1 items-center h-72 w-full ">
       <View className="mt-12">
         <OnboardingSlide5KashierLogo />
       </View>
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 100, damping: 15 }}
        >
            {/* <OnboardingSlide1AllIcons width={400} height={500} /> */}
            <Image
                source={require('@/src/shared/assets/images/first-onboarding/fifth-slide/fifth-slide-all-icons.png')}
                // className="w-50 h-50"
                style={{ width: 400, height: '100%' }}
                contentFit="scale-down"
            />
          
        </MotiView>
    </View>
);

export default NotificationsHero;
