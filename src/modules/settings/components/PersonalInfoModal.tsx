import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { AnimatePresence, MotiView } from 'moti';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View, FlatList } from 'react-native';
import { BuildingStorefrontIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { ChevronDownIcon } from 'react-native-heroicons/solid';
import { KeyboardController } from 'react-native-keyboard-controller';
import StoresListBottomSheet, { StoresListBottomSheetRef } from './StoresListBottomSheet';
import { UserPersonalInfo } from '@/src/shared/assets/svgs';
import { cn } from '@/src/core/utils/cn';
import PersonalInfoItem from './PersonalInfoItem';
import { StoreItemProps } from './StoresList';
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import { useSwitchMerchantId } from '@/src/modules/auth/hooks/useMerchant';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onLogout: () => void;
}



const PersonalInfoModal = ({ isVisible, onClose, onLogout }: Props) => {
    const user = useAuthStore(selectUser);
    const { switchMerchant } = useSwitchMerchantId();
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    // console.log("user : ", user);
    // const [selectedStore, setSelectedStore] = useState<StoreItemProps | null>(null);
    const { t } = useTranslation();
    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        onClose();
        setIsAnimating(false);
    };
    const storesListBottomSheetRef = useRef<StoresListBottomSheetRef>(null);
    const handleCloseBottomSheet = () => {
        storesListBottomSheetRef.current?.close();
    };
    const handleExpandBottomSheet = () => {
        storesListBottomSheetRef.current?.expand();
    };
    const handleSelectStore = (merchantId: string) => {
        // Close the bottom sheet
        storesListBottomSheetRef.current?.close();

        // Trigger mutation
        switchMerchant(merchantId);
    };

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            {/* <KeyboardAvoidingView behavior="padding" className="flex-1"> */}
            <AnimatePresence onExitComplete={() => {
                setShowModal(false);
                setIsAnimating(false);
            }}>
                {isAnimating && (
                    <View className="flex-1 justify-end">
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'timing', duration: 300 }}
                            className="absolute inset-0 bg-content-secondary/30"
                        >
                            <Pressable style={{ flex: 1 }} onPress={handleClose} />
                        </MotiView>

                        <TouchableWithoutFeedback onPress={() => KeyboardController?.dismiss()}>
                            <MotiView
                                from={{ translateY: 550 }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: 550 }}
                                transition={{
                                    type: 'timing',
                                    duration: 500,
                                }}
                                className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md shadow-md h-[88%]"
                            >
                                <View className="w-8 h-[3px] bg-content-disabled rounded-full self-center mb-6" />

                                <View className="flex-row justify-end items-center mb-6">
                                    {/* <FontText type="head" weight="bold" className="text-content-primary text-xl">
                                        {t('Are you sure you want to log out?')}
                                    </FontText> */}
                                    <TouchableOpacity
                                        onPress={handleClose}
                                        className="items-center justify-center bg-feedback-error-bg w-7 h-7 rounded-full"
                                    >
                                        <XMarkIcon size={18} color="#A50017" />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    {user?.belongsTo !== undefined && (
                                        <Pressable onPress={handleExpandBottomSheet} className="items-center gap-y-4 mb-8"
                                            disabled={user?.belongsTo.length === 1}
                                        >
                                            <UserPersonalInfo />
                                            <View className="flex-row items-center">
                                                <BuildingStorefrontIcon size={24} color="#556767" />
                                                <FontText type="head" weight="bold" className="text-content-secondary text-xl mx-1">
                                                    {user?.belongsToMerchants[user?.merchantId].storeName}
                                                </FontText>
                                                {user?.belongsTo.length > 1 && (
                                                    <ChevronDownIcon size={19} color="#556767" />
                                                )}
                                            </View>
                                        </Pressable>
                                    )}

                                    <View>
                                        {user?.fullName && (
                                            <PersonalInfoItem label={t('Full name')} value={user?.fullName} />
                                        )}
                                        {user?.email && (
                                            <PersonalInfoItem label={t('Email address')} value={user?.email} />
                                        )}
                                        {user?.mobileNumber && (
                                            <PersonalInfoItem label={t('Phone number')} value={`${user?.countryCode}${user?.mobileNumber}`} className='border-0' />
                                        )}
                                    </View>

                                </View>
                                {/* Action Buttons */}
                                {/* <View className="mt-8">
                                    <Button
                                        className='bg-danger'
                                        // disabled={isDisabled}
                                        title={t('Log out')}
                                        onPress={handleExpandBottomSheet}
                                    />
                                    <Button
                                        variant="outline"
                                        title={t('Cancel')}
                                        onPress={handleClose}
                                        className="border-0 mt-4"
                                        titleClasses="text-primary"
                                    />
                                </View> */}
                            </MotiView>
                        </TouchableWithoutFeedback>

                    </View>
                )}
            </AnimatePresence>
            <StoresListBottomSheet
                onClose={handleCloseBottomSheet}
                onSelectStore={handleSelectStore}
                ref={storesListBottomSheetRef}
                stores={user?.belongsTo ?? []}
            />
            {/* </KeyboardAvoidingView> */}
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        padding: 36,
        alignItems: 'center',
    },
});
export default PersonalInfoModal;
