import { useApi } from "@/src/core/api/clients.hooks";
import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { groupByDate } from "@/src/core/utils/groupData";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { selectUser, useAuthStore, selectIsAuthenticated } from "../../auth/auth.store";
import useHasFeature from "../../auth/hooks/useHasFeature";
import usePermissions from "../../auth/hooks/usePermissions";
import { Activity, ActivitiesInfinityResponse, ActivitiesResponse, FetchActivitiesParams } from "../balance.model";
import { getActivities } from "../balance.services";
import { useBalanceStore, selectActiveAccountId } from "../balance.store";
import { useEnvironmentStore, selectMode } from "@/src/core/environment/environments.store";
import { Mode } from "@/src/core/environment/environments";

export const useActivitiesVM = (params?: FetchActivitiesParams) => {
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const { canViewBalance } = usePermissions(user?.actions!);
    const hasBalanceFeature = useHasFeature("multi accounts");
    const activeAccountId = useBalanceStore(selectActiveAccountId);
    const mode = useEnvironmentStore(selectMode);
    console.log('mode : ', mode);
    const activitiesQuery = useInfiniteQuery<
        ActivitiesResponse,
        Error,
        ActivitiesInfinityResponse,
        (string | FetchActivitiesParams | undefined)[],
        number
    >({
        queryKey: ["balance-activities", activeAccountId, params],
        queryFn: ({ pageParam = 1 }) =>
            getActivities(api, { ...params, page: pageParam, accountId: activeAccountId }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!(canViewBalance && hasBalanceFeature && isAuthenticated && mode === Mode.LIVE),
        // keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    // console.log('activitiesQuery : ', activitiesQuery.data?.pages);
    console.log('mode === Mode.LIVE : ', !!(mode === Mode.LIVE));
    const allItems = activitiesQuery.data?.pages.flatMap((p) => p.data) ?? [];

    // Determine grouping based on filter params
    let shouldGroup = true;
    let groupByField: keyof Activity = 'createdAt';

    if (params?.operation === 'payout') {
        // Payouts: No date grouping
        shouldGroup = false;
    } else if (params?.isReflected === false) {
        // Upcoming balance: Group by value date (when it will be reflected)
        groupByField = 'valueDate';
    } else {
        // All activities: Group by creation date
        groupByField = 'createdAt';
    }

    const grouped = shouldGroup ? groupByDate(allItems, groupByField) : [];
    const { listData, stickyHeaderIndices } = useGroupedData(allItems.length ? grouped : []);

    // For payouts (ungrouped), return items directly without headers
    // For all other cases (upcoming balance, all activities), return grouped data
    const finalListData = shouldGroup ? listData : allItems.map(item => ({ type: 'item' as const, ...item }));
    const finalStickyIndices = shouldGroup ? stickyHeaderIndices : [];

    return {
        ...activitiesQuery,
        listData: finalListData,
        stickyHeaderIndices: finalStickyIndices,
    };
};

export const useRecentBalanceActivities = () => {
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const { canViewBalance } = usePermissions(user?.actions!);
    const hasBalanceFeature = useHasFeature("multi accounts");
    const activeAccountId = useBalanceStore(selectActiveAccountId);
    const mode = useEnvironmentStore(selectMode);
    console.log('useRecentBalanceActivities', {
        activeAccountId: activeAccountId,
        canViewBalance: canViewBalance,
        hasBalanceFeature: hasBalanceFeature,
        isAuthenticated: isAuthenticated,
    });
    return useQuery<ActivitiesResponse, Error, ActivitiesResponse>({
        queryKey: ["balanceActivities", activeAccountId, { limit: 3, page: 1 }],
        queryFn: () => getActivities(api, { limit: 3, page: 1, accountId: activeAccountId }),
        enabled: !!(canViewBalance && hasBalanceFeature && isAuthenticated && mode === Mode.LIVE),
        staleTime: 5 * 60 * 1000,
    });
};
