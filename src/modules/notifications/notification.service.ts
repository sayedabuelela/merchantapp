// src/modules/notifications/notification.service.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationPermissionStatus, NotificationData, PushNotificationData, NotificationsAPIResponse, NotificationsResponse } from './notification.model';
import { router } from "expo-router";
import { getOrCreateDeviceId } from "@/src/core/utils/deviceId";
import { AxiosInstance } from "axios";

// const getProjectId = (): string => {
//     console.log('getProjectId', Constants.expoConfig?.extra?.firebaseProjectId)
//     return Constants.expoConfig?.extra?.firebaseProjectId || '';
// };

export const getNotificationsList = async (
    api: AxiosInstance,
    addedById: string,
    pageSize = 10,
    pageParam = 1,
): Promise<NotificationsResponse> => {
    try {
        const response = await api.get<NotificationsAPIResponse>(
            `notifications/${addedById}`,
            { params: { pageSize, pageParam } }
        );

        // Extract from deeply nested structure
        // Handle both possible response structures
        const innerResponse = response.data?.response?.body?.response || response.data;

        // Validate the response has the expected structure
        if (!innerResponse || !Array.isArray(innerResponse.docs)) {
            console.error('Invalid notification response structure:', response.data);
            throw new Error('Invalid notification response structure');
        }

        return {
            data: innerResponse.docs,
            pagination: {
                page: innerResponse.page,
                totalPages: innerResponse.totalPages,
                limit: innerResponse.limit,
                totalDocs: innerResponse.totalDocs,
                pagingCounter: innerResponse.pagingCounter,
                hasPrevPage: innerResponse.hasPrevPage,
                hasNextPage: innerResponse.hasNextPage,
                prevPage: innerResponse.prevPage,
                nextPage: innerResponse.nextPage,
                unSeenCount: innerResponse.unSeenCount,
            },
            unSeenCount: innerResponse.unSeenCount,
        };
    } catch (error) {
        console.error('Error fetching notifications list:', error);
        throw error;
    }
};

export const updateNotification = async (api: AxiosInstance, orderId: string): Promise<NotificationData[]> => {
    try {
        const response = await api.put(`notification/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

const checkPermissionsAndRequest = async (): Promise<string | null> => {
    // if (!Device.isDevice) {
    //     console.log('Push notifications are not available in simulator');
    //     return null;
    // }

    // Check if we have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If we don't have permission, ask for it
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token: permission not granted!');
        return null;
    }

    return finalStatus;
};

const getPushTokenCore = async (): Promise<string | null> => {
    try {
        // Check permissions first
        const permissionStatus = await checkPermissionsAndRequest();
        if (permissionStatus !== 'granted') {
            return null;
        }

        const token = await Notifications.getDevicePushTokenAsync();
        console.log('Push token:', token.data);
        return token.data;
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }
};

const sendTokenToBackend = async (token: string, api: AxiosInstance): Promise<void> => {
    try {
        const { deviceId, huawei } = await getDeviceInfo();
        await api.post('/v2/identity/fcm-token', {
            fcmToken: token,
            deviceId,
            huawei,
        });
        console.log('✅ Token registered with backend:', token);
    } catch (error) {
        console.error('❌ Failed to register token with backend:', error);
        throw error;
    }
};

// ======== PUBLIC API FUNCTIONS ========

// Register for push notifications
export const registerForPushNotificationsAsync = async (
    api: AxiosInstance
): Promise<string | null> => {
    const token = await getPushTokenCore();

    if (token) {
        await sendTokenToBackend(token, api);
    }

    return token;
};

// Get push token for other uses (like login)
export const getPushToken = async (): Promise<string | null> => {
    return await getPushTokenCore();
};

// Check notification permissions
export const checkPermissions = async (): Promise<NotificationPermissionStatus> => {
    const { status } = await Notifications.getPermissionsAsync();
    return {
        granted: status === 'granted',
        status,
    };
};

// Send a local notification (useful for testing)
export const sendLocalNotification = async (notification: PushNotificationData): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: notification.title || 'Notification',
            body: notification.body || '',
            data: notification.data || {},
        },
        trigger: null, // null means show immediately
    });
};

// Handle notification taps and navigate to the correct screen
export const handleNotificationResponse = (response: Notifications.NotificationResponse): void => {
    try {
        const data = response.notification.request.content.data;
        console.log('Handling notification response:', data);

        if (!data) return;

        // Navigate based on the notification data
        if (data.type === 'transaction' && data.transactionId) {
            router.push(`/payments/transaction/${data.transactionId}` as any);
        }
    } catch (error) {
        console.error('Error handling notification response:', error);
    }
};

export const getDeviceInfo = async (): Promise<{ deviceId: string; huawei: boolean }> => {
    const deviceId = await getOrCreateDeviceId()

    const huawei = (Device.brand || '').toUpperCase() === 'HUAWEI';

    return {
        deviceId,
        huawei
    };
};

export const configureAndroidNotificationChannel = async (): Promise<void> => {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
};

// Check for initial notification (when app was opened from a notification)
export const checkInitialNotification = async (): Promise<void> => {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
        console.log('App opened from notification:', response);
        handleNotificationResponse(response);
    }
};

// Badge management
export const setBadgeCount = async (count: number): Promise<void> => {
    await Notifications.setBadgeCountAsync(count);
};

export const getBadgeCount = async (): Promise<number> => {
    return await Notifications.getBadgeCountAsync();
};

export const incrementBadgeCount = async (): Promise<void> => {
    const currentCount = await getBadgeCount();
    await setBadgeCount(currentCount + 1);
};

export const resetBadgeCount = async (): Promise<void> => {
    await setBadgeCount(0);
};

export const confirmNotificationDelivery = async (
    api: AxiosInstance,
    notificationId: string,
    deliveryData: {
        deliveredAt: string;
        deviceId: string;
        platform: 'ios' | 'android';
    }
): Promise<void> => {
    try {
        await api.post(`notifications/${notificationId}/delivery`, deliveryData);
        console.log('Delivery confirmed for notification:', notificationId);
    } catch (error) {
        console.error('Error confirming notification delivery:', error);
        // Don't throw - delivery confirmation failures shouldn't break the app
    }
};