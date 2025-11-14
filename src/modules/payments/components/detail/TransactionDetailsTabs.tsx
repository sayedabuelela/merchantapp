import ListTabs, { Tab } from '@/src/shared/components/ListTabs/ListTabs';
import { TransactionDetailsTabType } from '../../payments.model';
import { useTranslation } from 'react-i18next';

interface Props {
    value: TransactionDetailsTabType;
    onSelectType: (val: TransactionDetailsTabType) => void;
}

export default function TransactionDetailsTabs({ value, onSelectType }: Props) {
    const { t } = useTranslation();

    const TABS: Tab<TransactionDetailsTabType>[] = [
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
