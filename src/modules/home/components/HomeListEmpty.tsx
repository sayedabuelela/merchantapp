import { NoActivitiesIcon } from "@/src/shared/assets/svgs";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import { HomeTabType } from "../home.model";
import { t } from "i18next";

const getEmptyStateContent = (activeTab: HomeTabType) => {
    switch (activeTab) {
        case 'orders':
            return {
                title: t("No recent orders"),
                description: t("Recent payment sessions will appear here")
            };
        case 'payouts':
            return {
                title: t("No recent payouts"),
                description: t("Recent scheduled transfers will appear here")
            };
        case 'transfers':
            return {
                title: t("No recent transfers"),
                description: t("Recent on-demand transfers will appear here")
            };
        case 'all':
        default:
            return {
                title: t("No recent activities"),
                description: t("Your recent activities will appear here")
            };
    }
};

interface Props {
    activeTab: HomeTabType;
}

const HomeListEmpty = ({ activeTab }: Props) => {
    const { title, description } = getEmptyStateContent(activeTab);

    return (
        <EmptyDataList
            icon={<NoActivitiesIcon />}
            title={title}
            description={description}
        />
    );
};

export default HomeListEmpty;
