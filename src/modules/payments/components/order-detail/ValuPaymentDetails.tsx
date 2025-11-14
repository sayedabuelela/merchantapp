import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { SourceOfFunds } from '@/src/modules/payments/payments.model';
import { MasterCardIcon } from '@/src/shared/assets/svgs';
import { NBEIcon } from '@/src/shared/assets/svgs';
import { VisaIcon } from '@/src/shared/assets/svgs';
import { SouhoolaIcon } from '@/src/shared/assets/svgs';
import { ValuIcon } from '@/src/shared/assets/svgs';

interface ValuPaymentDetailsProps {
    sourceOfFunds: SourceOfFunds;
    paymentChannel?: string;
}

/**
 * VALU payment details component
 */
export const ValuPaymentDetails = ({ sourceOfFunds, paymentChannel }: ValuPaymentDetailsProps) => {
    const { t } = useTranslation();
    const payerInfo = sourceOfFunds.payerInfo;

    if (!payerInfo) return null;

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded gap-y-5">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-1">
                    {/*<View className="w-6 h-6 bg-primary rounded"/>*/}
                    {/* <NBEIcon /> */}
                    <FontText type="body" weight="semi"
                        className="text-content-primary text-xs uppercase">{t('VALU')} {paymentChannel && `-${t(paymentChannel)}`}</FontText>
                </View>
                <ValuIcon />
                {/*<SouhoolaIcon/>*/}
                {/* <MasterCardIcon /> */}
                {/*<VisaIcon/>*/}
            </View>
            <View className='gap-y-2'>
                <FontText type="body" weight="bold"
                    className="text-content-primary text-base">{payerInfo.loanNumber}</FontText>
                <View className="flex-row items-center justify-between">
                    <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px]">{payerInfo.customerName}</FontText>
                    {/* <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px]">{`${payerInfo.financedAmount}`}</FontText> */}
                </View>
            </View>
        </View>
    );
};
