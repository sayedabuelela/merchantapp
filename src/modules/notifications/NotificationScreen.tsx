import React, { useCallback, useEffect } from 'react'
import { FlatList, ActivityIndicator, RefreshControl, View } from 'react-native'
import Notification from './components/Notification'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontText from '@/src/shared/components/FontText'
import MainHeader from '@/src/shared/components/headers/MainHeader'
import { useTranslation } from 'react-i18next'
import { useNotificationsVM } from './viewmodels/useNotificationsVM'
import { useUpdateNotificationVM } from './viewmodels/useUpdateNotificationVM'
import { NotificationData } from './notification.model'
import { resetBadgeCount } from './notification.service'

const NotificationScreen = () => {
    const { t } = useTranslation()
    const { notifications, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } = useNotificationsVM()
    const { updateNotification: markAsSeen } = useUpdateNotificationVM()

    // Reset badge count when screen opens
    useEffect(() => {
        resetBadgeCount()
    }, [])

    const handleNotificationPress = useCallback((notification: NotificationData) => {
        // Mark notification as seen
        markAsSeen({ notificationId: notification._id })
    }, [markAsSeen])

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const renderItem = useCallback(({ item }: { item: NotificationData }) => (
        <Notification
            {...item}
            onPress={() => handleNotificationPress(item)}
        />
    ), [handleNotificationPress])

    const renderEmpty = useCallback(() => (
        <FontText type="body" weight="regular" className="text-content-secondary text-center mt-10">
            {t('No notifications')}
        </FontText>
    ), [t])

    // Fixed height on purpose: a footer that mounts/unmounts changes the list's
    // content length, which re-arms VirtualizedList's onEndReached and makes it
    // fire again on every fetch.
    const renderFooter = useCallback(() => (
        <View className="h-10 justify-center">
            {isFetchingNextPage && <ActivityIndicator size="small" />}
        </View>
    ), [isFetchingNextPage])

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <MainHeader title={t('Notifications')} />
                <ActivityIndicator size="large" className="flex-1" />
            </SafeAreaView>
        )
    }

    if (error && notifications.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <MainHeader title={t('Notifications')} />
                <FontText type="body" weight="regular" className="text-content-secondary text-center mt-10 px-6">
                    {t('Error loading notifications')}
                </FontText>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader title={t('Notifications')} />
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerClassName="px-6"
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
            />
        </SafeAreaView>
    )
}

export default NotificationScreen