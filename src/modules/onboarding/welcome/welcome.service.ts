import { OnboardingSlide } from './welcome.model';
import staticImages from "@/src/core/utils/static-images";

type TranslationFunction = (key: string, options?: any) => string; // Example type

export const getOnboardingSlides = (t: TranslationFunction): OnboardingSlide[] => {
    return [
        {
            id: '1',
            title: t('onboarding.slide1.title', 'Login within few seconds!'), // Use translation keys and provide fallbacks
            description: t('onboarding.slide1.description', 'Easily login to the app using fingerprint or face ID.'),
            image: staticImages.onboarding1 // Assuming staticImages is imported
        },
        {
            id: '2',
            title: t('onboarding.slide2.title', 'Receive your payments instantly'),
            description: t('onboarding.slide2.description', 'Create and send invoices via payment links directly from the app.'),
            image: staticImages.onboarding2
        },
        {
            id: '3',
            title: t('onboarding.slide3.title', 'Never lose track of your payments'),
            description: t('onboarding.slide3.description', 'Easily track the status of all our payments with real-time notifications.'),
            image: staticImages.onboarding3
        },
        {
            id: '4',
            title: t('onboarding.slide4.title', 'Receive your payments safely!'),
            description: t('onboarding.slide4.description', 'Kashier is PCI compliant offering your transactions the highest security standards.'),
            image: staticImages.onboarding4
        }
    ];
};
