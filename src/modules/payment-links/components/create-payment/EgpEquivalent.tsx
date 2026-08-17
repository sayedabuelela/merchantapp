import { useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import FontText from '@/src/shared/components/FontText';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { isVirtualCurrency, toDisplayCode } from '@/src/core/constants/currencies';
import useExchangeRate from '@/src/shared/hooks/useExchangeRate';
import { useToast } from '@/src/core/providers/ToastProvider';

/**
 * "Equivalent in EGP" strip under the amount input for virtual currencies.
 * Display-only preview from the live exchange rate — the backend recomputes
 * the authoritative EGP amount at creation time.
 * On rate failure: resets the form currency to EGP (EGP-only fallback) + toast.
 */
const EgpEquivalent = () => {
    const { t } = useTranslation();
    const { control, setValue } = useFormContext();
    const { showToast } = useToast?.() ?? { showToast: () => { } };

    const currency = useWatch({ control, name: 'currency' });
    const totalAmount = useWatch({ control, name: 'totalAmount' });

    const isVirtual = isVirtualCurrency(currency);
    const displayCode = toDisplayCode(currency);
    const { rate, isLoading, isError } = useExchangeRate(isVirtual ? displayCode : undefined);

    // Exchange-rate failure => EGP-only fallback (no unknown-rate foreign creation)
    useEffect(() => {
        if (isVirtual && isError) {
            setValue('currency', 'EGP', { shouldValidate: true });
            showToast({
                message: t('Exchange rate unavailable — amount will be created in EGP'),
                type: 'warning',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVirtual, isError]);

    if (!isVirtual) return null;

    const amountNumber = parseFloat(totalAmount);
    const hasAmount = !isNaN(amountNumber) && amountNumber > 0;
    const equivalent = rate != null && hasAmount ? currencyNumber(amountNumber * rate) : '—';

    return (
        <View className="bg-[#F5F6F6] rounded p-2 px-3 mt-2 gap-y-0.5">
            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                {isLoading
                    ? t('Fetching rate…')
                    : `${t('Equivalent in EGP')}: ${equivalent} ${t('EGP')}`}
            </FontText>
            {!isLoading && rate != null && (
                <FontText type="body" weight="regular" className="text-light-gray text-[10px]">
                    {`1 ${displayCode} = ${currencyNumber(rate)} ${t('EGP')}`}
                </FontText>
            )}
        </View>
    );
};

export default EgpEquivalent;
