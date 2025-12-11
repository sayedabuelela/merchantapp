// src/providers/NotificationProvider.tsx
import React, { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
    checkInitialNotification,
    configureAndroidNotificationChannel,
    handleNotificationResponse,
    confirmNotificationDelivery,
    getDeviceInfo,
} from '@/src/modules/notifications/notification.service';
import { useApi } from '@/src/core/api/clients.hooks';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { api } = useApi();
    const appState = useRef(AppState.currentState);
    const lastNotificationCheck = useRef<Date>(new Date());

    // Track confirmed notification IDs to prevent duplicates
    const confirmedNotifications = useRef(new Set<string>());

    useEffect(() => {
        // Initial setup
        const setupNotifications = async () => {
            // await registerForPushNotificationsAsync(api);
            await configureAndroidNotificationChannel();
        };

        setupNotifications();

        // Check if app was opened from a notification
        checkInitialNotification();

        // ============================================================
        // DELIVERY CONFIRMATION #1: Foreground (App is Open)
        // ============================================================
        const foregroundSubscription = Notifications.addNotificationReceivedListener(
            async (notification) => {
                console.log('Notification received in foreground:', notification);

                // Extract notification ID from data payload
                const notificationId = notification.request.content.data?._id as string | undefined;

                if (notificationId && !confirmedNotifications.current.has(notificationId)) {
                    const { deviceId } = await getDeviceInfo();
                    await confirmNotificationDelivery(api, notificationId, {
                        deliveredAt: new Date().toISOString(),
                        deviceId,
                        platform: Platform.OS as 'ios' | 'android',
                    });
                    confirmedNotifications.current.add(notificationId);
                    console.log('✅ Delivery confirmed for notification:', notificationId);
                }
            }
        );

        // ============================================================
        // DELIVERY CONFIRMATION #2: Background/Quit (App was Closed)
        // ============================================================
        const checkPendingNotifications = async () => {
            try {
                // Get all notifications that were delivered while app was closed
                const presentedNotifications = await Notifications.getPresentedNotificationsAsync();

                if (presentedNotifications.length > 0) {
                    console.log(`Found ${presentedNotifications.length} notifications to confirm`);

                    const { deviceId } = await getDeviceInfo();

                    // Confirm delivery for each notification (skip already confirmed)
                    for (const notification of presentedNotifications) {
                        const notificationId = notification.request.content.data?._id as string | undefined;

                        if (notificationId && !confirmedNotifications.current.has(notificationId)) {
                            await confirmNotificationDelivery(api, notificationId, {
                                deliveredAt: notification.date.toString(),
                                deviceId,
                                platform: Platform.OS as 'ios' | 'android',
                            });
                            confirmedNotifications.current.add(notificationId);
                            console.log('✅ Delivery confirmed for background notification:', notificationId);
                        }
                    }

                    // NOTE: Do NOT auto-dismiss notifications after delivery confirmation
                    // Delivery = notification reached device (for backend tracking)
                    // Dismissal = user action (should be manual)
                }
            } catch (error) {
                console.error('Error checking pending notifications:', error);
            }
        };

        // AppState listener: Detect when app becomes active (comes from background)
        const appStateSubscription = AppState.addEventListener('change', async (nextAppState) => {
            // App transitioned from background/inactive to active (foreground)
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground - checking for notifications');

                // Only check if it's been more than 5 seconds since last check
                // (to avoid duplicate confirmations)
                const now = new Date();
                const secondsSinceLastCheck = (now.getTime() - lastNotificationCheck.current.getTime()) / 1000;

                if (secondsSinceLastCheck > 5) {
                    await checkPendingNotifications();
                    lastNotificationCheck.current = now;
                }
            }

            appState.current = nextAppState;
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener(
            response => {
                handleNotificationResponse(response);
            }
        );

        // Clean up listeners on unmount
        return () => {
            foregroundSubscription.remove();
            responseSubscription.remove();
            appStateSubscription.remove();
        };
    }, [api]);

    return <>{children}</>;
}
