import PaymentLinksScreen from '@/src/modules/payment-links/views/list';
import { Redirect } from 'expo-router';
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import usePermissions from '@/src/modules/auth/hooks/usePermissions';
import { ROUTES } from '@/src/core/navigation/routes';

export default function PaymentLinks() {
    const user = useAuthStore(selectUser);
    const { canViewPaymentLinks } = usePermissions(user?.actions || {});

    if (!canViewPaymentLinks) {
        return <Redirect href={ROUTES.TABS.HOME} />;
    }

    return <PaymentLinksScreen />
}
