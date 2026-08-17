import { useEnvironment } from "@/src/core/environment/useEnvironment.hook";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DropDownUI from "./DropDownUI";
import useCurrencyConversionEnabled from "@/src/shared/hooks/useCurrencyConversionEnabled";
import { toDisplayCode, VIRTUAL_CURRENCIES } from "@/src/core/constants/currencies";

interface Props {
    name: string; // react-hook-form field name
}

export default function CurrencyDropDown({ name }: Props) {
    const { control } = useFormContext();
    const { t } = useTranslation();
    const user = useAuthStore(selectUser);
    const { isLiveMode } = useEnvironment();
    const isCurrencyConversionEnabled = useCurrencyConversionEnabled();

    const defaultCurrency = user?.settings?.defaultCurrency?.[isLiveMode ? 'live' : 'test'];
    // console.log("defaultCurrency", defaultCurrency);

    const currencyOptions = useMemo(
        () => {
            const currencyList = isLiveMode
                ? user?.currencies ?? []
                : user?.currenciesTest ?? [];
            const realOptions = currencyList.map((c) => ({ label: c, value: c }));
            if (!isCurrencyConversionEnabled) return realOptions;
            // Virtual currencies (currency conversion feature): value is the API id (USD_VIRTUAL),
            // label carries the "(Virtual)" marker as text — zeego menu items are string-only
            const virtualOptions = VIRTUAL_CURRENCIES.map((id) => ({
                label: `${toDisplayCode(id)} (${t('Virtual')})`,
                value: id as string,
            }));
            return [...realOptions, ...virtualOptions];
        },
        [isLiveMode, user?.currencies, user?.currenciesTest, isCurrencyConversionEnabled, t]
    );

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultCurrency}
            render={({ field: { value, onChange } }) => (
                <DropDownUI
                    options={currencyOptions}
                    selected={value}
                    onChange={onChange}
                    dropdownKey="currency"
                    // Trigger stays compact: "USD", not "USD (Virtual)"
                    triggerLabel={value ? toDisplayCode(value) : undefined}
                />
            )}
        />
    );
}
