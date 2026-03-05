import { useTranslation } from 'react-i18next';
import { View, Image } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { MasterCardIcon, NBEIcon, CIBIcon, QNBIcon, BankMisrIcon, ContactSettlementIcon, EmaratIcon } from "@/src/shared/assets/svgs";
import { SourceOfFunds } from "@/src/modules/payments/payments.model";

interface CardPaymentDetailsProps {
    sourceOfFunds: SourceOfFunds;
    paymentChannel?: string;
}
const getIssuerIcon = (issuer: string) => {
    switch (issuer) {
        case 'NBE':
            return <NBEIcon width={90} height={30} />;
        case 'CIB':
            return <Image
                resizeMode='contain'
                style={{
                    width: 50,
                    height: 30
                }}
                source={require(`@/src/shared/assets/svgs/files/banks/cib-seeklogo.png`)}
            />
        case 'QNB':
            return <QNBIcon width={70} height={20} />;
        case 'BM':
            return <BankMisrIcon width={70} height={30} />
        case 'ENBD':
            return <EmaratIcon width={80} height={30} />
        default:
            return null;
    }
};
/**
 * Card payment details card
 */
export const CardPaymentDetails = ({ sourceOfFunds, paymentChannel }: CardPaymentDetailsProps) => {
    const { t } = useTranslation();
    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded gap-y-5">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-1">
                    {sourceOfFunds?.issuer && (
                        getIssuerIcon(sourceOfFunds?.issuer)
                    )}
                    {paymentChannel && (
                        <FontText type="body" weight="semi"
                            className="text-content-primary text-xs uppercase"> - {t(paymentChannel)}</FontText>
                    )}
                </View>
                <MasterCardIcon />
            </View>
            <View className='gap-y-2'>
                <FontText type="body" weight="bold"
                    className="text-content-primary text-base">{sourceOfFunds.maskedCard}</FontText>
                <View className="flex-row items-center justify-between">
                    <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px] uppercase">{sourceOfFunds.cardHolderName}</FontText>
                    <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px] uppercase">{`${sourceOfFunds.expiryMonth}/${sourceOfFunds.expiryYear}`}</FontText>
                </View>
            </View>
        </View>
    );
};
