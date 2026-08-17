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

export type SelectableCurrency = typeof BASE_CURRENCY | VirtualDisplayCode | string;

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

export const isVirtualDisplayCode = (currency?: string | null): currency is VirtualDisplayCode =>
    !!currency && currency in DISPLAY_TO_VIRTUAL;

/** USD_VIRTUAL -> USD; anything else passes through (EGP -> EGP) */
export const toDisplayCode = (currency?: string | null): string => {
    if (!currency) return '';
    return isVirtualCurrency(currency) ? VIRTUAL_TO_DISPLAY[currency] : currency;
};

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
