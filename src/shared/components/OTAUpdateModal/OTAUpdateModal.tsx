import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState, useCallback } from 'react';
import { AppState, Modal, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Updates from 'expo-updates';
import { t } from 'i18next';
import { ArrowPathIcon } from 'react-native-heroicons/outline';

const OTAUpdateModal = () => {
    const [isUpdateReady, setIsUpdateReady] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);

    const checkForUpdate = useCallback(async () => {
        if (__DEV__) return;
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                const result = await Updates.fetchUpdateAsync();
                if (result.isNew) {
                    setIsUpdateReady(true);
                }
            }
        } catch (e) {
            // Silently fail - don't disrupt the user
        }
    }, []);

    useEffect(() => {
        checkForUpdate();

        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                checkForUpdate();
            }
        });

        return () => subscription.remove();
    }, [checkForUpdate]);

    const handleUpdate = async () => {
        setIsRestarting(true);
        await Updates.reloadAsync();
    };

    return (
        <Modal
            transparent
            visible={isUpdateReady}
            animationType="none"
            statusBarTranslucent
        >
            <AnimatePresence>
                {isUpdateReady && (
                    <View className="flex-1 justify-center items-center">
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'timing', duration: 300 }}
                            className="absolute inset-0 bg-content-secondary/30"
                        >
                            <BlurView
                                intensity={15}
                                tint="dark"
                                style={{ flex: 1 }}
                            />
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'timing', duration: 300 }}
                            className="bg-white rounded-2xl px-6 py-8 mx-6 w-[85%] items-center elevation-md shadow-md shadow-black"
                        >
                            <View className="w-14 h-14 bg-primary/10 rounded-full items-center justify-center mb-4">
                                <ArrowPathIcon size={28} color="#0055FF" />
                            </View>

                            <FontText type="head" weight="bold" className="text-content-hint text-lg mb-2 text-center">
                                {t('Update Available')}
                            </FontText>

                            <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-6 text-center">
                                {t('A new version of the app is ready. Update now to get the latest features and improvements.')}
                            </FontText>

                            <Button
                                title={t('Update')}
                                onPress={handleUpdate}
                                isLoading={isRestarting}
                                fullWidth
                            />
                        </MotiView>
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default OTAUpdateModal;
