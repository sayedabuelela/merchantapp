import { PaymentLinkFiltersListEmpty, PaymentLinkListEmpty, PaymentLinkSearchListEmpty } from "@/src/shared/assets/svgs";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import { t } from "i18next";

const ListDataEmptyComponent = ({ handleShowCreatePLModal }: { handleShowCreatePLModal: () => void }) => (
    <EmptyDataList
        icon={<PaymentLinkListEmpty />}
        title={t("Ready to get paid?")}
        description={t("Create your first payment link to start accepting payments from customers.")}
        buttonLabel={t("New payment link")}
        onButtonPress={handleShowCreatePLModal}
        buttonVariant="primary"
        buttonIconType="plus"
    />
)

const ListEmptySearchComponent = ({ inputSearch, onClear }: { inputSearch: string; onClear: () => void }) => (
    <EmptyDataList
        icon={<PaymentLinkSearchListEmpty />}
        title={`${t("No results found for")} "${inputSearch}"`}
        description={t(
            "Check the spelling or try different keywords. You can also search by customer name, link ID or payment amounts."
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
        title={t("No payment links match this filter.")}
        description={t(
            "You might want to adjust your filter to find the customers you're looking for."
        )}
        buttonLabel={t("Clear filters")}
        onButtonPress={onClear}
        buttonVariant="outline"
        buttonIconType="xicon"
    />
)
interface Props {
    search: string;
    hasFilters: boolean;
    handleClearSearch: () => void;
    handleClearFilters: () => void;
    handleToggleCreateNew: () => void;
}

const PaymentLinksListEmpty = ({ search, hasFilters, handleClearSearch, handleClearFilters, handleToggleCreateNew }: Props) => {
    if (search) {
        return <ListEmptySearchComponent inputSearch={search} onClear={handleClearSearch} />
    } else if (hasFilters) {
        return <ListEmptyFiltersComponent onClear={handleClearFilters} />
    } else {
        return <ListDataEmptyComponent handleShowCreatePLModal={handleToggleCreateNew} />
    }
}

export default PaymentLinksListEmpty;