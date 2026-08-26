import { ScrollView, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CheckBoxFilledIcon, CheckBoxEmptyIcon } from '@/src/shared/assets/svgs';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import { useEnvironment } from '@/src/core/environment/useEnvironment.hook';
import {
    BASE_CURRENCY,
    CURRENCY_NAMES,
    currencyLabel,
    SelectedCurrencyId,
    VIRTUAL_CURRENCIES,
    VIRTUAL_TO_DISPLAY,
} from '@/src/core/constants/currencies';
import useCurrencyConversionEnabled from '@/src/shared/hooks/useCurrencyConversionEnabled';
import CurrencyFlag from './CurrencyFlag';
import VirtualBadge from './VirtualBadge';

interface CurrencyItemProps {
    /** Display code shown to the merchant, e.g. 'USD'. */
    code: string;
    /** API id emitted on select, e.g. 'USD' (main) or 'USD_VIRTUAL' (virtual).
     *  Kept separate from `code` so the two USD rows are distinguishable. */
    value: SelectedCurrencyId;
    isVirtual?: boolean;
    isActive?: boolean;
    onSelect: (currency: SelectedCurrencyId) => void;
}

const CurrencyItem = ({ code, value, isVirtual, isActive, onSelect }: CurrencyItemProps) => {
    const { t } = useTranslation();
    const label = currencyLabel(t, code);
    // In English the heading is the code and the sub-line the name ("USD" / "US Dollar").
    // In Arabic both resolve to the same phrase, so the sub-line would only repeat it.
    const fullName = CURRENCY_NAMES[code] ? t(CURRENCY_NAMES[code]) : '';
    return (
        <Pressable
            className={cn(
                'border border-stroke-main rounded p-2 flex-row items-center mb-2',
                isActive && 'border-primary'
            )}
            onPress={() => onSelect(value)}
        >
            {isActive ? <CheckBoxFilledIcon /> : <CheckBoxEmptyIcon />}
            <View className="ml-2 flex-1 flex-row items-center justify-between">
                <View className="flex-1">
                    <View className="flex-row items-center gap-x-1.5">
                        <FontText type="body" weight="semi" className="text-content-primary text-sm">
                            {label}
                        </FontText>
                        {isVirtual && <VirtualBadge />}
                    </View>
                    {fullName !== '' && fullName !== label && (
                        <FontText type="body" weight="regular" className="text-light-gray text-xs">
                            {fullName}
                        </FontText>
                    )}
                </View>
                <CurrencyFlag currency={code} size={22} />
            </View>
        </Pressable>
    );
};

const GroupLabel = ({ label }: { label: string }) => (
    <FontText
        type="body"
        weight="regular"
        className="text-light-gray text-xs uppercase mb-2 mt-1"
        style={{ letterSpacing: 0.5 }}
    >
        {label}
    </FontText>
);

interface Props {
    selectedCurrency: SelectedCurrencyId | null;
    onSelectCurrency: (currency: SelectedCurrencyId) => void;
}

/**
 * Grouped currency list: merchant real currencies first ("Main currencies",
 * order preserved from user.currencies), then the five virtual currencies.
 */
const CurrencyList = ({ selectedCurrency, onSelectCurrency }: Props) => {
    const { t } = useTranslation();
    const user = useAuthStore(selectUser);
    const { isLiveMode } = useEnvironment();
    // The form dropdown renders this list whether or not the merchant has the
    // feature, so the virtual group is gated here rather than at every caller.
    const isCurrencyConversionEnabled = useCurrencyConversionEnabled();

    const merchantCurrencies = isLiveMode ? user?.currencies ?? [] : user?.currenciesTest ?? [];
    // Always offer EGP even if the merchant currency list is empty
    const mainCurrencies = merchantCurrencies.length > 0 ? merchantCurrencies : [BASE_CURRENCY];

    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <GroupLabel label={t('Main currencies')} />
            {mainCurrencies.map((code) => (
                <CurrencyItem
                    key={code}
                    code={code}
                    value={code}
                    isActive={selectedCurrency === code}
                    onSelect={onSelectCurrency}
                />
            ))}

            {isCurrencyConversionEnabled && <GroupLabel label={t('Virtual currencies')} />}
            {isCurrencyConversionEnabled && VIRTUAL_CURRENCIES.map((id) => (
                // Selects the virtual id, not the display code — a merchant with
                // USD in user.currencies would otherwise be unable to tell the
                // two USD rows apart, and both would render checked.
                <CurrencyItem
                    key={id}
                    code={VIRTUAL_TO_DISPLAY[id]}
                    value={id}
                    isVirtual
                    isActive={selectedCurrency === id}
                    onSelect={onSelectCurrency}
                />
            ))}
        </ScrollView>
    );
};

export default CurrencyList;
