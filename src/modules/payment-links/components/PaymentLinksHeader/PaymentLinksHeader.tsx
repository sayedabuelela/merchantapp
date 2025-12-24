import { useTranslation } from 'react-i18next';
import { PlusIcon } from 'react-native-heroicons/outline';
import ListHeader from '@/src/shared/components/ListHeader/ListHeader';
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import usePermissions from '@/src/modules/auth/hooks/usePermissions';

interface Props {
    onPlusPress: () => void;
    onFilterPress: () => void;
    onSubmitSearch: (text: string) => void;
    isFilterOpen: boolean;
    isListEmpty: boolean;
    hasFilters: boolean;
    handleClearSearch: () => void;
    searchValue: string;
}

const PaymentLinksHeader = ({ onPlusPress, onFilterPress, onSubmitSearch, isFilterOpen, isListEmpty, hasFilters, handleClearSearch, searchValue }: Props) => {
    const { t } = useTranslation();
    const user = useAuthStore(selectUser);
    const { canCreatePaymentLinks } = usePermissions(user?.actions || {});

    return (
        <ListHeader
            title={t('Payment Links')}
            onFilterPress={onFilterPress}
            onSubmitSearch={onSubmitSearch}
            isFilterOpen={isFilterOpen}
            isListEmpty={isListEmpty}
            hasFilters={hasFilters}
            handleClearSearch={handleClearSearch}
            searchValue={searchValue}
            actionButton={canCreatePaymentLinks ? {
                icon: <PlusIcon size={24} color="#001F5F" />,
                onPress: onPlusPress
            } : undefined}
        />
    )
}

export default PaymentLinksHeader;