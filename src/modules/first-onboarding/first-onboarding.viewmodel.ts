import { useRef, useCallback, useState } from 'react';
import { FlatList, ViewToken, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/src/core/navigation/routes';
import { useFirstOnboardingStore, selectSetHasSeenOnboarding } from './first-onboarding.store';
import { FIRST_ONBOARDING_SLIDES } from './first-onboarding.data';
import { FirstOnboardingSlide } from './first-onboarding.model';

export const useFirstOnboardingViewModel = () => {
    const router = useRouter();
    const { width: screenWidth } = useWindowDimensions();
    const setHasSeenOnboarding = useFirstOnboardingStore(selectSetHasSeenOnboarding);

    const flatListRef = useRef<FlatList<FirstOnboardingSlide>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = FIRST_ONBOARDING_SLIDES;
    const isLastSlide = currentIndex === slides.length - 1;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const handleViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                setCurrentIndex(viewableItems[0].index);
            }
        }
    ).current;

    const keyExtractor = useCallback((item: FirstOnboardingSlide) => item.id, []);

    const getItemLayout = useCallback(
        (_: unknown, index: number) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
        }),
        [screenWidth]
    );

    const handleContinue = useCallback(() => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    }, [currentIndex, slides.length]);

    const handleSkip = useCallback(() => {
        flatListRef.current?.scrollToIndex({
            index: slides.length - 1,
            animated: true,
        });
    }, [slides.length]);

    const completeOnboarding = useCallback(() => {
        setHasSeenOnboarding(true);
    }, [setHasSeenOnboarding]);

    const handleLogin = useCallback(() => {
        completeOnboarding();
        router.replace(ROUTES.AUTH.LOGIN);
    }, [completeOnboarding, router]);

    const handleRegister = useCallback(() => {
        completeOnboarding();
        router.replace(ROUTES.AUTH.REGISTER_EMAIL);
    }, [completeOnboarding, router]);

    return {
        flatListRef,
        slides,
        currentIndex,
        isLastSlide,
        screenWidth,
        viewabilityConfig,
        handleViewableItemsChanged,
        keyExtractor,
        getItemLayout,
        handleContinue,
        handleSkip,
        handleLogin,
        handleRegister,
    };
};
