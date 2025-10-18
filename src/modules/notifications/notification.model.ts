// src/modules/notifications/notification.models.ts
export interface PushNotificationData {
    title?: string;
    body?: string;
    data?: {
        [key: string]: any;
        screen?: string;
        id?: string;
    };
}

export interface NotificationPermissionStatus {
    granted: boolean;
    status: 'granted' | 'denied' | 'undetermined';
}
