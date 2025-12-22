import { useEffect, useState, useMemo } from 'react';
import { ActivityType, FetchActivitiesParams } from '../balance.model';

const INITIAL_FILTERS: FetchActivitiesParams = {
    operation: undefined,
    isReflected: undefined,
    origin: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    creationDateFrom: undefined,
    creationDateTo: undefined,
};

/**
 * Custom hook to manage activity filters based on the active tab
 * Automatically syncs filters when tab changes
 */
export const useActivityFilters = (type: ActivityType) => {
    const [filters, setFilters] = useState<FetchActivitiesParams>(INITIAL_FILTERS);

    // Update filters based on active tab
    useEffect(() => {
        setFilters(prev => {
            const newFilters = { ...prev };

            switch (type) {
                case 'payout':
                    newFilters.operation = 'payout';
                    newFilters.isReflected = undefined;
                    break;

                case 'upcoming_balance':
                    newFilters.operation = undefined;
                    newFilters.isReflected = false;
                    break;

                case 'all':
                    newFilters.operation = undefined;
                    newFilters.isReflected = undefined;
                    break;

                case 'overview':
                    // Overview doesn't use filters
                    newFilters.operation = undefined;
                    newFilters.isReflected = undefined;
                    break;
            }

            return newFilters;
        });
    }, [type]);

    // Check if any filters are active (excluding default filter keys)
    const hasActiveFilters = useMemo(() => {
        // const filterKeysToIgnore = ['page', 'limit', 'search', 'operation', 'accountId', 'isReflected'];
        const filterKeysToIgnore = ['page', 'limit', 'search', 'accountId','isReflected'];
        return Object.entries(filters).some(([key, value]) => {
            if (filterKeysToIgnore.includes(key)) return false;
            return value !== undefined && value !== '';
        });
    }, [filters]);
    console.log('hasActiveFilters : ', hasActiveFilters);
    console.log('filters : ', filters);
    const clearFilters = () => {
        setFilters(INITIAL_FILTERS);
    };

    return {
        filters,
        setFilters,
        hasActiveFilters,
        clearFilters,
    };
};
