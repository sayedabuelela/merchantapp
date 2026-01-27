import { MotiView } from 'moti';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';
import FontText from '@/src/shared/components/FontText';

const BalanceHero = () => {
    const { t } = useTranslation();

    return (
        <View className="flex-1 w-full  items-center justify-center  relative">
            {/* Image taking up most of the space */}
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 100, damping: 15 }}
            >
                {/* <OnboardingSlide1AllIcons width={400} height={500} /> */}
                <Image
                    source={require('@/src/shared/assets/images/first-onboarding/forth-slide/forth-slide-all-icons.png')}
                    // className="w-50 h-50"
                    style={{ width: 400, height: '100%' }}
                    contentFit="scale-down"
                />
            </MotiView>

            {/* Text overlay at the bottom */}
            <View className="absolute bottom-0 w-full pb-8 px-8">
                <FadeInUpView delay={200}>
                    <FontText className="text-2xl text-gray-900 text-center mb-3" type="head" weight="semi">
                        {t('firstOnboarding.slide4.title', 'Track your balance')}
                    </FontText>
                </FadeInUpView>
                <FadeInUpView delay={300}>
                    <FontText className="text-base text-gray-600 text-center leading-6" type="body" weight="regular">
                        {t('firstOnboarding.slide4.description', 'Monitor your earnings and payouts with real-time balance updates.')}
                    </FontText>
                </FadeInUpView>
            </View>
        </View>
    );
};

export default BalanceHero;
