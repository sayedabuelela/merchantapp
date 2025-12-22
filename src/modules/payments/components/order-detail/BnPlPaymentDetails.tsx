import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { SourceOfFunds } from '@/src/modules/payments/payments.model';
import { MasterCardIcon, NBEIcon, VisaIcon, AmanSettlementIcon, ValuIcon, SouhoolaSettlementIcon, } from '@/src/shared/assets/svgs';

interface BnPlPaymentDetailsProps {
    method: string;
    sourceOfFunds: SourceOfFunds;
    paymentChannel?: string;
}

/**
 * VALU payment details component
 */
export const BnPlPaymentDetails = ({ method, sourceOfFunds, paymentChannel }: BnPlPaymentDetailsProps) => {
    const { t } = useTranslation();
    const payerInfo = sourceOfFunds.payerInfo;
    console.log('sourceOfFunds : ', sourceOfFunds);
    if (!payerInfo) return null;

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded gap-y-5">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-1">
                    {/*<View className="w-6 h-6 bg-primary rounded"/>*/}
                    {/* <NBEIcon /> */}
                    <FontText type="body" weight="semi"
                        className="text-content-primary text-xs uppercase">{method} {paymentChannel && `-${t(paymentChannel)}`}</FontText>
                </View>
                {method === 'valu' && <ValuIcon />}
                {method === 'aman' && <View className="justify-center items-center w-[75px] h-[60px] bg-[#16BBC5] rounded"><AmanSettlementIcon  height={50} /></View>}
                {method === 'sohoola' && <SouhoolaSettlementIcon />}
                {/*<SouhoolaIcon/>*/}
                {/* <MasterCardIcon /> */}
                {/*<VisaIcon/>*/}
            </View>
            <View className='gap-y-2'>
                <FontText type="body" weight="bold"
                    className="text-content-primary text-base">{method === 'value' ? payerInfo.loanNumber : payerInfo.cardNumber}</FontText>
                <View className="flex-row items-center justify-between">
                    {/* <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px]">{method === 'value' ? payerInfo.customerName : `TRX : ${payerInfo.transactionId}`}</FontText> */}
                    <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px]">{payerInfo.customerName}</FontText>
                    <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px]">{`${payerInfo.mobileNumber}`}</FontText>
                </View>
            </View>
        </View>
    );
};
