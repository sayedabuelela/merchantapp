import { useApi } from "@/src/core/api/clients.hooks";
import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { groupByDate } from "@/src/core/utils/groupData";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { FetchPaymentLinksParams, PaymentLinkResponse, PaymentLinksInfinityResponse, PaymentLinksResponse } from "../payment-links.model";
import { CreatePaymentLinkTypes } from "../payment-links.scheme";
import { createPaymentLink, getPaymentLinks, updatePaymentLink } from "../payment-links.services";
import { usePaymentLinkStore } from "../paymentLink.store";

const usePaymentLinksVM = (params?: FetchPaymentLinksParams) => {
    const { api } = useApi();
    const queryClient = useQueryClient();

    const paymentLinksQuery = useInfiniteQuery<
        PaymentLinksResponse, // API response type
        Error,                // Error type
        PaymentLinksInfinityResponse, // Data returned by useInfiniteQuery
        (string | FetchPaymentLinksParams | undefined)[], // queryKey type
        number                // pageParam type
    >({
        queryKey: ["payment-links", params],
        queryFn: ({ pageParam = 1 }) =>
            getPaymentLinks(api, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const allItems = paymentLinksQuery.data?.pages.flatMap((p) => p.data) ?? [];
    const grouped = groupByDate(allItems);
    const { listData, stickyHeaderIndices } = useGroupedData(allItems.length ? grouped : []);

    const {
        mutateAsync: submitPaymentLink,
        isPending: isCreatingPaymentLink,
        error: createPaymentLinkError,
    } = useMutation<PaymentLinkResponse, Error, CreatePaymentLinkTypes>({
        mutationFn: (data: CreatePaymentLinkTypes) => createPaymentLink(api, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["payment-links"] });
            usePaymentLinkStore.getState().clearFormData();
            router.replace("/payment-links");
        },
        onError: (error) => {
            console.log("error", error);
            usePaymentLinkStore.getState().clearFormData();
        }
    });

    // const {
    //     mutateAsync: editPaymentLink,
    //     isPending: isUpdatingPaymentLink,
    //     error: editPaymentLinkError,
    // } = useMutation<PaymentLink, Error, CreatePaymentLinkTypes>({
    //     mutationFn: (paymentId: string, data: CreatePaymentLinkTypes) => updatePaymentLink(api, paymentId, data),
    //     onSuccess: async () => {
    //         // Invalidate list to refetch updated data
    //         await queryClient.invalidateQueries({ queryKey: ["payment-links"] });
    //         // Clear form persisted store
    //         usePaymentLinkStore.getState().clearFormData();
    //         // Navigate to the list screen
    //         router.replace(`/payment-links/${paymentId}`);

    //     },
    //     onError: (error) => {
    //         console.log("error", error);
    //         usePaymentLinkStore.getState().clearFormData();
    //     }
    // });

    return {
        ...paymentLinksQuery,
        listData,
        stickyHeaderIndices,
        submitPaymentLink,
        isCreatingPaymentLink,
        createPaymentLinkError,
        // editPaymentLink,
        // isUpdatingPaymentLink,
        // editPaymentLinkError
    };

}

export default usePaymentLinksVM;