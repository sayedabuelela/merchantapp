import { useEnvironment } from "@/src/core/environment/useEnvironment.hook";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import DropDownUI from "./DropDownUI";

interface Props {
    name: string; // react-hook-form field name
}

export default function CurrencyDropDown({ name }: Props) {
    const { control } = useFormContext();
    const user = useAuthStore(selectUser);
    const { isLiveMode } = useEnvironment();

    const currencyList = isLiveMode
        ? user?.currencies ?? []
        : user?.currenciesTest ?? [];

    const defaultCurrency = user?.settings?.defaultCurrency?.[isLiveMode ? 'live' : 'test'];
    // console.log("defaultCurrency", defaultCurrency);

    const currencyOptions = useMemo(
        () => currencyList.map((c) => ({ label: c, value: c })),
        [currencyList]
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
                />
            )}
        />
    );
}
