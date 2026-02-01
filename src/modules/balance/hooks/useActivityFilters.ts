import { useState, useMemo, useCallback } from 'react';
import { ActivityType, FetchActivitiesParams } from '../balance.model';

type FilterableTab = 'payout' | 'upcoming_balance' | 'all';

const INITIAL_FILTERS: FetchActivitiesParams = {
    operation: undefined,
    isReflected: undefined,
    origin: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    creationDateFrom: undefined,
    creationDateTo: undefined,
};

type TabFiltersState = Record<FilterableTab, FetchActivitiesParams>;

const INITIAL_TAB_FILTERS: TabFiltersState = {
    payout: { ...INITIAL_FILTERS },
    upcoming_balance: { ...INITIAL_FILTERS },
    all: { ...INITIAL_FILTERS },
};

/**
 * Returns the tab-specific defaults that are always applied (operation, isReflected).
 */
function getTabDefaults(tab: ActivityType): Partial<FetchActivitiesParams> {
    switch (tab) {
        case 'payout':
            return { operation: 'payout', isReflected: undefined };
        case 'upcoming_balance':
            return { operation: undefined, isReflected: false };
        case 'all':
        case 'overview':
        default:
            return { operation: undefined, isReflected: undefined };
    }
}

/**
 * Custom hook to manage activity filters with separate state per tab.
 * Each tab maintains its own independent filter state.
 */
export const useActivityFilters = (type: ActivityType) => {
    const [tabFilters, setTabFilters] = useState<TabFiltersState>(INITIAL_TAB_FILTERS);

    const currentTab: FilterableTab = type === 'overview' ? 'all' : type;

    // Merge the user's filter state with tab-specific defaults
    const filters = useMemo<FetchActivitiesParams>(() => {
        const userFilters = tabFilters[currentTab];
        const defaults = getTabDefaults(type);
        return {
            ...userFilters,
            // Tab defaults override user values for operation/isReflected on payout & upcoming
            ...defaults,
            // But for 'all' tab, operation comes from user filters (activity type dropdown)
            ...(type === 'all' ? { operation: userFilters.operation } : {}),
        };
    }, [tabFilters, currentTab, type]);

    const setFilters = useCallback(
        (update: FetchActivitiesParams | ((prev: FetchActivitiesParams) => FetchActivitiesParams)) => {
            setTabFilters(prev => {
                const prevTabState = prev[currentTab];
                const newTabState = typeof update === 'function' ? update(prevTabState) : update;
                return { ...prev, [currentTab]: newTabState };
            });
        },
        [currentTab],
    );

    // Check if any user-set filters are active for the current tab
    const hasActiveFilters = useMemo(() => {
        const userFilters = tabFilters[currentTab];
        const keysToIgnore = ['page', 'limit', 'search', 'accountId', 'isReflected', 'operation'];

        // Check date/origin fields
        const hasGeneralFilter = Object.entries(userFilters).some(([key, value]) => {
            if (keysToIgnore.includes(key)) return false;
            return value !== undefined && value !== '';
        });

        // For 'all' tab, also check if operation is set (activity type filter)
        const hasOperationFilter = type === 'all' && userFilters.operation !== undefined && userFilters.operation !== '';

        return hasGeneralFilter || hasOperationFilter;
    }, [tabFilters, currentTab, type]);

    const clearFilters = useCallback(() => {
        setTabFilters(prev => ({
            ...prev,
            [currentTab]: { ...INITIAL_FILTERS },
        }));
    }, [currentTab]);

    return {
        filters,
        setFilters,
        hasActiveFilters,
        clearFilters,
    };
};
