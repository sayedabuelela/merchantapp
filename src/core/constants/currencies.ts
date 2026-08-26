import { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import {
    AeIcon,
    EgIcon,
    EuIcon,
    GbIcon,
    SaIcon,
    UsIcon,
} from '@/src/shared/assets/svgs';

export const CURRENCY_CONVERSION_FEATURE = 'currency conversion';

export const BASE_CURRENCY = 'EGP';

export const VIRTUAL_CURRENCIES = [
    'USD_VIRTUAL',
    'EUR_VIRTUAL',
    'GBP_VIRTUAL',
    'SAR_VIRTUAL',
    'AED_VIRTUAL',
] as const;

export type VirtualCurrencyId = (typeof VIRTUAL_CURRENCIES)[number];

export type VirtualDisplayCode = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED';

/**
 * What the global switcher stores and what goes on the wire: an API id, not a
 * display code. Either the base currency, a merchant's real currency code
 * ('USD'), or a virtual id ('USD_VIRTUAL') — so main USD and virtual USD stay
 * distinct instead of collapsing onto the same 3-letter code.
 * The `string & {}` arm keeps literal autocomplete while admitting any
 * merchant currency from `user.currencies`.
 */
export type SelectedCurrencyId =
    | typeof BASE_CURRENCY
    | VirtualCurrencyId
    | (string & {});

export const VIRTUAL_TO_DISPLAY: Record<VirtualCurrencyId, VirtualDisplayCode> = {
    USD_VIRTUAL: 'USD',
    EUR_VIRTUAL: 'EUR',
    GBP_VIRTUAL: 'GBP',
    SAR_VIRTUAL: 'SAR',
    AED_VIRTUAL: 'AED',
};

export const DISPLAY_TO_VIRTUAL: Record<VirtualDisplayCode, VirtualCurrencyId> = {
    USD: 'USD_VIRTUAL',
    EUR: 'EUR_VIRTUAL',
    GBP: 'GBP_VIRTUAL',
    SAR: 'SAR_VIRTUAL',
    AED: 'AED_VIRTUAL',
};

export const isVirtualCurrency = (currency?: string | null): currency is VirtualCurrencyId =>
    !!currency && (VIRTUAL_CURRENCIES as readonly string[]).includes(currency);

/**
 * Display-layer only: true for a bare 3-letter code that HAS a virtual variant.
 * Never use this to decide whether a selection is virtual — 'USD' is a valid
 * main currency too. Use `isVirtualCurrency` on the API id instead.
 */
export const isVirtualDisplayCode = (currency?: string | null): currency is VirtualDisplayCode =>
    !!currency && currency in DISPLAY_TO_VIRTUAL;

/** The virtual-currency fields every record type carries, however it nests them. */
export interface VirtualFields {
    /** String is admitted because amount props flow through display components unparsed. */
    virtualAmount?: number | string | null;
    virtualCurrency?: string | null;
}

/**
 * Single answer to "was this record created in a virtual currency?".
 * Shape check only — callers add the feature-flag guard.
 */
export const isVirtualRecord = (record?: VirtualFields | null): boolean =>
    record?.virtualCurrency != null &&
    record?.virtualAmount != null &&
    record.virtualAmount !== '';

/** USD_VIRTUAL -> USD; anything else passes through (EGP -> EGP) */
export const toDisplayCode = (currency?: string | null): string => {
    if (!currency) return '';
    return isVirtualCurrency(currency) ? VIRTUAL_TO_DISPLAY[currency] : currency;
};

/** Just enough of i18next's `t` to look a code up — keeps this file free of i18n types. */
type TranslateFn = (key: string) => string;

/**
 * API id or display code -> the currency label, everywhere it is shown. Strips
 * _VIRTUAL, then translates.
 *
 * The locale files key currency codes to the Arabic name ('USD' ->
 * "الدولار الأمريكي"; 'EGP' -> "ج.م", the one currency whose abbreviation is
 * what merchants read it as). A bare symbol reads as an icon rather than a
 * label, so nothing renders "$". Empty input falls back to the base currency.
 *
 * `formatAmount` has no access to `t`, which is why its callers wrap by hand and
 * a few forgot. Route through here instead of calling `t(code)` inline — an
 * inline `t` skips the _VIRTUAL strip and echoes "USD_VIRTUAL" back.
 */
export const currencyLabel = (t: TranslateFn, currency?: string | null): string =>
    t(toDisplayCode(currency) || BASE_CURRENCY);

export const CURRENCY_FLAGS: Record<string, FC<SvgProps>> = {
    EGP: EgIcon,
    USD: UsIcon,
    EUR: EuIcon,
    GBP: GbIcon,
    SAR: SaIcon,
    AED: AeIcon,
};

/** Full names keyed by display code; values are i18n keys */
export const CURRENCY_NAMES: Record<string, string> = {
    EGP: 'Egyptian Pound',
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    SAR: 'Saudi Riyal',
    AED: 'UAE Dirham',
};
