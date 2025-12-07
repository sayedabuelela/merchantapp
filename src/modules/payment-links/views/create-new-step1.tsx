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
import FadeInDownView from '@/src/shared/components/wrappers/animated-wrappers/FadeInDownView';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';

const CreateNewPaymentLinkStep1Screen = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams<{
        paymentType?: string,
        paymentLinkId?: string,
        qrCode?: string
    }>();

    // Convert route params to proper types
    const paymentType = params.paymentType as 'simple' | 'professional' | undefined;
    const paymentLinkId = params.paymentLinkId;
    const qrCode = params.qrCode === 'true';

    const {
        paymentLink,
        isLoadingPaymentLink,
        isEditMode,
        isSubmitting,
        error,
        submitPaymentLink
    } = usePaymentLinkVM(paymentLinkId);
    const { clearFormData, setQrCode } = usePaymentLinkStore();
    useFocusEffect(
        useCallback(() => {
            if (!isEditMode) {
                clearFormData();
            }
            // Store qrCode value in the store
            setQrCode(qrCode);
        }, [isEditMode, clearFormData, qrCode, setQrCode])
    );
    const onNext = async () => {

    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FadeInDownView delay={0} duration={600}>
                <MainHeader
                    title={t(isEditMode ? 'Edit payment link' : 'Create a payment link')}
                    withBack
                />
            </FadeInDownView>
            <KeyboardAwareScrollView className="flex-1 px-6">
                <AnimatedError errorMsg={t(error?.message || '')} />
                <FadeInUpView delay={150} duration={600}>
                    <PaymentLinkForm
                        key={paymentLinkId ?? "create"}
                        onSubmit={submitPaymentLink}
                        isLoading={isSubmitting}
                        paymentType={paymentType}
                        isEditMode={isEditMode}
                        paymentLink={paymentLink}
                        qrCode={qrCode}
                    />
                </FadeInUpView>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default CreateNewPaymentLinkStep1Screen;