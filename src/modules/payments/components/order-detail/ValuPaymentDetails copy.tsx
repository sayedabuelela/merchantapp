import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { SourceOfFunds } from '@/src/modules/payments/payments.model';

interface ValuPaymentDetailsProps {
    sourceOfFunds: SourceOfFunds;
}

/**
 * VALU payment details component
 */
export const ValuPaymentDetails = ({ sourceOfFunds }: ValuPaymentDetailsProps) => {
    const { t } = useTranslation();
    const payerInfo = sourceOfFunds.payerInfo;

    if (!payerInfo) return null;

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded gap-y-5">
            {/* Header with VALU branding */}
            <View className="flex-row items-center justify-between">
                <FontText type="body" weight="bold" className="text-content-primary text-lg">
                    {t('VALU Payment')}
                </FontText>
            </View>

            {/* Payment Details */}
            <View className="gap-y-3">
                {payerInfo.mobileNumber && (
                    <View className="gap-y-1">
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {t('Mobile Number')}
                        </FontText>
                        <FontText type="body" weight="semi" className="text-content-primary text-sm">
                            {payerInfo.mobileNumber}
                        </FontText>
                    </View>
                )}

                {payerInfo.loanNumber && (
                    <View className="gap-y-1">
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                            {t('Loan Number')}
                        </FontText>
                        <FontText type="body" weight="semi" className="text-content-primary text-sm">
                            {payerInfo.loanNumber}
                        </FontText>
                    </View>
                )}

                <View className="flex-row items-center justify-between">
                    {payerInfo.financedAmount !== undefined && (
                        <View className="gap-y-1">
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                                {t('Financed Amount')}
                            </FontText>
                            <FontText type="body" weight="bold" className="text-content-primary text-sm">
                                {payerInfo.financedAmount} EGP
                            </FontText>
                        </View>
                    )}

                    {payerInfo.emi !== undefined && (
                        <View className="gap-y-1">
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                                {t('EMI')}
                            </FontText>
                            <FontText type="body" weight="bold" className="text-content-primary text-sm">
                                {payerInfo.emi} EGP
                            </FontText>
                        </View>
                    )}

                    {payerInfo.tenure !== undefined && (
                        <View className="gap-y-1">
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                                {t('Tenure')}
                            </FontText>
                            <FontText type="body" weight="bold" className="text-content-primary text-sm">
                                {payerInfo.tenure} {t('months')}
                            </FontText>
                        </View>
                    )}
                </View>

                {(payerInfo.firstEmiDueDate || payerInfo.lastInstallmentDate) && (
                    <View className="flex-row items-center justify-between">
                        {payerInfo.firstEmiDueDate && (
                            <View className="gap-y-1">
                                <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                    {t('First EMI Due')}
                                </FontText>
                                <FontText type="body" weight="bold" className="text-content-primary text-[10px]">
                                    {payerInfo.firstEmiDueDate}
                                </FontText>
                            </View>
                        )}

                        {payerInfo.lastInstallmentDate && (
                            <View className="gap-y-1">
                                <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                                    {t('Last Installment')}
                                </FontText>
                                <FontText type="body" weight="bold" className="text-content-primary text-[10px]">
                                    {payerInfo.lastInstallmentDate}
                                </FontText>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};
