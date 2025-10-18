import { Environment } from "@/src/core/environment/environments";
import { useEnvironment } from "@/src/core/environment/useEnvironment.hook";
import { ModeToggle } from "@/src/modules/settings/components/ModeToggle";
import React from 'react';
import { Switch, Text, View } from 'react-native';

export const DeveloperSettings = () => {
    const {
        environment,
        mode,
        setEnvironment,
        setMode,
        isProduction
    } = useEnvironment()


    // Only show in development
    if (!__DEV__) return null

    return (
        <View className="mx-4 my-6 rounded-xl overflow-hidden">
            <View className="px-5 py-4 border-t border-gray-700 flex-row justify-between items-center">
                <View>
                    <Text className="text-base text-white">Environment</Text>
                    <Text className="text-xs text-gray-400 mt-1">
                        {isProduction ? 'Production' : 'Staging'}
                    </Text>
                </View>
                <Switch
                    value={isProduction}
                    onValueChange={(value) =>
                        setEnvironment(value ? Environment.PRODUCTION : Environment.STAGING)
                    }
                    trackColor={{ false: '#4b5563', true: '#6366f1' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#4b5563"
                />
            </View>

            <ModeToggle />

            <View className="p-5 border-t border-gray-700">
                <Text className="text-xs text-gray-400">
                    {`Current: ${environment} / ${mode}`}
                </Text>
            </View>
        </View>
    )
}
