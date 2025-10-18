import { ROUTES } from '@/src/core/navigation/routes';
import { selectClearAuth, useAuthStore } from '@/src/modules/auth/auth.store';
import { selectSetEnabled, selectSetInitialized, useBiometricStore } from '@/src/modules/auth/biometric/biometric.store';
import { clearCredentials } from '@/src/modules/auth/biometric/biometric.utils';
import { DeveloperSettings } from '@/src/modules/settings/components/DeveloperSettings';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const clearAuth = useAuthStore(selectClearAuth);
    const router = useRouter();
    const setInitialized = useBiometricStore(selectSetInitialized);
    const setEnabled = useBiometricStore(selectSetEnabled);
    const logout = async () => {
        await clearCredentials();
        clearAuth();
        setInitialized(false);
        setEnabled(false);
        // router.replace(ROUTES.AUTH.LOGIN);
    }

    const changePassword = () => {
        router.replace(ROUTES.PROFILE.CHANGE_PASSWORD);
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-2 mt-4">
                    <Text className="text-lg font-medium text-gray-800 mb-4">Account Settings</Text>

                    <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <DeveloperSettings />
                    </View>
                    <TouchableOpacity
                        className="bg-primary p-4 rounded-xl"
                        onPress={changePassword}
                    >
                        <Text className="text-white text-center">Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-500 p-4 rounded-xl"
                        onPress={logout}
                    >
                        <Text className="text-white text-center">Logout</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    )
}
