import { useApi } from "@/src/core/api/clients.hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
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
        getNextPageParam: (lastPage) => {
            // Use API pagination metadata instead of array length
            const { hasNextPage, nextPage } = lastPage.pagination;
            return hasNextPage && nextPage ? nextPage : undefined;
        },
        initialPageParam: 1,
        enabled: !!user?._id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Flatten all pages into single array and deduplicate by _id
    const allNotifications = notificationsQuery.data?.pages
        .flatMap((page) => page.data)
        .reduce((acc, notification) => {
            // Only add if not already in the accumulator (deduplicate by _id)
            if (!acc.some(n => n._id === notification._id)) {
                acc.push(notification);
            }
            return acc;
        }, [] as NotificationData[]) ?? [];

    // Get unSeenCount from latest page
    const unSeenCount = notificationsQuery.data?.pages[0]?.unSeenCount ?? 0;

    return {
        ...notificationsQuery,
        notifications: allNotifications,
        unSeenCount,
    };
};
