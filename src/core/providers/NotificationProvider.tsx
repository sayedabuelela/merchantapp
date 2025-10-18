// src/providers/NotificationProvider.tsx
import React, {useEffect} from 'react';
import * as Notifications from 'expo-notifications';
import {
    checkInitialNotification,
    configureAndroidNotificationChannel,
    handleNotificationResponse,
    registerForPushNotificationsAsync
} from '@/src/modules/notifications/notification.service';

export function NotificationProvider({children}: { children: React.ReactNode }) {
    useEffect(() => {
        // Initial setup
        const setupNotifications = async () => {
            await registerForPushNotificationsAsync();
            await configureAndroidNotificationChannel();
        };

        setupNotifications();

        // Check if app was opened from a notification
        checkInitialNotification();

        // Set up notification listeners
        const foregroundSubscription = Notifications.addNotificationReceivedListener(
            notification => {
                console.log('Notification received in foreground:', notification);
            }
        );

        const responseSubscription = Notifications.addNotificationResponseReceivedListener(
            response => {
                handleNotificationResponse(response);
            }
        );

        // Clean up listeners on unmount
        return () => {
            foregroundSubscription.remove();
            responseSubscription.remove();
        };
    }, []);

    return <>{children}</>;
}
