import { NoActivitiesIcon, PaymentLinkFiltersListEmpty, PaymentLinkSearchListEmpty } from "@/src/shared/assets/svgs";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import { ActivityType } from "@/src/modules/balance/balance.model";
import { t } from "i18next";

const getEmptyStateContent = (type: ActivityType) => {
    switch (type) {
        case 'payout':
            return {
                title: t("No payout activities yet!"),
                description: t("Your payout activities will appear here once you start making payouts.")
            };
        case 'transfer':
            return {
                title: t("No transfer activities yet!"),
                description: t("Your transfer activities will appear here once you start making transfers.")
            };
        case 'all':
        default:
            return {
                title: t("No balance activities yet!"),
                description: t("Your balance activities will appear here once you start receiving payments or making payouts.")
            };
    }
};

const ListDataEmptyComponent = ({ type }: { type: ActivityType }) => {
    const { title, description } = getEmptyStateContent(type);

    return (
        <EmptyDataList
            icon={<NoActivitiesIcon />}
            title={title}
            description={description}
        />
    );
}

const ListEmptySearchComponent = ({ inputSearch, onClear }: { inputSearch: string; onClear: () => void }) => (
    <EmptyDataList
        icon={<PaymentLinkSearchListEmpty />}
        title={`${t("No results found for")} "${inputSearch}"`}
        description={t(
            "Check the spelling or try different keywords to find the activities you're looking for."
        )}
        buttonLabel={t("Clear search")}
        onButtonPress={onClear}
        buttonVariant="outline"
        buttonIconType="xicon"
    />
)

const ListEmptyFiltersComponent = ({ onClear }: { onClear: () => void }) => (
    <EmptyDataList
        icon={<PaymentLinkFiltersListEmpty />}
        title={t("No activities match this filter")}
        description={t("You might want to adjust your filters to find the activities you're looking for.")}
        buttonLabel={t("Clear filters")}
        onButtonPress={onClear}
        buttonVariant="outline"
        buttonIconType="xicon"
    />
)

interface Props {
    search: string;
    hasFilters: boolean;
    type: ActivityType;
    handleClearSearch: () => void;
    handleClearFilters: () => void;
}

const ActivitiesListEmpty = ({ search, hasFilters, type, handleClearSearch, handleClearFilters }: Props) => {
    if (search) {
        return <ListEmptySearchComponent inputSearch={search} onClear={handleClearSearch} />
    } else if (hasFilters) {
        return <ListEmptyFiltersComponent onClear={handleClearFilters} />
    } else {
        return <ListDataEmptyComponent type={type} />
    }
}

export default ActivitiesListEmpty;