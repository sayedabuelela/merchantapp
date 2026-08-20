import { Pressable } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import { isVirtualCurrency, SelectedCurrencyId, toDisplayCode } from '@/src/core/constants/currencies';
import CurrencyFlag from './CurrencyFlag';
import VirtualBadge from './VirtualBadge';

interface Props {
    /** API id — 'EGP', a main code like 'USD', or 'USD_VIRTUAL'. */
    currency?: SelectedCurrencyId | null;
    onPress: () => void;
    /** Rounded outline, as the dashboard pill wears it. Off when the trigger
     *  sits inside an input that already draws the border. */
    bordered?: boolean;
    className?: string;
}

/**
 * The currency affordance: flag, display code, a Virtual marker when the id is a
 * virtual one, and a chevron. Shared by the dashboard switcher and the form
 * dropdown so a merchant reads the same thing in both places.
 */
const CurrencyTrigger = ({ currency, onPress, bordered = false, className }: Props) => {
    // Callers hold the API id ('USD_VIRTUAL'); the trigger shows the display code.
    const displayCode = toDisplayCode(currency);

    return (
        <Pressable
            onPress={onPress}
            className={cn(
                'flex-row items-center',
                bordered ? 'rounded-full border border-[#F5F6F6] p-1 px-2' : 'ps-2',
                className
            )}
        >
            <CurrencyFlag currency={displayCode} size={16} />
            {/* Raw display code (not t()) — trigger stays compact in both languages */}
            <FontText type="body" weight="regular" className="text-primary ml-1 mr-1 text-xs">
                {displayCode}
            </FontText>
            {isVirtualCurrency(currency) && <VirtualBadge className="mr-1" />}
            <ChevronDownIcon size={14} color="#001F5F" />
        </Pressable>
    );
};

export default CurrencyTrigger;
