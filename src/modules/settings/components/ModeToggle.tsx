import React, { useEffect } from 'react'
import { View, Switch } from 'react-native'
import { useEnvironment } from "@/src/core/environment/useEnvironment.hook"
import { useQueryClient } from '@tanstack/react-query';
import FontText from '@/src/shared/components/FontText';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/core/utils/cn';
import { useAuthStore } from '@/src/modules/auth/auth.store';
import { selectUser } from '@/src/modules/auth/auth.store';

export const ModeToggle = () => {
    const { isLiveMode, toggleMode, mode } = useEnvironment()
    const user = useAuthStore(selectUser)
    const queryClient = useQueryClient()

    useEffect(() => {
        queryClient.invalidateQueries({ refetchType: "active" });
    }, [mode, queryClient]);

    const { t } = useTranslation();
    return (
        <View className="flex-row items-center justify-between border-b border-stroke-main py-4">
            <View className="flex-row items-center">
                <View className={cn('w-5 h-5 rounded-full', isLiveMode ? 'bg-[#388E3B]' : 'bg-[#919C9C]')} />
                <FontText
                    type="body"
                    weight="bold"
                    className="text-primary ml-2 text-base self-start capitalize"
                >
                    {t(`${mode} mode`)}
                </FontText>
            </View>
            <Switch
                value={user?.isLive ? isLiveMode : false}
                onValueChange={toggleMode}
                trackColor={{ false: '#919C9C', true: '#388E3B' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#919C9C"
                disabled={!user?.isLive}
            />
        </View>
    )
}
