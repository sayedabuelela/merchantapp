import { View } from 'react-native';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import { useTranslation } from 'react-i18next';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';
import DualAmount from '@/src/shared/components/currency/DualAmount';
import { SessionStatus } from '../../payments.model';
import IconBox from '@/src/shared/components/wrappers/IconBox';
import { ArrowSmallDownIcon, ArrowSmallUpIcon } from 'react-native-heroicons/outline';
import { Pressable } from 'react-native';
import { DocumentDuplicateIcon } from 'react-native-heroicons/outline';
import { PressableScale } from 'pressto';
import { useClipboard } from '@/src/shared/hooks/useClipboard';

interface AmountDisplayProps {
    amount: number;
    currency: string;
    merchantOrderId: string;
    status: SessionStatus | string;
    className?: string;
    // Currency conversion (virtual currencies) — dual display when present
    virtualAmount?: number | null;
    virtualCurrency?: string | null;
    amountPrimary?: 'egp' | 'virtual';
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
    virtualAmount,
    virtualCurrency,
    amountPrimary = 'egp',
}: AmountDisplayProps) => {

    const { t } = useTranslation();
    // Handle both order statuses (PAID) and transaction statuses (SUCCESS, APPROVED)
    // Also handle effective POS statuses (PENDING_ACK, REVERSED)
    const upperStatus = status?.toUpperCase();
    const isPaid = upperStatus === 'PAID' || upperStatus === 'SUCCESS' || upperStatus === 'APPROVED';
    const isPending = upperStatus === 'PENDING_ACK';
    const isNegative = upperStatus === 'REVERSED' || upperStatus === 'DECLINED' || upperStatus === 'FAILED';
    const { copy, isCopied } = useClipboard();
    const handleCopy = async () => {
        if (typeof merchantOrderId === 'string' && merchantOrderId !== "NA") {
            await copy(merchantOrderId)
        }
    }
    return (
        <View className={cn('gap-y-0.5 mb-4 mt-6', className)}>
            <View className="flex-row items-center gap-x-2">
                <DualAmount
                    amount={amount}
                    currency={currency}
                    virtualAmount={virtualAmount}
                    virtualCurrency={virtualCurrency}
                    primary={amountPrimary}
                    size="lg"
                />
                <View className="flex-row items-center gap-x-1">
                    <IconBox className={cn(
                        isPaid ? 'bg-[#D1FFD3] border border-[#AEFFB2]' :
                        isPending ? 'bg-[#FFF7E8] border border-[#F5D99A]' :
                        'bg-[#FFEAED] border border-[#FEE4E7]'
                    )}>
                        {isPaid ? (
                            <ArrowSmallDownIcon size={10} color={'#1A541D'} />
                        ) : isPending ? (
                            <ArrowSmallDownIcon size={10} color={'#B77801'} />
                        ) : (
                            <ArrowSmallUpIcon size={10} color={'#A50017'} />
                        )}
                    </IconBox>
                    <StatusBox status={status} />
                </View>
            </View>
            {merchantOrderId && merchantOrderId !== "NA" && (
                <View className="flex-row items-center gap-x-2">
                    <FontText type="body" weight="regular" className="text-content-secondary max-w-72 text-sm self-start"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {merchantOrderId}
                    </FontText>
                    <PressableScale onPress={handleCopy}>
                        <DocumentDuplicateIcon size={20} color={'#001F5F'} />
                    </PressableScale>
                </View>
            )}
        </View>
    );
};
