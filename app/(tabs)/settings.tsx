import { ROUTES } from '@/src/core/navigation/routes';
import { selectClearAuth, useAuthStore } from '@/src/modules/auth/auth.store';
import { selectSetEnabled, selectSetInitialized, useBiometricStore } from '@/src/modules/auth/biometric/biometric.store';
import { clearCredentials } from '@/src/modules/auth/biometric/biometric.utils';
import { DeveloperSettings } from '@/src/modules/settings/components/DeveloperSettings';
import SettingsScreen from '@/src/modules/settings/views/settings.view';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Settings() {
    // const clearAuth = useAuthStore(selectClearAuth);
    // const router = useRouter();
    // const setInitialized = useBiometricStore(selectSetInitialized);
    // const setEnabled = useBiometricStore(selectSetEnabled);
    // const logout = async () => {
    //     await clearCredentials();
    //     clearAuth();
    //     setInitialized(false);
    //     setEnabled(false);
    //     // router.replace(ROUTES.AUTH.LOGIN);
    // }

    // const changePassword = () => {
    //     router.replace(ROUTES.PROFILE.CHANGE_PASSWORD);
    // }

    return (
        <SettingsScreen />      
    )
}
