import { useApi } from "@/src/core/api/clients.hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { selectUser, useAuthStore } from "../../auth/auth.store";
import { NotificationData, NotificationsResponse, NotificationsInfinityResponse } from "../notification.model";
import { getNotificationsList } from "../notification.service";

interface UseNotificationsVMProps {
    pageSize?: number;
}

export const useNotificationsVM = (props?: UseNotificationsVMProps) => {
    const { api } = useApi();
    const user = useAuthStore(selectUser);
    const pageSize = props?.pageSize || 10;

    const notificationsQuery = useInfiniteQuery<
        NotificationsResponse,
        Error,
        NotificationsInfinityResponse,
        (string | number | undefined)[],
        number
    >({
        queryKey: ["notifications", user?._id, pageSize],
        queryFn: async ({ pageParam = 1 }) => {
            if (!user?._id) {
                throw new Error("User merchantId not found");
            }
            return await getNotificationsList(api, user._id, pageSize, pageParam);
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            // Use API pagination metadata instead of array length
            const { hasNextPage, nextPage, page } = lastPage.pagination;
            if (!hasNextPage || !nextPage) return undefined;
            // Refuse a cursor that hasn't moved. If the server ignored our page
            // param and replayed a page we didn't ask for, stop here — otherwise
            // hasNextPage stays true forever and onEndReached loops the API.
            if (page != null && page !== lastPageParam) return undefined;
            if (nextPage <= lastPageParam) return undefined;
            return nextPage;
        },
        initialPageParam: 1,
        enabled: !!user?._id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Flatten all pages into single array and deduplicate by _id.
    // Memoized so FlatList doesn't get a brand-new array on every render.
    const allNotifications = useMemo(() => {
        const seen = new Set<string>();
        return notificationsQuery.data?.pages
            .flatMap((page) => page.data)
            .reduce((acc, notification) => {
                // Only add if not already in the accumulator (deduplicate by _id)
                if (!seen.has(notification._id)) {
                    seen.add(notification._id);
                    acc.push(notification);
                }
                return acc;
            }, [] as NotificationData[]) ?? [];
    }, [notificationsQuery.data?.pages]);

    // Get unSeenCount from latest page
    const unSeenCount = notificationsQuery.data?.pages[0]?.unSeenCount ?? 0;

    return {
        ...notificationsQuery,
        notifications: allNotifications,
        unSeenCount,
    };
};
