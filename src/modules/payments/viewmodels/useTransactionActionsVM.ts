/**
 * Transaction Actions ViewModel
 *
 * Handles void and refund operations for transactions using React Query mutations.
 * Provides loading states, error handling, and cache invalidation.
 */

import { useApi } from '@/src/core/api/clients.hooks';
import { useToast } from '@/src/core/providers/ToastProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import type { CaptureOrderRequest, ContactOtpRefundRequest, ContactRefundWithOtpRequest, RefundOrderRequest, VoidOrderRequest } from '../payments.model';
import { captureOrder, refundContactWithOtp, refundOrder, requestContactRefundOtp, voidOrder } from '../payments.services';

export const useTransactionActionsVM = (transactionId: string) => {
    const { paymentApi } = useApi();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { t, i18n } = useTranslation();

    /**
     * Void mutation
     * Invalidates transaction detail and transaction list queries on success
     */
    const voidMutation = useMutation({
        mutationFn: (request: VoidOrderRequest) => voidOrder(paymentApi, request),
        onSuccess: (data) => {
            // Invalidate transaction detail query to refresh the screen
            queryClient.invalidateQueries({ queryKey: ['payment-transaction-detail', transactionId] });

            // Invalidate transaction list queries to update the list screen
            queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
            queryClient.invalidateQueries({ queryKey: ['payment-orders'] });
            // Invalidate all order detail queries since transaction actions affect related orders
            queryClient.invalidateQueries({ queryKey: ['payment-order-detail'] });
            // Show success toast
            const title = t('Successful Void');
            const message = (i18n.language === 'ar' ? data.messages.ar : data.messages.en) || t('Transaction voided successfully');

            toast.success(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: message,
            });
        },
        onError: (error: any) => {
            // Show error toast with special mapping for void eligibility
            let errorMessage = (i18n.language === 'ar' ? error.response?.data?.messages?.ar : error.response?.data?.messages?.en) || t('Failed to void transaction');

            // Map specific backend error to user-friendly message
            if (errorMessage.toLowerCase().includes('void request can not be processed')) {
                errorMessage = t('This transaction is not eligible for void. Please use the refund option instead.');
            }
            const title = t('Failed Void');
            toast.error(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#FFEAED',
                    borderWidth: 0
                },
                description: errorMessage,
            });
        },
    });

    /**
     * Refund mutation
     * Invalidates transaction detail and transaction list queries on success
     */
    const refundMutation = useMutation({
        mutationFn: (request: RefundOrderRequest) => refundOrder(paymentApi, request),
        onSuccess: (data) => {
            // Invalidate transaction detail query to refresh the screen
            queryClient.invalidateQueries({ queryKey: ['payment-transaction-detail', transactionId] });

            // Invalidate transaction list queries to update the list screen
            queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
            queryClient.invalidateQueries({ queryKey: ['payment-orders'] });
            // Invalidate all order detail queries since transaction actions affect related orders
            queryClient.invalidateQueries({ queryKey: ['payment-order-detail'] });

            // Show success toast
            const message = (i18n.language === 'ar' ? data.messages.ar : data.messages.en) || t('Refund processed successfully');
            const title = t('Successful Refund');
            toast.success(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: message,
            });
        },
        onError: (error: any) => {
            const errorMessage = (i18n.language === 'ar' ? error.response?.data?.messages?.ar : error.response?.data?.messages?.en) || t('Failed to process refund');
            const title = t('Failed Refund');
            toast.error(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#FFEAED',
                    borderWidth: 0
                },
                description: errorMessage,
            });
        },
    });

    /**
     * Capture mutation
     * Invalidates transaction detail and transaction list queries on success
     */
    const captureMutation = useMutation({
        mutationFn: (request: CaptureOrderRequest) => captureOrder(paymentApi, request),
        onSuccess: (data) => {
            // Invalidate transaction detail query to refresh the screen
            // Add delay to ensure backend has processed the status change
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['payment-transaction-detail', transactionId] });

                // Invalidate transaction list queries to update the list screen
                queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
                queryClient.invalidateQueries({ queryKey: ['payment-orders'] });
                // Invalidate all order detail queries since transaction actions affect related orders
                queryClient.invalidateQueries({ queryKey: ['payment-order-detail'] });
            }, 1000);

            // Show success toast
            if (data.status === 'FAILURE') {
                const title = t('Failed Capture');
                const errorMessage = (i18n.language === 'ar' ? data.messages.ar : data.messages.en) || t('Failed to capture transaction');
                toast.error(title, {
                    style: { backgroundColor: '#FFEAED' },
                    description: errorMessage,
                });
                return;
            }
            const message = (i18n.language === 'ar' ? data.messages.ar : data.messages.en) || t('Transaction captured successfully');
            const title = t('Successful Capture');
            toast.success(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: message,
            });
        },
        onError: (error: any) => {
            // Show error toast
            const errorMessage = (i18n.language === 'ar' ? error.response?.data?.messages?.ar : error.response?.data?.messages?.en) || t('Failed to capture transaction');
            const title = t('Failed Capture');
            toast.error(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#FFEAED',
                    borderWidth: 0
                },
                description: errorMessage,
            });
        },
    });

    /**
     * Request Contact OTP mutation
     * Step 1 of Contact BNPL refund - requests OTP to be sent to customer
     */
    const requestContactOtpMutation = useMutation({
        mutationFn: (request: ContactOtpRefundRequest) =>
            requestContactRefundOtp(paymentApi, request),
        onSuccess: () => {
            const message = t('OTP sent successfully');
            const title = t('Successful OTP Send');
            toast.success(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: message,
            });
        },
        onError: (error: any) => {
            const errorMessage = (i18n.language === 'ar' ? error.response?.data?.messages?.ar : error.response?.data?.messages?.en) || t('Failed to send OTP');
            const title = t('Failed OTP Send');
            toast.error(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#FFEAED',
                    borderWidth: 0
                },
                description: errorMessage,
            });
        },
    });

    /**
     * Contact refund with OTP mutation
     * Step 2 of Contact BNPL refund - submits refund with OTP
     */
    const refundContactWithOtpMutation = useMutation({
        mutationFn: (request: ContactRefundWithOtpRequest) =>
            refundContactWithOtp(paymentApi, request),
        onSuccess: (data) => {
            // Invalidate transaction detail query to refresh the screen
            queryClient.invalidateQueries({ queryKey: ['payment-transaction-detail', transactionId] });
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
            queryClient.invalidateQueries({ queryKey: ['payment-orders'] });
            // Invalidate all order detail queries since transaction actions affect related orders
            queryClient.invalidateQueries({ queryKey: ['payment-order-detail'] });

            const message = (i18n.language === 'ar' ? data.messages?.ar : data.messages?.en) || t('Refund processed successfully');
            const title = t('Successful Refund');
            toast.success(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#F3FFF4',
                    borderWidth: 0
                },
                description: message,
            });
        },
        onError: (error: any) => {
            let errorMessage = (i18n.language === 'ar' ? error.response?.data?.messages?.ar : error.response?.data?.messages?.en) || t('Failed to process refund');

            if (error.response?.data?.statusCode === 400) {
                errorMessage = t('Invalid or expired OTP');
            }
            const title = t('Failed Refund');
            toast.error(title, {
                richColors: true,
                style: {
                    // backgroundColor: '#FFEAED',
                    borderWidth: 0
                },
                description: errorMessage,
            });
        },
    });

    return {
        // Void operation
        voidTransaction: voidMutation.mutate,
        isVoidingTransaction: voidMutation.isPending,
        voidError: voidMutation.error,
        voidData: voidMutation.data,

        // Refund operation
        refundTransaction: refundMutation.mutate,
        isRefundingTransaction: refundMutation.isPending,
        refundError: refundMutation.error,
        refundData: refundMutation.data,

        // Capture operation
        captureTransaction: captureMutation.mutate,
        isCapturingTransaction: captureMutation.isPending,
        captureError: captureMutation.error,
        captureData: captureMutation.data,

        // Contact BNPL OTP operations
        requestContactOtp: requestContactOtpMutation.mutate,
        requestContactOtpAsync: requestContactOtpMutation.mutateAsync,
        isRequestingContactOtp: requestContactOtpMutation.isPending,

        refundContactWithOtp: refundContactWithOtpMutation.mutate,
        refundContactWithOtpAsync: refundContactWithOtpMutation.mutateAsync,
        isRefundingContactWithOtp: refundContactWithOtpMutation.isPending,
    };
};
