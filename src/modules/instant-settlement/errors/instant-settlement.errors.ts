/**
 * Typed error normalizer for the Instant Settlement flow.
 *
 * Replaces the unsafe `error.messages[isRTL ? 'ar' : 'en']` direct indexing.
 *
 * The axios error interceptor (`src/core/api/clients.interceptors.ts`) rejects with:
 *  - the RAW backend body `{ error, messages, status, data? }` when `response.data` exists
 *  - `{ code: 'NETWORK_ERROR', message }` on ERR_NETWORK (no `.messages`)
 *  - `{ code: 'TIMEOUT', message }` on timeout (no `.messages`)
 *  - the full AxiosError on 401/403
 *
 * This normalizer handles all of those shapes safely.
 */

import type { ApiErrorDTO, LimitErrorData } from '../dto/instant-settlement.dto';

export type NormalizedErrorKind = 'network' | 'validation' | 'unknown';

export interface NormalizedInstantError {
    kind: NormalizedErrorKind;
    messageEn: string;
    messageAr: string;
    /** backend cause / error code, if any (e.g. limit error code) */
    cause?: string;
    /** structured limit data when present (422) */
    limit?: LimitErrorData;
    raw: unknown;
}

const DEFAULT_EN = 'Something went wrong. Please try again.';
const DEFAULT_AR = 'حدث خطأ ما. برجاء المحاولة مرة أخرى.';
const NETWORK_EN = 'Network error. Check your connection and try again.';
const NETWORK_AR = 'خطأ في الشبكة. تأكد من اتصالك وحاول مرة أخرى.';

const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

export const normalizeInstantError = (err: unknown): NormalizedInstantError => {
    // network / timeout — interceptor rejects with { code, message }, no messages
    if (isObject(err)) {
        const code = err.code;
        if (code === 'NETWORK_ERROR' || code === 'TIMEOUT' || code === 'ERR_NETWORK') {
            return {
                kind: 'network',
                messageEn: NETWORK_EN,
                messageAr: NETWORK_AR,
                cause: typeof code === 'string' ? code : undefined,
                raw: err,
            };
        }
    }

    // backend validation body { error, messages, status, data? }
    if (isObject(err) && isObject((err as ApiErrorDTO).messages)) {
        const dto = err as ApiErrorDTO;
        return {
            kind: 'validation',
            messageEn: dto.messages?.en || DEFAULT_EN,
            messageAr: dto.messages?.ar || DEFAULT_AR,
            cause: dto.error?.cause ?? dto.data?.code,
            limit: dto.data,
            raw: err,
        };
    }

    // unknown / AxiosError (401, 403) / anything else
    return {
        kind: 'unknown',
        messageEn: DEFAULT_EN,
        messageAr: DEFAULT_AR,
        raw: err,
    };
};

/** Picks the locale-appropriate message off a normalized error. */
export const pickErrorMessage = (
    e: NormalizedInstantError,
    isRTL: boolean,
): string => (isRTL ? e.messageAr : e.messageEn);
