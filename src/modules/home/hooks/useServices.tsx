import { useTranslation } from 'react-i18next';
import { Route } from 'expo-router';
import { ROUTES } from '@/src/core/navigation/routes';
import {
    ArrowsUpDownIcon,
    ArrowUpLeftIcon,
    BanknotesIcon,
    LinkIcon,
    PlusIcon,
    QrCodeIcon
} from 'react-native-heroicons/outline';
import { POSIcon } from '@/src/shared/assets/svgs';

export interface ServiceItem {
    title: string;
    description: string;
    href?: Route;
    icon: React.ReactNode;
    onPress?: () => void;
    comingSoon?: boolean;
}

export const useServices = (qrCodeActionPress?: () => void): ServiceItem[] => {
    const { t } = useTranslation();

    return [
        {
            title: t('QR code payments'),
            description: t('Get paid with a QR code'),
            href: '' as Route,
            onPress: qrCodeActionPress,
            icon: <QrCodeIcon size={20} color="#001F5F" />
        },
        {
            title: t('Payment links'),
            description: t('Request payments easily'),
            href: ROUTES.TABS.PAYMENT_LINKS as Route,
            icon: <LinkIcon size={20} color="#001F5F" />
        },
        {
            title: t('Payouts'),
            description: t('Receive your funds'),
            href: (ROUTES.BALANCE.ROOT + '?tab=payout') as Route,
            icon: <BanknotesIcon size={20} color="#001F5F" />
        },
        {
            title: t('Orders'),
            description: t('Track all of your transactions'),
            href: ROUTES.TABS.PAYMENTS as Route,
            icon: <ArrowsUpDownIcon size={20} color="#001F5F" />
        },
        {
            title: t('POS'),
            description: t('Request a new terminal'),
            href: ROUTES.SERVICE.POS_DEVICES as Route,
            icon: <POSIcon />,
            comingSoon: true
        },
        {
            title: t('Transfers'),
            description: t('Send money to others'),
            href: ROUTES.SERVICE.TRANSFERS as Route,
            icon: <ArrowUpLeftIcon size={20} color="#001F5F" />,
            comingSoon: true
        },
    ];
};
