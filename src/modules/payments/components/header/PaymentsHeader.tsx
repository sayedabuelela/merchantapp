import { useTranslation } from 'react-i18next';
import ListHeader from '@/src/shared/components/ListHeader/ListHeader';

interface Props {
    onFilterPress: () => void;
    onSubmitSearch: (text: string) => void;
    isFilterOpen: boolean;
    isListEmpty: boolean;
    hasFilters: boolean;
    handleClearSearch: () => void;
    searchValue: string;
}

const PaymentsHeader = ({ onFilterPress, onSubmitSearch, isFilterOpen, isListEmpty, hasFilters, handleClearSearch, searchValue }: Props) => {
    const { t } = useTranslation();

    return (
        <ListHeader
            title={t('Payments')}
            onFilterPress={onFilterPress}
            onSubmitSearch={onSubmitSearch}
            isFilterOpen={isFilterOpen}
            isListEmpty={isListEmpty}
            hasFilters={hasFilters}
            handleClearSearch={handleClearSearch}
            searchValue={searchValue}
        />
    )
}

export default PaymentsHeader;
