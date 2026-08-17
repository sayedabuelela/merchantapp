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
    SelectableCurrency,
    VIRTUAL_CURRENCIES,
    VIRTUAL_TO_DISPLAY,
} from '@/src/core/constants/currencies';
import CurrencyFlag from './CurrencyFlag';
import VirtualBadge from './VirtualBadge';

interface CurrencyItemProps {
    code: string;
    isVirtual?: boolean;
    isActive?: boolean;
    onSelect: (code: string) => void;
}

const CurrencyItem = ({ code, isVirtual, isActive, onSelect }: CurrencyItemProps) => {
    const { t } = useTranslation();
    return (
        <Pressable
            className={cn(
                'border border-stroke-main rounded p-2 flex-row items-center mb-2',
                isActive && 'border-primary'
            )}
            onPress={() => onSelect(code)}
        >
            {isActive ? <CheckBoxFilledIcon /> : <CheckBoxEmptyIcon />}
            <View className="ml-2 flex-1 flex-row items-center justify-between">
                <View className="flex-1">
                    <View className="flex-row items-center gap-x-1.5">
                        <FontText type="body" weight="semi" className="text-content-primary text-sm">
                            {code}
                        </FontText>
                        {isVirtual && <VirtualBadge />}
                    </View>
                    {CURRENCY_NAMES[code] && (
                        <FontText type="body" weight="regular" className="text-light-gray text-xs">
                            {t(CURRENCY_NAMES[code])}
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
    selectedCurrency: SelectableCurrency | null;
    onSelectCurrency: (currency: SelectableCurrency) => void;
}

/**
 * Grouped currency list: merchant real currencies first ("Main currencies",
 * order preserved from user.currencies), then the five virtual currencies.
 */
const CurrencyList = ({ selectedCurrency, onSelectCurrency }: Props) => {
    const { t } = useTranslation();
    const user = useAuthStore(selectUser);
    const { isLiveMode } = useEnvironment();

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
                    isActive={selectedCurrency === code}
                    onSelect={onSelectCurrency}
                />
            ))}

            <GroupLabel label={t('Virtual currencies')} />
            {VIRTUAL_CURRENCIES.map((id) => {
                const code = VIRTUAL_TO_DISPLAY[id];
                return (
                    <CurrencyItem
                        key={id}
                        code={code}
                        isVirtual
                        isActive={selectedCurrency === code}
                        onSelect={onSelectCurrency}
                    />
                );
            })}
        </ScrollView>
    );
};

export default CurrencyList;
