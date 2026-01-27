import { FirstOnboardingSlide } from './first-onboarding.model';
import PaymentLinksHero from './components/slides/PaymentLinksHero';
import QRCodeHero from './components/slides/QRCodeHero';
import OrdersHero from './components/slides/OrdersHero';
import BalanceHero from './components/slides/BalanceHero';
import NotificationsHero from './components/slides/NotificationsHero';

export const FIRST_ONBOARDING_SLIDES: FirstOnboardingSlide[] = [
    {
        id: 'payment-links',
        titleKey: 'firstOnboarding.slide1.title',
        titleFallback: 'Create payment links',
        descriptionKey: 'firstOnboarding.slide1.description',
        descriptionFallback: 'Send secure payment links to get paid faster with custom options.',
        HeroComponent: PaymentLinksHero,
    },
    {
        id: 'qr-code',
        titleKey: 'firstOnboarding.slide2.title',
        titleFallback: 'Share with QR code',
        descriptionKey: 'firstOnboarding.slide2.description',
        descriptionFallback: 'Create QR codes for easy payment allowing customers to scan and pay.',
        HeroComponent: QRCodeHero,
    },
    {
        id: 'orders',
        titleKey: 'firstOnboarding.slide3.title',
        titleFallback: 'Manage your orders',
        descriptionKey: 'firstOnboarding.slide3.description',
        descriptionFallback: 'Monitor all your payments in one place with real-time status updates.',
        HeroComponent: OrdersHero,
    },
    {
        id: 'balance',
        titleKey: 'firstOnboarding.slide4.title',
        titleFallback: 'Track your balance',
        descriptionKey: 'firstOnboarding.slide4.description',
        descriptionFallback: 'Monitor and manage your balance and transactions easily.',
        HeroComponent: BalanceHero,
        hasIntegratedText: true, // Text is rendered inside the hero
    },
    {
        id: 'notifications',
        titleKey: 'firstOnboarding.slide5.title',
        titleFallback: 'Stay notified',
        descriptionKey: 'firstOnboarding.slide5.description',
        descriptionFallback: 'Get instant notifications for orders, payments, and account activities.',
        HeroComponent: NotificationsHero,
    },
];
