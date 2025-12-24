import { useTranslation } from "react-i18next";
import ListTabs, { Tab } from "@/src/shared/components/ListTabs/ListTabs";
import { HomeTabType } from "../home.model";

interface Props {
    value: HomeTabType;
    onSelectType: (type: HomeTabType) => void;
}

const HomeTabs = ({ value, onSelectType }: Props) => {
    const { t } = useTranslation();

    const tabs: Tab<HomeTabType>[] = [
        { label: t('All balance'), value: 'all' },
        { label: t('Payments'), value: 'orders' },
        { label: t('Payouts'), value: 'payouts' },
        { label: t('Transfers'), value: 'transfers' }
    ];

    return <ListTabs tabs={tabs} value={value} onSelectType={onSelectType} />;
};

export default HomeTabs;
