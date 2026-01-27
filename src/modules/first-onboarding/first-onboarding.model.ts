import { ComponentType } from 'react';

export interface FirstOnboardingSlide {
    id: string;
    titleKey: string;
    titleFallback: string;
    descriptionKey: string;
    descriptionFallback: string;
    HeroComponent: ComponentType;
    hasIntegratedText?: boolean; // If true, text is rendered inside HeroComponent
}

export interface FirstOnboardingState {
    hasSeenOnboarding: boolean;
    setHasSeenOnboarding: (value: boolean) => void;
}
