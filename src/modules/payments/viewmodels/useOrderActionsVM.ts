/**
 * Order Actions ViewModel
 *
 * Handles void and refund operations for orders using React Query mutations.
 * Provides loading states, error handling, and cache invalidation.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/src/core/api/clients.hooks';
import { useToast } from '@/src/core/providers/ToastProvider';
import { useTranslation } from 'react-i18next';
import { voidOrder, refundOrder } from '../payments.services';
import type { VoidOrderRequest, RefundOrderRequest } from '../payments.model';

export const useOrderActionsVM = (sessionId: string) => {
    const { paymentApi } = useApi();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { t, i18n } = useTranslation();

    /**
     * Void mutation
     * Invalidates order detail and order list queries on success
     */
    const voidMutation = useMutation({
        mutationFn: (request: VoidOrderRequest) => voidOrder(paymentApi, request),
        onSuccess: (data) => {
            // Invalidate order detail query to refresh the screen
            queryClient.invalidateQueries({ queryKey: ['payment-order-detail', sessionId] });

            // Invalidate order list queries to update the list screen
            queryClient.invalidateQueries({ queryKey: ['payment-orders'] });

            // Show success toast
            const message = i18n.language === 'ar'
                ? data.messages.ar || 'تم إلغاء المعاملة بنجاح'
                : data.messages.en || 'Transaction voided successfully';

            showToast({
                message,
                type: 'success',
                duration: 3000,
            });
        },
        onError: (error: any) => {
            // Show error toast with special mapping for void eligibility
            let errorMessage = i18n.language === 'ar'
                ? error.response?.data?.messages?.ar || 'فشل إلغاء المعاملة'
                : error.response?.data?.messages?.en || 'Failed to void transaction';

            // Map specific backend error to user-friendly message
            if (errorMessage.toLowerCase().includes('void request can not be processed')) {
                errorMessage = i18n.language === 'ar'
                    ? 'هذه المعاملة غير مؤهلة للإلغاء. يرجى استخدام خيار الاسترداد بدلاً من ذلك.'
                    : 'This transaction is not eligible for void. Please use the refund option instead.';
            }

            showToast({
                message: errorMessage,
                type: 'danger',
                duration: 4000,
            });
        },
    });

    /**
     * Refund mutation
     * Invalidates order detail and order list queries on success
     */
    const refundMutation = useMutation({
        mutationFn: (request: RefundOrderRequest) => refundOrder(paymentApi, request),
        onSuccess: (data) => {
            // Invalidate order detail query to refresh the screen
            queryClient.invalidateQueries({ queryKey: ['payment-order-detail', sessionId] });

            // Invalidate order list queries to update the list screen
            queryClient.invalidateQueries({ queryKey: ['payment-orders'] });

            // Show success toast
            const message = i18n.language === 'ar'
                ? data.messages.ar || 'تم استرداد المبلغ بنجاح'
                : data.messages.en || 'Refund processed successfully';

            showToast({
                message,
                type: 'success',
                duration: 3000,
            });
        },
        onError: (error: any) => {
            // Show error toast
            const errorMessage = i18n.language === 'ar'
                ? error.response?.data?.messages?.ar || 'فشل استرداد المبلغ'
                : error.response?.data?.messages?.en || 'Failed to process refund';

            showToast({
                message: errorMessage,
                type: 'danger',
                duration: 4000,
            });
        },
    });

    return {
        // Void operation
        voidOrder: voidMutation.mutate,
        isVoidingOrder: voidMutation.isPending,
        voidError: voidMutation.error,
        voidData: voidMutation.data,

        // Refund operation
        refundOrder: refundMutation.mutate,
        isRefundingOrder: refundMutation.isPending,
        refundError: refundMutation.error,
        refundData: refundMutation.data,
    };
};
