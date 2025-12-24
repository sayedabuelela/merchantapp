import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { cn } from '@/src/core/utils/cn';
import { useTranslation } from 'react-i18next';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';
import { SessionStatus } from '../../payments.model';
import IconBox from '@/src/shared/components/wrappers/IconBox';
import { ArrowSmallDownIcon, ArrowSmallUpIcon } from 'react-native-heroicons/outline';

interface AmountDisplayProps {
    amount: number;
    currency: string;
    merchantOrderId: string;
    status: SessionStatus | string;
    className?: string;
}

/**
 * Formatted amount display with currency
 */
export const AmountDisplay = ({
    amount,
    currency,
    status,
    merchantOrderId,
    className,
}: AmountDisplayProps) => {

    const formattedAmount = currencyNumber(amount);
    const { t } = useTranslation();
    // Handle both order statuses (PAID) and transaction statuses (SUCCESS, APPROVED)
    const isPaid = status === 'PAID' || status === 'SUCCESS' || status === 'APPROVED';
    return (
        <View className={cn('gap-y-0.5 mb-4 mt-6', className)}>
            <View className="flex-row items-center gap-x-2">
                <FontText type="head" weight="bold"
                    className={cn("text-content-primary text-xl")}>
                    {formattedAmount} {t(currency)}
                </FontText>
                <View className="flex-row items-center gap-x-1">
                    <IconBox className={cn(isPaid ? 'bg-[#D1FFD3] border border-[#AEFFB2]' : 'bg-[#FFEAED] border border-[#FEE4E7]')}>
                        {isPaid ? (
                            <ArrowSmallDownIcon size={10} color={'#1A541D'} />
                        ) : (
                            <ArrowSmallUpIcon size={10} color={'#A50017'} />
                        )}
                    </IconBox>
                    <StatusBox status={status} />
                </View>
            </View>
            {merchantOrderId && merchantOrderId !== "NA" && (<FontText type="body" weight="regular" className="text-content-secondary text-sm self-start">
                {merchantOrderId}
            </FontText>)}
        </View>
    );
};
