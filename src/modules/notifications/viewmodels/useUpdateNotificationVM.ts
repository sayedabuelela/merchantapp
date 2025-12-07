import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/src/core/api/clients.hooks';
import { useToast } from '@/src/core/providers/ToastProvider';
import { useTranslation } from 'react-i18next';
import { updateNotification, resetBadgeCount } from '../notification.service';

interface UpdateNotificationRequest {
    notificationId: string;
}

export const useUpdateNotificationVM = () => {
    const { api } = useApi();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { t, i18n } = useTranslation();

    const updateMutation = useMutation({
        mutationFn: (request: UpdateNotificationRequest) =>
            updateNotification(api, request.notificationId),
        onSuccess: async () => {
            // Invalidate notifications query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            // Reset badge count
            await resetBadgeCount();

            // Show success toast
            const message = i18n.language === 'ar'
                ? 'تم تحديث الإشعار بنجاح'
                : 'Notification updated successfully';

            showToast({
                message,
                type: 'success',
                duration: 3000,
            });
        },
        onError: (error: any) => {
            // Show error toast
            const errorMessage = i18n.language === 'ar'
                ? error.response?.data?.messages?.ar || 'فشل تحديث الإشعار'
                : error.response?.data?.messages?.en || 'Failed to update notification';

            showToast({
                message: errorMessage,
                type: 'error',
                duration: 3000,
            });
        },
    });

    return {
        updateNotification: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        error: updateMutation.error,
    };
};
