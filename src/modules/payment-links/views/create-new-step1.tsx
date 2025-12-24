import AnimatedError from '@/src/shared/components/animated-messages/AnimatedError';
import MainHeader from '@/src/shared/components/headers/MainHeader';
import { Redirect, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentLinkForm from '../components/create-payment/PaymentLinkForm';
import { usePaymentLinkStore } from '../paymentLink.store';
import usePaymentLinkVM from '../viewmodels/usePaymentLinkVM';
import FadeInDownView from '@/src/shared/components/wrappers/animated-wrappers/FadeInDownView';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import usePermissions from '@/src/modules/auth/hooks/usePermissions';
import { ROUTES } from '@/src/core/navigation/routes';

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

    // Permission checks
    const user = useAuthStore(selectUser);
    const permissions = usePermissions(
        user?.actions || {},
        user?.merchantId,
        paymentLink?.createdByUserId
    );

    // Create mode: check canCreatePaymentLinks
    if (!isEditMode && !permissions.canCreatePaymentLinks) {
        return <Redirect href={ROUTES.TABS.PAYMENT_LINKS} />;
    }

    // Edit mode: check canEditPaymentLink (with ownership)
    if (isEditMode && paymentLink && !permissions.canEditPaymentLink) {
        return <Redirect href={ROUTES.TABS.PAYMENT_LINKS} />;
    }

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