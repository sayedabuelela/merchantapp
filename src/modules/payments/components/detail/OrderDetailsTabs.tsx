import ListTabs, { Tab } from '@/src/shared/components/ListTabs/ListTabs';
import { OrderDetailsTabType } from '../../payments.model';
import { useTranslation } from 'react-i18next';

interface Props {
    value: OrderDetailsTabType;
    onSelectType: (val: OrderDetailsTabType) => void;
}

export default function OrderDetailsTabs({ value, onSelectType }: Props) {
    const { t } = useTranslation();

    const TABS: Tab<OrderDetailsTabType>[] = [
        { label: t('Details'), value: 'details' },
        { label: t('Settlement'), value: 'settlement' },
        { label: t('History'), value: 'history' },
    ];

    return (
        <ListTabs
            tabs={TABS}
            value={value}
            onSelectType={onSelectType}
            className="my-6"
        />
    );
}
