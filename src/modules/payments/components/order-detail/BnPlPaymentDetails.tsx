import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { PayerInfo, PaymentMethod, SourceOfFunds } from '@/src/modules/payments/payments.model';
import { AmanSettlementIcon, ValuIcon, SouhoolaSettlementIcon, ContactSettlementIcon, MogoIcon } from '@/src/shared/assets/svgs';
import { PressableScale } from 'pressto';
import { DocumentDuplicateIcon } from 'react-native-heroicons/outline';
import { useClipboard } from '@/src/shared/hooks/useClipboard';

interface BnPlPaymentDetailsProps {
    method: string;
    sourceOfFunds: SourceOfFunds;
    paymentChannel?: string;
}

/**
 * Get loan number or plan ID based on payment method
 * - Mogo uses planId
 * - Valu, Souhoola use loanNumber
 * - Contact uses invoiceNo as loan reference
 */
const getLoanOrPlanId = (method: PaymentMethod, payerInfo: PayerInfo): string | number | undefined => {

    switch (method) {
        case 'mogo':
            return payerInfo.loanNumber;
        case 'valu':
        case 'souhoola':
            return payerInfo.loanNumber;
        case 'contact':
            return payerInfo.invoiceNo;
        case 'aman':
            return payerInfo.transactionId;
        default:
            return payerInfo.loanNumber;
    }
};

/**
 * Get mobile/phone number based on payment method
 */
const getPhoneNumber = (method: PaymentMethod, payerInfo: PayerInfo): string | undefined => {
    switch (method) {
        case 'souhoola':
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

/**
 * Get the provider icon based on payment method
 */
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
        case 'mogo':
            return <MogoIcon height={40} width={70} />;
        default:
            return null;
    }
};

/**
 * BNPL Payment Details Card
 * Displays: Icon, Type (method-channel), Loan Number/Plan ID value, Mobile
 */
export const BnPlPaymentDetails = ({ method, sourceOfFunds, paymentChannel }: BnPlPaymentDetailsProps) => {
    const { t } = useTranslation();
    const payerInfo = sourceOfFunds.payerInfo;
    if (!payerInfo) return null;
    const { copy, isCopied } = useClipboard();

    const normalizedMethod = method?.toLowerCase() as PaymentMethod;
    const loanOrPlanId = getLoanOrPlanId(normalizedMethod, payerInfo);
    const phoneNumber = getPhoneNumber(normalizedMethod, payerInfo);
    const handleCopy = async () => {
        if (typeof loanOrPlanId === 'string' && loanOrPlanId !== "NA") {
            await copy(loanOrPlanId)
        }
    }
    return (
        <View className="bg-[#F1F6FF] border border-[#D9E5FF] p-6 mt-4 rounded">
            {/* Row 1: Type (method - channel) + Icon */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-1">
                    <FontText type="body" weight="semi"
                        className="text-content-primary text-xs uppercase">
                        {method}
                    </FontText>
                    {paymentChannel && (
                        <FontText type="body" weight="semi"
                            className="text-content-primary text-[10px] uppercase">
                            - {t(paymentChannel)}
                        </FontText>
                    )}
                </View>
                {getMethodIcon(normalizedMethod)}
            </View>

            {/* Row 2: Loan Number / Plan ID value + Mobile */}
            <View className="gap-y-2">
                {loanOrPlanId && (
                    <View className='flex-row items-center gap-x-1'>
                        <FontText type="body" weight="bold"
                            className="text-content-primary text-sm">
                            {loanOrPlanId}
                        </FontText>
                        <PressableScale onPress={handleCopy}>
                            <DocumentDuplicateIcon size={18} color={'#001F5F'} />
                        </PressableScale>
                    </View>
                )}
                {phoneNumber && (
                    <FontText type="body" weight="bold"
                        className="text-content-primary text-[10px] uppercase">
                        {phoneNumber}
                    </FontText>
                )}
            </View>
        </View>
    );
};
