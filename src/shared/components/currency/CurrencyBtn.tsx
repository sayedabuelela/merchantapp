import { selectSelectedCurrency, useCurrencyStore } from '@/src/core/stores/currency.store';
import CurrencyTrigger from './CurrencyTrigger';

/**
 * Pill trigger for the dashboard currency switcher (mirrors AccountsBtn).
 * Reads the global selection; the form dropdown uses CurrencyTrigger directly
 * against its own field value.
 */
const CurrencyBtn = ({ onPress, className }: { onPress: () => void; className?: string }) => {
    const selectedCurrency = useCurrencyStore(selectSelectedCurrency);

    return <CurrencyTrigger currency={selectedCurrency} onPress={onPress} bordered className={className} />;
};

export default CurrencyBtn;
