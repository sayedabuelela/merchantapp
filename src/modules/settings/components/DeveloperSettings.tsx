import { Environment } from "@/src/core/environment/environments";
import { useEnvironment } from "@/src/core/environment/useEnvironment.hook";
import React from 'react';
import { Switch, View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';

export const DeveloperSettings = () => {
    const {
        environment,
        mode,
        setEnvironment,
        isProduction,
        isLiveMode,
        toggleMode
    } = useEnvironment()

    // Only show in development
    if (!__DEV__) return null

    return (
        <View className="mb-8 bg-white rounded-2xl border border-stroke-main w-full">
            {/* Header */}
            <View className="bg-surface-tertiary px-4 py-3 border-b border-stroke-main">
                <FontText
                    type="head"
                    weight="bold"
                    className="text-primary text-sm"
                >
                    Developer Settings
                </FontText>
            </View>

            {/* Environment Toggle */}
            <View className="px-4 py-4 border-b border-stroke-main flex-row justify-between items-center">
                <View>
                    <FontText
                        type="body"
                        weight="semi"
                        className="text-content-primary text-base"
                    >
                        Environment
                    </FontText>
                    <FontText
                        type="body"
                        weight="regular"
                        className="text-content-secondary text-sm mt-1"
                    >
                        {isProduction ? 'Production' : 'Staging'}
                    </FontText>
                </View>
                <Switch
                    value={isProduction}
                    onValueChange={(value) =>
                        setEnvironment(value ? Environment.PRODUCTION : Environment.STAGING)
                    }
                    trackColor={{ false: '#919C9C', true: '#001F5F' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#919C9C"
                />
            </View>

            {/* Mode Toggle */}
            <View className="px-4 py-4 border-b border-stroke-main flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <View className={cn('w-5 h-5 rounded-full', isLiveMode ? 'bg-[#388E3B]' : 'bg-[#919C9C]')} />
                    <View className="ml-3">
                        <FontText
                            type="body"
                            weight="semi"
                            className="text-content-primary text-base"
                        >
                            {isLiveMode ? 'Live Mode' : 'Test Mode'}
                        </FontText>
                        <FontText
                            type="body"
                            weight="regular"
                            className="text-content-secondary text-sm mt-1"
                        >
                            {isLiveMode ? 'Production data' : 'Sandbox data'}
                        </FontText>
                    </View>
                </View>
                <Switch
                    value={isLiveMode}
                    onValueChange={toggleMode}
                    trackColor={{ false: '#919C9C', true: '#388E3B' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#919C9C"
                />
            </View>

            {/* Current Configuration */}
            <View className="px-4 py-3 bg-surface-tertiary">
                <FontText
                    type="body"
                    weight="medium"
                    className="text-content-hint text-xs"
                >
                    Current: {environment} / {mode}
                </FontText>
            </View>
        </View>
    )
}
