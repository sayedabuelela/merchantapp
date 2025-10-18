import {useRef, useState} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {getOnboardingSlides} from './welcome.service';
import {router} from 'expo-router';
import {useAuthStore} from "@/src/modules/auth/store/auth";

const {width} = Dimensions.get('window');

export function useWelcomeViewModel() {
    const {t} = useTranslation();
    const slides = getOnboardingSlides(t);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList<any>>(null);

    const {setOnboardingComplete} = useAuthStore();

    const handleNext = () => {
        if (activeIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: activeIndex + 1,
                animated: true
            });
        } else {
            completeOnboarding();
        }
    };

    const handleScroll = (e: any) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(newIndex);
    };

    const completeOnboarding = async () => {
        setOnboardingComplete(true);
        router.replace('/(auth)/login');
    };

    return {
        slides,
        activeIndex,
        flatListRef,
        handleNext,
        handleScroll
    };
}
