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
    className?: string;
}

const ActivitiesHeader = ({ onFilterPress, onSubmitSearch, isFilterOpen, isListEmpty, hasFilters, handleClearSearch, searchValue, className }: Props) => {
    const { t } = useTranslation();

    return (
        <ListHeader
            title={t('Balances')}
            onFilterPress={onFilterPress}
            onSubmitSearch={onSubmitSearch}
            isFilterOpen={isFilterOpen}
            isListEmpty={isListEmpty}
            hasFilters={hasFilters}
            handleClearSearch={handleClearSearch}
            searchValue={searchValue}
            className={className}
        />
    )
}

export default ActivitiesHeader;