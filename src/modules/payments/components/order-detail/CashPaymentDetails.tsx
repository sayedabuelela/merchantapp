import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { SourceOfFunds } from '@/src/modules/payments/payments.model';

interface CashPaymentDetailsProps {
    sourceOfFunds: SourceOfFunds;
    paymentChannel?: string;
}

/**
 * Cash payment details component
 */
export const CashPaymentDetails = ({ sourceOfFunds, paymentChannel }: CashPaymentDetailsProps) => {
    const { t } = useTranslation();

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded gap-y-5">
            {/* Header with Cash branding */}
            <View className="flex-row items-center justify-between">
                <FontText type="body" weight="bold" className="text-content-primary text-lg">
                    {t('Cash Payment') + (paymentChannel && ` - ${t(paymentChannel)}`)}
                </FontText>
            </View>

            {/* Payment Details */}
            <View className="gap-y-1">
                <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                    {t('Payment Type')}
                </FontText>
                <FontText type="body" weight="bold" className="text-content-primary text-base">
                    {sourceOfFunds.type || 'Cash'}
                </FontText>
            </View>
        </View>
    );
};
