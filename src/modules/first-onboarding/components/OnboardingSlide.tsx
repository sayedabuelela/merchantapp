import { memo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';
import { FirstOnboardingSlide } from '../first-onboarding.model';
import FontText from '@/src/shared/components/FontText';

interface OnboardingSlideProps {
    slide: FirstOnboardingSlide;
}

const OnboardingSlide = memo(({ slide }: OnboardingSlideProps) => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const { HeroComponent, titleKey, titleFallback, descriptionKey, descriptionFallback, hasIntegratedText } = slide;

    return (
        <View style={{ width }} className="flex-1 items-center justify-center px-8">
            <View className="flex-1 justify-center items-center w-full">
                <HeroComponent />
            </View>
            {!hasIntegratedText && (
                <View className="pb-8">
                    <FadeInUpView delay={200}>
                        <FontText className="text-2xl text-gray-900 text-center mb-3" type="head" weight="bold">
                            {t(titleKey, titleFallback)}
                        </FontText>
                    </FadeInUpView>
                    <FadeInUpView delay={300}>
                        <FontText className="text-base text-content-secondary text-center leading-6 px-3" type="body" weight="regular">
                            {t(descriptionKey, descriptionFallback)}
                        </FontText>
                    </FadeInUpView>
                </View>
            )}
        </View>
    );
});

OnboardingSlide.displayName = 'OnboardingSlide';

export default OnboardingSlide;
