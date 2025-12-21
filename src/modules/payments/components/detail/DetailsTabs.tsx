import { cn } from '@/src/core/utils/cn';
import ListTabs, { Tab } from '@/src/shared/components/ListTabs/ListTabs';
import { useTranslation } from 'react-i18next';

interface Props<T extends string> {
    value: T;
    onSelectType: (val: T) => void;
    className?: string;
    contentContainerClassName?: string;
}

/**
 * Generic tabs component for detail screens (orders and transactions)
 * Supports both OrderDetailsTabType and TransactionDetailsTabType
 */
export default function DetailsTabs<T extends string>({ value, onSelectType, className, contentContainerClassName }: Props<T>) {
    const { t } = useTranslation();

    const TABS: Tab<T>[] = [
        { label: t('Details'), value: 'details' as T },
        { label: t('Settlement'), value: 'settlement' as T },
        { label: t('History'), value: 'history' as T },
    ];

    return (
        <ListTabs
            tabs={TABS}
            value={value}
            onSelectType={onSelectType}
            className={cn("my-4", className)}
            contentContainerClassName={contentContainerClassName}
        />
    );
}
