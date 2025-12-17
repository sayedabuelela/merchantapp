import { ROUTES } from '@/src/core/navigation/routes';
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import { useSwitchMerchantId } from '@/src/modules/auth/hooks/useMerchant';
import { UserPersonalInfo } from '@/src/shared/assets/svgs';
import FontText from '@/src/shared/components/FontText';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { BuildingStorefrontIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { ChevronDownIcon } from 'react-native-heroicons/solid';
import PersonalInfoItem from './PersonalInfoItem';
import StoresListModal, { StoresListModalRef } from './StoresListModal';
import { BlurView } from 'expo-blur';
interface Props {
    isVisible: boolean;
    onClose: () => void;
    onLogout: () => void;
}



const PersonalInfoModal = ({ isVisible, onClose, onLogout }: Props) => {
    const user = useAuthStore(selectUser);
    const { switchMerchant } = useSwitchMerchantId();
    const router = useRouter();
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isAnimatingStoresList, setIsAnimatingStoresList] = useState(false);
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
    const storesListModalRef = useRef<StoresListModalRef>(null);
    const handleCloseBottomSheet = () => {
        // storesListModalRef.current?.close();
        // setIsBottomSheetOpen(false);
        setIsAnimatingStoresList(false);
    };

    const handleExpandBottomSheet = () => {
        // storesListModalRef.current?.open();
        setIsAnimatingStoresList(true);
    };
    const handleSelectStore = (merchantId: string) => {
        // storesListModalRef.current?.close();
        setIsAnimatingStoresList(false);
        switchMerchant(merchantId);
        router.replace(ROUTES.TABS.HOME);
        handleClose();
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
                            <BlurView
                                intensity={50}
                                tint="dark"
                                style={{ flex: 1 }}
                            >

                                <Pressable style={{ flex: 1 }} onPress={handleClose} />
                            </BlurView>
                        </MotiView>

                        <MotiView
                            from={{ translateY: 550 }}
                            animate={{
                                translateY: isBottomSheetOpen ? 300 : 0
                            }}
                            exit={{ translateY: 550 }}
                            transition={{
                                type: 'timing',
                                duration: 500,
                            }}
                            className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md shadow-md h-[80%]"
                        >
                            <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-6" />

                            <View className="flex-row justify-end items-center mb-6">
                                <TouchableOpacity
                                    onPress={handleClose}
                                    className="items-center justify-center bg-[#F1F6FF] w-7 h-7 rounded-full"
                                >
                                    <XMarkIcon size={18} color="#0F172A" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                {user?.belongsTo !== undefined && (
                                    <Pressable onPress={handleExpandBottomSheet} className="items-center mb-8"
                                        disabled={user?.belongsTo.length === 1}
                                    >
                                        <UserPersonalInfo />
                                        <View className="flex-row items-center mt-4">
                                            <BuildingStorefrontIcon size={24} color="#556767" />
                                            <FontText type="head" weight="bold" className="text-content-secondary text-xl mx-1">
                                                {user?.belongsToMerchants && user?.merchantId && user?.belongsToMerchants[user?.merchantId]?.storeName}
                                            </FontText>
                                            {user?.belongsTo.length > 1 && (
                                                <ChevronDownIcon size={19} color="#556767" />
                                            )}
                                        </View>
                                        <FontText type="head" weight="bold" className="text-content-secondary mt-2">
                                            {user?.merchantId}
                                        </FontText>
                                    </Pressable>
                                )}

                                <View>
                                    {user?.fullName && user?.fullName.length > 0 && (
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

                        <StoresListModal
                            isVisible={isAnimatingStoresList} // or track separately
                            onClose={handleCloseBottomSheet}
                            onSelectStore={handleSelectStore}
                            // isAnimatingStoresList={isAnimatingStoresList}
                            stores={user?.belongsTo ?? []}
                        />
                    </View>
                )}
            </AnimatePresence>
            {/* </KeyboardAvoidingView> */}
        </Modal>
    );
};
export default PersonalInfoModal;
