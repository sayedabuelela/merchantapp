import staticImages from '@/src/core/utils/static-images';
import { useAuthStore } from "@/src/modules/auth/auth.store";
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, View } from 'react-native';

export const prepare = async () => {
    try {
        // Make any API calls you need to do here
        return true;
    } catch (e) {
        console.warn(e);
        return false;
    }
};

// SplashScreen.preventAutoHideAsync();

const SplashProvider = ({ children }: { children: React.ReactNode }) => {
    const [appIsReady, setAppIsReady] = useState(false);
    const initializeAuth = useAuthStore(store => store.initializeAuth);

    useEffect(() => {
        async function initApp() {
            const result = await prepare();

            await Promise.all([
                initializeAuth(),
            ]);

            setTimeout(() => {
                setAppIsReady(true);
            }, 1000);
        }

        initApp();
    }, [initializeAuth]);

    const onLayoutRootView = useCallback(() => {
        if (appIsReady) {
            // SplashScreen.hide();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return (
            <>
                <StatusBar style="light" backgroundColor='#001F5F'/>
                <Image
                    source={staticImages.splashGif}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </>
        )
    }

    return (
        <View onLayout={onLayoutRootView} className={`flex-1 bg-transparent`}>
            {children}
        </View>
    );
};

export default SplashProvider;