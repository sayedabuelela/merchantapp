import {useTranslation} from 'react-i18next';
import ListHeader from '@/src/shared/components/ListHeader/ListHeader';

interface Props {
    onFilterPress: () => void;
    onSubmitSearch: (text: string) => void;
    isFilterOpen: boolean;
    isListEmpty: boolean;
    hasFilters: boolean;
    handleClearSearch: () => void;
    searchValue: string;
    showFilters?: boolean
    backBtn?: boolean
}

const InstantSettlementHeader = ({
                                     backBtn = false,
                                     onFilterPress,
                                     onSubmitSearch,
                                     isFilterOpen,
                                     isListEmpty,
                                     hasFilters,
                                     handleClearSearch,
                                     searchValue,
                                     showFilters
                                 }: Props) => {
    const {t} = useTranslation();

    return (
        <ListHeader
            title={t('Instant settlement')}
            onFilterPress={onFilterPress}
            onSubmitSearch={onSubmitSearch}
            isFilterOpen={isFilterOpen}
            isListEmpty={isListEmpty}
            hasFilters={hasFilters}
            handleClearSearch={handleClearSearch}
            searchValue={searchValue}
            showFilters={showFilters}
            backBtn={backBtn}
            className='border-b border-stroke-main pb-4 mb-6'
        />
    )
}

export default InstantSettlementHeader;
