import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { SourceOfFunds } from '@/src/modules/payments/payments.model';
import { WalletIcon } from '@/src/shared/assets/svgs';

interface WalletPaymentDetailsProps {
    sourceOfFunds: SourceOfFunds;
    paymentChannel?: string;
}

/**
 * Wallet payment details component
 */
export const WalletPaymentDetails = ({ sourceOfFunds, paymentChannel }: WalletPaymentDetailsProps) => {
    const { t } = useTranslation();

    if (!sourceOfFunds.payerAccount) return null;

    const walletName = sourceOfFunds.payScheme || 'Wallet';
    const displayName = walletName.replace('Cash', ' Cash').trim();

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-5 mt-4 rounded gap-y-5">
            {/* Header with Wallet branding */}
            {/* <View className="flex-row items-center justify-between">
                <FontText type="body" weight="bold" className="text-content-primary text-lg capitalize">
                    {displayName} {paymentChannel && `- ${t(paymentChannel)}`}
                </FontText>
            </View> */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-1">
                    <FontText type="body" weight="semi"
                        className="text-content-primary text-xs uppercase">
                        {displayName}
                    </FontText>
                    {paymentChannel && (
                        <FontText type="body" weight="semi"
                            className="text-content-primary text-[10px] uppercase">
                            - {t(paymentChannel)}
                        </FontText>
                    )}
                </View>
                <WalletIcon />
            </View>

            {/* Payment Details */}
            <View className="">
                {sourceOfFunds.payerAccount && (
                    <FontText type="body" weight="bold" className="text-content-primary text-base">
                        {sourceOfFunds.payerAccount}
                    </FontText>
                )}

                    {/* {sourceOfFunds.payScheme && (
                        <FontText type="body" weight="bold" className="text-content-primary text-[10px] capitalize">
                            {sourceOfFunds.payScheme}
                        </FontText>
                    )} */}

                {sourceOfFunds.walletStrategy && (
                    <FontText type="body" weight="bold" className="text-content-primary text-base">
                        {sourceOfFunds.walletStrategy}
                    </FontText>
                )}
            </View>
        </View>
    );
};
