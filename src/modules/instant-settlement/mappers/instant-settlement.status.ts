/**
 * Status normalization — RAW ENUM EVERYWHERE (§8 / Codex #2).
 *
 * The redesign renders every request-status badge via the shared
 * `StatusBox(rawStatus)` (RequestCard + Payout-details), with NO relabel
 * (`PROCESSING → Processing`, not `Approved`). So the domain stores the raw
 * backend enum, upper-cased for a stable key into `StatusBox.statusStyles`.
 *
 * `StatusBox` handles the unknown case itself (grey fallback) and runs the
 * label through `t(...)`, so no `{ key, label, tone }` bridge is needed.
 *
 * The one exception is the decline enum: the backend sends `DECLINE`/`DECLINED`
 * but the product surfaces it as "Rejected" (mirrors the portal). That relabel
 * lives in `toDisplayStatus` — badge-only; the domain keeps the raw enum.
 */

export const normalizeStatus = (raw: string | null | undefined): string =>
    (raw ?? '').toUpperCase();

/** True for both spellings of the decline enum the backend may return. */
export const isDeclinedStatus = (status: string | null | undefined): boolean => {
    const upper = normalizeStatus(status);
    return upper === 'DECLINE' || upper === 'DECLINED';
};

/** Badge label — DECLINE/DECLINED render as REJECTED; everything else stays raw. */
export const toDisplayStatus = (status: string | null | undefined): string =>
    isDeclinedStatus(status) ? 'REJECTED' : normalizeStatus(status);
