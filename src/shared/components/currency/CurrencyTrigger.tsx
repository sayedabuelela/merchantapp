import { Pressable, View } from 'react-native';
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
            // shrink + min-w-0: inside an input the trigger shares a row with the
            // amount field, and RN defaults flexShrink to 0. Without this the
            // trigger stays rigid and squeezes the amount out of the box.
            className={cn(
                'flex-row items-center shrink min-w-0',
                bordered ? 'rounded-full border border-[#F5F6F6] p-1 px-2' : 'ps-1',
                className
            )}
        >
            <View className="shrink-0">
                <CurrencyFlag currency={displayCode} size={16} />
            </View>
            {/* Raw display code (not t()) — trigger stays compact in both languages */}
            <FontText
                type="body"
                weight="regular"
                className="text-primary ml-1 mr-0.5 text-xs shrink-0"
                numberOfLines={1}
            >
                {displayCode}
            </FontText>
            {/* The badge is the one piece allowed to give way when space runs out */}
            {isVirtualCurrency(currency) && <VirtualBadge className="mr-0.5 shrink min-w-0" />}
            <View className="shrink-0">
                <ChevronDownIcon size={14} color="#001F5F" />
            </View>
        </Pressable>
    );
};

export default CurrencyTrigger;
