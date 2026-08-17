import { Pressable } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import { selectSelectedCurrency, useCurrencyStore } from '@/src/core/stores/currency.store';
import { isVirtualDisplayCode } from '@/src/core/constants/currencies';
import CurrencyFlag from './CurrencyFlag';
import VirtualBadge from './VirtualBadge';

/**
 * Pill trigger for the dashboard currency switcher (mirrors AccountsBtn).
 */
const CurrencyBtn = ({ onPress, className }: { onPress: () => void; className?: string }) => {
    const selectedCurrency = useCurrencyStore(selectSelectedCurrency);

    return (
        <Pressable
            onPress={onPress}
            className={cn('flex-row items-center rounded-full border border-[#F5F6F6] p-1 px-2', className)}
        >
            <CurrencyFlag currency={selectedCurrency} size={16} />
            {/* Raw display code (not t()) — pill stays compact in both languages */}
            <FontText type="body" weight="regular" className="text-primary ml-1 mr-1 text-xs">
                {selectedCurrency}
            </FontText>
            {isVirtualDisplayCode(selectedCurrency) && <VirtualBadge className="mr-1" />}
            <ChevronDownIcon size={14} color="#001F5F" />
        </Pressable>
    );
};

export default CurrencyBtn;
