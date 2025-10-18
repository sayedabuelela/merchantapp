import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const hybridStorage = (secureKey: string) => ({
    getItem: async (name: string): Promise<string | null> => {
        try {
            const token = await SecureStore.getItemAsync(`${name}_${secureKey}`);

            const data = await AsyncStorage.getItem(name);
            const parsedData = data ? JSON.parse(data) : {};

            if (token) {
                parsedData[secureKey] = JSON.parse(token);
            }

            return JSON.stringify(parsedData);
        } catch (error) {
            console.error(`Error reading from storage:`, error);
            return null;
        }
    },

    setItem: async (name: string, value: string): Promise<void> => {
        try {
            const data = JSON.parse(value);

            const token = data[secureKey];

            if (token) {
                await SecureStore.setItemAsync(`${name}_${secureKey}`, JSON.stringify(token));
            }

            await AsyncStorage.setItem(name, JSON.stringify(data));
        } catch (error) {
            console.error(`Error writing to storage:`, error);
        }
    },

    removeItem: async (name: string): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(`${name}_${secureKey}`);
            await AsyncStorage.removeItem(name);
        } catch (error) {
            console.error(`Error removing from storage:`, error);
        }
    }
});