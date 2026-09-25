import { useApi } from '@/src/core/api/clients.hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { EligibleQueryParams } from '../dto/instant-settlement.dto';
import { fetchEligibleTransactions } from '../instant-settlement.services';
import { mapEligibleTransaction } from '../mappers/instant-settlement.mappers';
import type { EligibleTransaction } from '../domain/instant-settlement.models';

/** Hard cap on pages to avoid runaway loops on huge datasets. */
const MAX_PAGES = 50;
const PAGE_LIMIT = 100;

interface FetchAllState {
    isFetchingAll: boolean;
    error: boolean;
}
export const useFetchAllEligible = () => {
    const { api } = useApi();
    const [state, setState] = useState<FetchAllState>({ isFetchingAll: false, error: false });

    const runningRef = useRef(false);
    const mountedRef = useRef(true);
    const runTokenRef = useRef(0);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            // invalidate any in-flight run
            runTokenRef.current += 1;
        };
    }, []);

    /**
     * Returns every eligible transaction, or null if it failed / was capped /
     * was superseded by a newer call.
     */
    const fetchAll = useCallback(
        async (params?: EligibleQueryParams): Promise<EligibleTransaction[] | null> => {
            // duplicate-call guard
            if (runningRef.current) return null;
            runningRef.current = true;
            const token = ++runTokenRef.current;
            if (mountedRef.current) setState({ isFetchingAll: true, error: false });

            const all: EligibleTransaction[] = [];
            try {
                let page = 1;
                let totalPages = 1;
                let incomplete = false;
                do {
                    const res = await fetchEligibleTransactions(api, {
                        ...params,
                        page,
                        limit: PAGE_LIMIT,
                    });
                    // stale-result discard: a newer call started or we unmounted
                    if (token !== runTokenRef.current) return null;

                    all.push(...res.data.map(mapEligibleTransaction));
                    totalPages = res.pagination.pages || 1;
                    page += 1;

                    // max-page guard: stop, and flag as incomplete if pages remain
                    if (page > MAX_PAGES) {
                        incomplete = page <= totalPages;
                        break;
                    }
                } while (page <= totalPages);

                if (token !== runTokenRef.current) return null;
                // capped before fetching every page → treat as failure, NOT a
                // partial "select all" (plan §5: stop + inform, selection unchanged)
                if (incomplete) {
                    if (mountedRef.current) setState({ isFetchingAll: false, error: true });
                    return null;
                }
                if (mountedRef.current) setState({ isFetchingAll: false, error: false });
                return all;
            } catch {
                if (token === runTokenRef.current && mountedRef.current) {
                    setState({ isFetchingAll: false, error: true });
                }
                return null;
            } finally {
                if (token === runTokenRef.current) runningRef.current = false;
            }
        },
        [api],
    );

    return { fetchAll, ...state };
};
