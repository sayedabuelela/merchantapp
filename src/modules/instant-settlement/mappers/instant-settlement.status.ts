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
 */

export const normalizeStatus = (raw: string | null | undefined): string =>
    (raw ?? '').toUpperCase();
