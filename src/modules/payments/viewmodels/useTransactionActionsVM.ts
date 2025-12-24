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
            // Show success toast
            const title = i18n.language === 'ar'
                ? 'نجاح الإلغاء'
                : 'Successful Void';
            const message = i18n.language === 'ar'
                ? data.messages.ar || 'تم إلغاء المعاملة بنجاح'
                : data.messages.en || 'Transaction voided successfully';

            toast.success(title, {
                style: { backgroundColor: '#F3FFF4' },
                description: message,
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
            const title = i18n.language === 'ar'
                ? 'فشل الإلغاء'
                : 'Failed Void';
            toast.error(title, {
                style: { backgroundColor: '#FFEAED' },
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

            // Show success toast
            const message = i18n.language === 'ar'
                ? data.messages.ar || 'تم استرداد المبلغ بنجاح'
                : data.messages.en || 'Refund processed successfully';
            const title = i18n.language === 'ar'
                ? 'نجاح الاسترداد'
                : 'Successful Refund';
            toast.success(title, {
                style: { backgroundColor: '#F3FFF4' },
                description: message,
            });
        },
        onError: (error: any) => {
            const errorMessage = i18n.language === 'ar'
                ? error.response?.data?.messages?.ar || 'فشل استرداد المبلغ'
                : error.response?.data?.messages?.en || 'Failed to process refund';
            const title = i18n.language === 'ar'
                ? 'فشل الاسترداد'
                : 'Failed Refund';
            toast.error(title, {
                style: { backgroundColor: '#FFEAED' },
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
            queryClient.invalidateQueries({ queryKey: ['payment-transaction-detail', transactionId] });

            // Invalidate transaction list queries to update the list screen
            queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
            queryClient.invalidateQueries({ queryKey: ['payment-orders'] });
            // Show success toast
            if (data.status === 'FAILURE') {
                const title = i18n.language === 'ar'
                    ? 'فشل التحصيل'
                    : 'Failed Capture';
                const errorMessage = i18n.language === 'ar'
                    ? data.messages.ar || 'فشل تحصيل المعاملة'
                    : data.messages.en || 'Failed to capture transaction';
                toast.error(title, {
                    style: { backgroundColor: '#FFEAED' },
                    description: errorMessage,
                });
                return;
            }
            const message = i18n.language === 'ar'
                ? data.messages.ar || 'تم تحصيل المعاملة بنجاح'
                : data.messages.en || 'Transaction captured successfully';
            const title = i18n.language === 'ar'
                ? 'نجاح التحصيل'
                : 'Successful Capture';
            toast.success(title, {
                style: { backgroundColor: '#F3FFF4' },
                description: message,
            });
            // showToast({
            //     message,
            //     type: 'success',
            //     duration: 3000,
            // });
        },
        onError: (error: any) => {
            // Show error toast
            const errorMessage = i18n.language === 'ar'
                ? error.response?.data?.messages?.ar || 'فشل تحصيل المعاملة'
                : error.response?.data?.messages?.en || 'Failed to capture transaction';
            const title = i18n.language === 'ar'
                ? 'فشل التحصيل'
                : 'Failed Capture';
            toast.error(title, {
                style: { backgroundColor: '#FFEAED' },
                description: errorMessage,
            });
            // showToast({
            //     message: errorMessage,
            //     type: 'danger',
            //     duration: 4000,
            // });
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
            const message = i18n.language === 'ar'
                ? 'تم إرسال رمز التحقق بنجاح'
                : 'OTP sent successfully';
            const title = i18n.language === 'ar'
                ? 'نجاح الإرسال'
                : 'Successful OTP Send';
            toast.success(title, {
                style: { backgroundColor: '#F3FFF4' },
                description: message,
            });
        },
        onError: (error: any) => {
            const errorMessage = i18n.language === 'ar'
                ? error.response?.data?.messages?.ar || 'فشل إرسال رمز التحقق'
                : error.response?.data?.messages?.en || 'Failed to send OTP';
            const title = i18n.language === 'ar'
                ? 'فشل الإرسال'
                : 'Failed OTP Send';
            toast.error(title, {
                style: { backgroundColor: '#FFEAED' },
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

            const message = i18n.language === 'ar'
                ? data.messages?.ar || 'تم استرداد المبلغ بنجاح'
                : data.messages?.en || 'Refund processed successfully';
            const title = i18n.language === 'ar'
                ? 'نجاح الاسترداد'
                : 'Successful Refund';
            toast.success(title, {
                style: { backgroundColor: '#F3FFF4' },
                description: message,
            });
        },
        onError: (error: any) => {
            let errorMessage = i18n.language === 'ar'
                ? error.response?.data?.messages?.ar || 'فشل استرداد المبلغ'
                : error.response?.data?.messages?.en || 'Failed to process refund';

            if (error.response?.data?.statusCode === 400) {
                errorMessage = i18n.language === 'ar'
                    ? 'رمز التحقق غير صحيح أو منتهي الصلاحية'
                    : 'Invalid or expired OTP';
            }
            const title = i18n.language === 'ar'
                ? 'فشل الاسترداد'
                : 'Failed Refund';
            toast.error(title, {
                style: { backgroundColor: '#FFEAED' },
                description: errorMessage,
            });
            // showToast({
            //     message: errorMessage,
            //     type: 'danger',
            //     duration: 4000,
            // });
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
