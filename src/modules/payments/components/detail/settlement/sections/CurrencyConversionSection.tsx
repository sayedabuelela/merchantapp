import { useTranslation } from 'react-i18next';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import NoteBox from '@/src/shared/components/details-screens/NoteBox';
import useCurrencyConversionEnabled from '@/src/shared/hooks/useCurrencyConversionEnabled';
import { BASE_CURRENCY, isVirtualRecord, toDisplayCode } from '@/src/core/constants/currencies';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { formatRelativeDate, formatTime } from '@/src/core/utils/dateUtils';
import { VirtualTransaction } from '../../../../payments.model';

interface Props {
    /** Equivalent amount in the settlement currency — backend-provided, never recomputed here.
     *  Null on records that never captured, e.g. an expired session. */
    amount?: number | null;
    virtual?: VirtualTransaction;
}

/**
 * The FX breakdown for a virtual-currency record: what was charged, at what rate,
 * and what it settles to. Renders nothing for EGP or real foreign-currency records —
 * those settle in the currency they were charged in, so there is nothing to convert.
 */
const CurrencyConversionSection = ({ amount, virtual }: Props) => {
    const { t } = useTranslation();
    const isEnabled = useCurrencyConversionEnabled();

    // `!virtual` is what narrows the type below; isVirtualRecord carries the rule.
    if (!isEnabled || !virtual || !isVirtualRecord(virtual)) return null;

    const code = toDisplayCode(virtual.virtualCurrency);
    // Rate fields only land once the payment is captured; their absence means unsettled
    const hasRate = virtual.virtualExchangeRate != null;
    // An expired or uncaptured record has no settled EGP figure to show
    const hasEquivalent = amount != null;

    return (
        <DetailsSection title={t('Currency conversion')} className="mt-4">
            <SectionRowItem title={t('Virtual currency')} value={t(code)} />
            <SectionRowItem
                title={t('Amount charged')}
                value={`${currencyNumber(Number(virtual.virtualAmount))} ${t(code)}`}
            />
            {hasRate && (
                <SectionRowItem
                    title={t('Exchange rate')}
                    value={`1 ${t(code)} = ${currencyNumber(virtual.virtualExchangeRate!)} ${t(BASE_CURRENCY)}`}
                />
            )}
            {hasRate && virtual.virtualRateRecordedAt && (
                <SectionRowItem
                    title={t('Rate captured')}
                    value={`${formatRelativeDate(virtual.virtualRateRecordedAt)} ${formatTime(virtual.virtualRateRecordedAt)}`}
                />
            )}
            {hasEquivalent && (
                <SectionRowItem
                    total
                    title={`${t('Equivalent')} ${t(BASE_CURRENCY)}`}
                    value={`${currencyNumber(Number(amount))} ${t(BASE_CURRENCY)}`}
                />
            )}
            {!hasRate && (
                <NoteBox className="mt-0.5">
                    {t('This order has not settled yet. The EGP amount is indicative — the final rate is set at settlement, so it may change.')}
                </NoteBox>
            )}
        </DetailsSection>
    );
};

export default CurrencyConversionSection;
