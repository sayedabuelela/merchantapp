import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { PayerInfo, PaymentMethod, SourceOfFunds } from '@/src/modules/payments/payments.model';
import { MasterCardIcon, NBEIcon, VisaIcon, AmanSettlementIcon, ValuIcon, SouhoolaSettlementIcon, ContactSettlementIcon, } from '@/src/shared/assets/svgs';

interface BnPlPaymentDetailsProps {
    method: string;
    sourceOfFunds: SourceOfFunds;
    paymentChannel?: string;
}

const getReferenceNumber = (method: PaymentMethod, payerInfo: PayerInfo): string | number | undefined => {
    switch (method) {
        case 'valu':
        case 'souhoola':
            return payerInfo.loanNumber;
        case 'contact':
            return payerInfo.invoiceNo;
        case 'mogo':
            return payerInfo.planId;
        default:
            return payerInfo.cardNumber;
    }
};

const getPhoneNumber = (method: PaymentMethod, payerInfo: PayerInfo): string | undefined => {
    switch (method) {
        case 'souhoola':
            return payerInfo.phoneNumber;
        case 'mogo':
            return payerInfo.phoneNumber;
        case 'contact':
            return payerInfo.mobile;
        case 'valu':
        case 'aman':
        default:
            return payerInfo.mobileNumber;
    }
};

const getTransactionDisplay = (method: PaymentMethod, payerInfo: PayerInfo): string | undefined => {
    if (method === 'valu') {
        return payerInfo.customerName || undefined;
    }
    if (payerInfo.transactionId) {
        return `TX-${payerInfo.transactionId}`;
    }
    return payerInfo.customerName || undefined;
};

const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
        case 'valu':
            return <ValuIcon />;
        case 'aman':
            return <View className="justify-center items-center w-[75px] h-[60px] bg-[#16BBC5] rounded"><AmanSettlementIcon height={50} /></View>;
        case 'souhoola':
            return <View className="justify-center items-center w-[75px]"><SouhoolaSettlementIcon height={40} /></View>;
        case 'contact':
            return <View className="justify-center items-center w-[40px]"><ContactSettlementIcon height={40} /></View>;
        // case 'mogo':
        //     return <View className="justify-center items-center w-[40px]"><MogoSettlementIcon height={40} /></View>;
        default:
            return null;
    }
};


export const BnPlPaymentDetails = ({ method, sourceOfFunds, paymentChannel }: BnPlPaymentDetailsProps) => {
    const { t } = useTranslation();
    const payerInfo = sourceOfFunds.payerInfo;
    if (!payerInfo) return null;
    // Normalize method to lowercase for consistent comparison
    const normalizedMethod = method?.toLowerCase() as PaymentMethod;

    const referenceNumber = getReferenceNumber(normalizedMethod, payerInfo);
    const phoneNumber = getPhoneNumber(normalizedMethod, payerInfo);
    const transactionDisplay = getTransactionDisplay(normalizedMethod, payerInfo);

    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded ">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-1">
                    <FontText type="body" weight="semi"
                        className="text-content-primary text-xs uppercase">
                        {method} {paymentChannel && `-${t(paymentChannel)}`}
                    </FontText>
                </View>
                {getMethodIcon(normalizedMethod)}
            </View>
            <View className='gap-y-2'>
                {referenceNumber && (
                    <FontText type="body" weight="bold"
                        className="text-content-primary text-base">
                        {referenceNumber}
                    </FontText>
                )}
                <View className="flex-row items-center justify-between">
                    {transactionDisplay && (
                        <FontText type="body" weight="bold"
                            className="text-content-primary text-[10px]">
                            {transactionDisplay}
                        </FontText>
                    )}
                    {payerInfo.customerName && (
                        <FontText type="body" weight="bold"
                            className="text-content-primary text-xxs">
                            {payerInfo.customerName}
                        </FontText>
                    )}
                    {phoneNumber && (
                        <FontText type="body" weight="bold"
                            className="text-content-primary text-xxs mt-1">
                            {phoneNumber}
                        </FontText>
                    )}
                </View>
            </View>
        </View>
    );
};
