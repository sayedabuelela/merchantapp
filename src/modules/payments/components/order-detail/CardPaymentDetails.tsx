import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FontText from '@/src/shared/components/FontText';
import {MasterCardIcon, NBEIcon} from "@/src/shared/assets/svgs";
import {SourceOfFunds} from "@/src/modules/payments/payments.model";

// interface CardPaymentDetailsProps {
//     order: OrderDetailPayment;
// }
interface CardPaymentDetailsProps {
    sourceOfFunds: SourceOfFunds;
}

/**
 * Card payment details card
 */
export const CardPaymentDetails = ({sourceOfFunds}: CardPaymentDetailsProps) => {
    const {t} = useTranslation();

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded gap-y-5">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-1">
                    {/*<View className="w-6 h-6 bg-primary rounded"/>*/}
                    <NBEIcon/>
                    <FontText type="body" weight="semi"
                              className="text-content-primary text-xs uppercase">{sourceOfFunds.issuer}</FontText>
                </View>
                {/*<ValuIcon/>*/}
                {/*<SouhoolaIcon/>*/}
                <MasterCardIcon/>
                {/*<VisaIcon/>*/}
            </View>
            <View className='gap-y-2'>
                <FontText type="body" weight="bold"
                          className="text-content-primary text-base">{sourceOfFunds.maskedCard}</FontText>
                <View className="flex-row items-center justify-between">
                    <FontText type="body" weight="bold"
                              className="text-content-primary text-[10px]">{sourceOfFunds.cardHolderName}</FontText>
                    <FontText type="body" weight="bold"
                              className="text-content-primary text-[10px]">{`${sourceOfFunds.expiryMonth}/${sourceOfFunds.expiryYear}`}</FontText>
                </View>
            </View>
        </View>
    );
};
