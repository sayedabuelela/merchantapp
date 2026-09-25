import Button from '@/src/shared/components/Buttons/Button';
import GeneralModalHeader from '@/src/shared/components/GeneralModal/GeneralModalHeader';
import { t } from 'i18next';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import {
    selectSelectedCurrency,
    selectSetSelectedCurrency,
    useCurrencyStore,
} from '@/src/core/stores/currency.store';
import { BASE_CURRENCY, SelectedCurrencyId } from '@/src/core/constants/currencies';
import CurrencyList from './CurrencyList';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    /** Controlled mode: the currency to seed the draft with. Omit to follow the
     *  global switcher (dashboard). */
    value?: SelectedCurrencyId;
    /** Controlled mode: called with the confirmed selection instead of writing
     *  to the global store — lets a form field own the choice. */
    onSelect?: (currency: SelectedCurrencyId) => void;
}

/**
 * Bottom-sheet-style currency switcher (structural clone of AccountsModal):
 * draft selection + confirm button. Writes to the global currency store unless
 * the caller supplies `value`/`onSelect`.
 */
const CurrencyModal = ({ isVisible, onClose, value, onSelect }: Props) => {
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    const storeCurrency = useCurrencyStore(selectSelectedCurrency);
    const setStoreCurrency = useCurrencyStore(selectSetSelectedCurrency);
    const isControlled = onSelect !== undefined;
    const selectedCurrency = isControlled ? value ?? BASE_CURRENCY : storeCurrency;
    const setSelectedCurrency = isControlled ? onSelect : setStoreCurrency;
    const [draftCurrency, setDraftCurrency] = useState<SelectedCurrencyId>(selectedCurrency);

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);
            setDraftCurrency(selectedCurrency);
        }
    }, [isVisible, selectedCurrency]);

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
                                <BlurView
                                    intensity={15}
                                    tint="dark"
                                    style={{ flex: 1 }}
                                >
                                    <Pressable style={{ flex: 1 }} onPress={handleClose} />
                                </BlurView>
                            </MotiView>

                            <MotiView
                                from={{ translateY: 550 }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: 550 }}
                                transition={{ type: 'timing', duration: 500 }}
                                className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6 elevation-md min-h-[59%] max-h-[85%] shadow-sm justify-between"
                            >
                                <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-8" />

                                <GeneralModalHeader
                                    title={t('Select currency')}
                                    onClose={handleClose}
                                />

                                <View className="flex-1">
                                    <CurrencyList
                                        selectedCurrency={draftCurrency}
                                        onSelectCurrency={setDraftCurrency}
                                    />
                                </View>

                                <Button
                                    title={t('Select')}
                                    onPress={() => {
                                        setSelectedCurrency(draftCurrency);
                                        handleClose();
                                    }}
                                    className="mt-6"
                                />
                            </MotiView>
                        </View>
                    )}
                </AnimatePresence>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CurrencyModal;
