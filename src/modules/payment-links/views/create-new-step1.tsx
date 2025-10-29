import AnimatedError from '@/src/shared/components/animated-messages/AnimatedError';
import MainHeader from '@/src/shared/components/headers/MainHeader';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentLinkForm from '../components/create-payment/PaymentLinkForm';
import { usePaymentLinkStore } from '../paymentLink.store';
import usePaymentLinkVM from '../viewmodels/usePaymentLinkVM';
const CreateNewPaymentLinkStep1Screen = () => {
    const { t } = useTranslation();
    const { paymentType, paymentLinkId } = useLocalSearchParams<{
        paymentType: 'simple' | 'professional',
        paymentLinkId?: string
    }>();

    const {
        paymentLink,
        isLoadingPaymentLink,
        isEditMode,
        isSubmitting,
        error,
        submitPaymentLink
    } = usePaymentLinkVM(paymentLinkId);
    const { clearFormData } = usePaymentLinkStore();
    useFocusEffect(
        useCallback(() => {
            if (!isEditMode) {
                clearFormData();
            }
        }, [isEditMode, clearFormData])
    );
    const onNext = async () => {

    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader
                title={t(isEditMode ? 'Edit payment link' : 'Create a payment link')}
                withBack
            />
            <KeyboardAwareScrollView className="flex-1 px-6">
                <AnimatedError errorMsg={t(error?.message || '')} />
                <PaymentLinkForm
                    key={paymentLinkId ?? "create"}
                    onSubmit={submitPaymentLink}
                    isLoading={isSubmitting}
                    paymentType={paymentType}
                    isEditMode={isEditMode}
                    paymentLink={paymentLink}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default CreateNewPaymentLinkStep1Screen;