import { cn } from '@/src/core/utils/cn';
import Button from '@/src/shared/components/Buttons/Button';
import FontText from '@/src/shared/components/FontText';
import GeneralModalHeader from '@/src/shared/components/GeneralModal/GeneralModalHeader';
import Input from '@/src/shared/components/inputs/Input';
import { COMMON_STYLES } from '@/src/shared/styles/main';
import { t } from 'i18next';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import AccountsList from './header/AccountsList';
import { Account } from '../balance.model';
import { useBalanceContext } from '../context/BalanceContext';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    accounts: Account[];
}

const AccountsModal = ({ isVisible, onClose, accounts }: Props) => {
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    const { activeAccount, setActiveAccount } = useBalanceContext();
    const [account, setAccount] = useState(activeAccount);

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

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent>

            <KeyboardAvoidingView behavior="padding" className="flex-1">
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
                                    transition={{ type: 'timing', duration: 500 }}
                                    className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md shadow-sm"
                                >
                                    <View className="w-8 h-[3px] bg-content-disabled rounded-full self-center mb-8" />

                                    <GeneralModalHeader
                                        title={t('Select account')}
                                        onClose={handleClose}
                                    />

                                    {/* Amount Range */}
                                    <View className="">
                                        <AccountsList
                                            accounts={accounts}
                                            setActiveAccount={setAccount}
                                            activeAccount={account}
                                        />
                                    </View>


                                    {/* Action Buttons */}
                                    <Button
                                        title={t('Select')}
                                        onPress={() => {
                                            setActiveAccount(account);
                                            handleClose();
                                        }}
                                        className="mt-6"
                                    // disabled={activeStore === currentMerchantId}
                                    />
                                </MotiView>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </AnimatePresence>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AccountsModal;
