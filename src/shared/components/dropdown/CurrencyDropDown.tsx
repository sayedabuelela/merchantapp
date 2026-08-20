import { useEnvironment } from "@/src/core/environment/useEnvironment.hook";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CurrencyModal from "@/src/shared/components/currency/CurrencyModal";
import CurrencyTrigger from "@/src/shared/components/currency/CurrencyTrigger";

interface Props {
    name: string; // react-hook-form field name
}

/**
 * Currency picker for form inputs. Same trigger and same grouped sheet as the
 * dashboard switcher — flags, full names and a Virtual marker — so the merchant
 * can see what they picked instead of reading "USD (Virtual)" as plain text.
 */
export default function CurrencyDropDown({ name }: Props) {
    const { control } = useFormContext();
    const user = useAuthStore(selectUser);
    const { isLiveMode } = useEnvironment();
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const defaultCurrency = user?.settings?.defaultCurrency?.[isLiveMode ? 'live' : 'test'];

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultCurrency}
            render={({ field: { value, onChange } }) => (
                <>
                    <CurrencyTrigger
                        currency={value}
                        onPress={() => setIsPickerVisible(true)}
                    />
                    <CurrencyModal
                        isVisible={isPickerVisible}
                        onClose={() => setIsPickerVisible(false)}
                        value={value}
                        onSelect={onChange}
                    />
                </>
            )}
        />
    );
}
