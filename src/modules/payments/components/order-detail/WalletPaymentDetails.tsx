import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { SourceOfFunds } from '@/src/modules/payments/payments.model';

interface WalletPaymentDetailsProps {
    sourceOfFunds: SourceOfFunds;
}

/**
 * Wallet payment details component
 */
export const WalletPaymentDetails = ({ sourceOfFunds }: WalletPaymentDetailsProps) => {
    const { t } = useTranslation();

    if (!sourceOfFunds.payerAccount) return null;

    const walletName = sourceOfFunds.payScheme || 'Wallet';
    const displayName = walletName.replace('Cash', ' Cash').trim();

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded gap-y-5">
            {/* Header with Wallet branding */}
            <View className="flex-row items-center justify-between">
                <FontText type="body" weight="bold" className="text-content-primary text-lg capitalize">
                    {displayName}
                </FontText>
            </View>

            {/* Payment Details */}
            <View className="gap-y-3">
                {sourceOfFunds.payerAccount && (
                    <View className="gap-y-1">
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {t('Phone Number')}
                        </FontText>
                        <FontText type="body" weight="bold" className="text-content-primary text-base">
                            {sourceOfFunds.payerAccount}
                        </FontText>
                    </View>
                )}

                <View className="flex-row items-center justify-between">
                    {sourceOfFunds.payScheme && (
                        <View className="gap-y-1">
                            <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                {t('Payment Scheme')}
                            </FontText>
                            <FontText type="body" weight="bold" className="text-content-primary text-[10px] capitalize">
                                {sourceOfFunds.payScheme}
                            </FontText>
                        </View>
                    )}

                    {sourceOfFunds.walletStrategy && (
                        <View className="gap-y-1">
                            <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                {t('Wallet Strategy')}
                            </FontText>
                            <FontText type="body" weight="bold" className="text-content-primary text-[10px] capitalize">
                                {sourceOfFunds.walletStrategy}
                            </FontText>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};
