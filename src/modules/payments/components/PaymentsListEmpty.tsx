import { PaymentLinkFiltersListEmpty, PaymentLinkSearchListEmpty, PaymentsEmptyListIcon } from "@/src/shared/assets/svgs";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import { t } from "i18next";

const ListDataEmptyComponent = ({ currentTab, handleCreatePaymentLink }: { currentTab: 'sessions' | 'transactions'; handleCreatePaymentLink: () => void }) => {
    const isOrdersTab = currentTab === 'sessions';

    return (
        <EmptyDataList
            icon={<PaymentsEmptyListIcon />}
            title={t(isOrdersTab ? "No payment orders yet!" : "No payment transactions yet!")}
            description={t(
                isOrdersTab
                    ? "Start accepting payments by creating your first payment link"
                    : "Your transaction history will appear here once you receive payments"
            )}
            buttonLabel={isOrdersTab ? t("Create Payment Link") : undefined}
            onButtonPress={isOrdersTab ? handleCreatePaymentLink : undefined}
            buttonVariant="primary"
            buttonIconType="plus"
        />
    );
};

const ListEmptySearchComponent = ({ inputSearch, onClear }: { inputSearch: string; onClear: () => void }) => (
    <EmptyDataList
        icon={<PaymentLinkSearchListEmpty />}
        title={`${t("No results found for")} "${inputSearch}"`}
        description={t(
            "Check the spelling or try different keywords. You can also search by order ID, transaction ID or payment amounts."
        )}
        buttonLabel={t("Clear search")}
        onButtonPress={onClear}
        buttonVariant="outline"
        buttonIconType="xicon"
    />
);

const ListEmptyFiltersComponent = ({ onClear }: { onClear: () => void }) => (
    <EmptyDataList
        icon={<PaymentLinkFiltersListEmpty />}
        title={t("No payments match this filter.")}
        description={t("You might want to adjust your filter to find the payments you're looking for.")}
        buttonLabel={t("Clear filters")}
        onButtonPress={onClear}
        buttonVariant="outline"
        buttonIconType="xicon"
    />
);

interface Props {
    currentTab: 'sessions' | 'transactions';
    search: string;
    hasFilters: boolean;
    handleClearSearch: () => void;
    handleClearFilters: () => void;
    handleCreatePaymentLink: () => void;
}

const PaymentsListEmpty = ({ currentTab, search, hasFilters, handleClearSearch, handleClearFilters, handleCreatePaymentLink }: Props) => {
    if (search) {
        return <ListEmptySearchComponent inputSearch={search} onClear={handleClearSearch} />;
    } else if (hasFilters) {
        return <ListEmptyFiltersComponent onClear={handleClearFilters} />;
    } else {
        return <ListDataEmptyComponent currentTab={currentTab} handleCreatePaymentLink={handleCreatePaymentLink} />;
    }
};

export default PaymentsListEmpty;
