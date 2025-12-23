import ListTabs, {Tab} from "@/src/shared/components/ListTabs/ListTabs";

const TABS: Tab[] = [
    {label: "Orders", value: "sessions"},
    {label: "Transactions", value: "transactions"},
];

interface Props {
    value: string;
    onSelectType: (val: string) => void;
    isListEmpty?: boolean;
    contentContainerClassName?: string;
}

export default function PaymentsTabs({value, onSelectType, isListEmpty, contentContainerClassName}: Props) {
    return (
        <ListTabs
            tabs={TABS}
            value={value}
            onSelectType={onSelectType}
            isListEmpty={isListEmpty}
            contentContainerClassName={contentContainerClassName}
        />
    );
}
