// src/modules/notifications/notification.service.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';
import {NotificationPermissionStatus, PushNotificationData} from './notification.model';
import {router} from "expo-router";
import {getOrCreateDeviceId} from "@/src/core/utils/deviceId";


// const getProjectId = (): string => {
//     console.log('getProjectId', Constants.expoConfig?.extra?.firebaseProjectId)
//     return Constants.expoConfig?.extra?.firebaseProjectId || '';
// };

const checkPermissionsAndRequest = async (): Promise<string | null> => {
    // if (!Device.isDevice) {
    //     console.log('Push notifications are not available in simulator');
    //     return null;
    // }

    // Check if we have permission
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If we don't have permission, ask for it
    if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
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
        // console.log('Push token:', token.data);
        return token.data;
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }
};

const sendTokenToBackend = async (token: string): Promise<void> => {
    // Implement your API call here
    try {
        // Example API call:
        // await apiClient.post('/users/push-token', { token });
        console.log('Token sent to backend:', token);
    } catch (error) {
        console.error('Failed to send token to backend:', error);
    }
};

// ======== PUBLIC API FUNCTIONS ========

// Register for push notifications
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
    const token = await getPushTokenCore();

    if (token) {
        // Save the token to your backend
        // await sendTokenToBackend(token);
    }

    return token;
};

// Get push token for other uses (like login)
export const getPushToken = async (): Promise<string | null> => {
    return await getPushTokenCore();
};

// Check notification permissions
export const checkPermissions = async (): Promise<NotificationPermissionStatus> => {
    const {status} = await Notifications.getPermissionsAsync();
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
            router.push({
                pathname: "/(tabs)/transactions/[id]",
                params: {id: data.transactionId}
            });
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
