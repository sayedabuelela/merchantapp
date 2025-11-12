import ListTabs, { Tab } from "@/src/shared/components/ListTabs/ListTabs";
import { ActivityType } from "../balance.model";

const TABS: Tab<ActivityType>[] = [
    { label: "Payouts", value: "payout" },
    { label: "Transfers", value: "transfer" },
    { label: "All Activities", value: "all" },
];

interface Props {
    value: ActivityType;
    onSelectType: (val: ActivityType) => void;
    isListEmpty?: boolean;
}

export default function ActivitiesTabs({ value, onSelectType, isListEmpty }: Props) {
    return (
        <ListTabs
            tabs={TABS}
            value={value}
            onSelectType={onSelectType}
            isListEmpty={isListEmpty}
        />
    );
}
