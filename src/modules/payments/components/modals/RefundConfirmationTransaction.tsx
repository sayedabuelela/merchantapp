import React, { FC, useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import Button from '@/src/shared/components/Buttons/Button';
import { StatusBadge } from '../detail/StatusBadge';
import { formatRelativeDate, formatAMPM } from '@/src/core/utils/dateUtils';
import type { TransactionDetail } from '../../payments.model';
import { cn } from '@/src/core/utils/cn';
import Input from '@/src/shared/components/inputs/Input';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';
import { OtpInput } from '@/src/modules/auth/components/OtpInput';
import { useTransactionActionsVM } from '../../viewmodels/useTransactionActionsVM';

interface RefundConfirmationTransactionProps {
    transaction: TransactionDetail;
    onConfirm: (amount: number) => void;
    onCancel: () => void;
    isRefunding: boolean;
    transactionId: string;
}

const RefundConfirmationTransaction: FC<RefundConfirmationTransactionProps> = ({
    transaction,
    onConfirm,
    onCancel,
    isRefunding,
    transactionId,
}) => {
    const { t } = useTranslation();
    const [contactOtpContent, setContactOtpContent] = useState(false);
    const [otpValue, setOtpValue] = useState('');

    // Get OTP functions from viewmodel
    const {
        requestContactOtpAsync,
        isRequestingContactOtp,
        refundContactWithOtpAsync,
        isRefundingContactWithOtp,
    } = useTransactionActionsVM(transactionId);

    // Calculate max refundable amount
    const maxRefundableAmount = transaction.totalCapturedAmount - transaction.totalRefundedAmount;
    console.log('transaction method : ', transaction.method);
    // State for refund amount (default to full refund)
    const [refundAmount, setRefundAmount] = useState<string>(maxRefundableAmount.toString());
    const [error, setError] = useState<string | null>(null);

    // Update refund amount when transaction data changes (after partial refund)
    useEffect(() => {
        setRefundAmount(maxRefundableAmount.toString());
    }, [maxRefundableAmount]);

    // Validate refund amount
    useEffect(() => {
        const amount = parseFloat(refundAmount);

        if (isNaN(amount) || refundAmount.trim() === '') {
            setError(t('Please enter a valid amount'));
            return;
        }

        if (amount <= 0) {
            setError(t('Amount must be greater than 0'));
            return;
        }

        if (amount > maxRefundableAmount) {
            setError(t('Amount exceeds maximum refundable amount'));
            return;
        }

        setError(null);
    }, [refundAmount, maxRefundableAmount, t]);

    const isMethodContact = transaction.method?.toLowerCase() === 'contact';
    
    const handleConfirm = async () => {
        const amount = parseFloat(refundAmount);
        if (!error && !isNaN(amount) && amount > 0 && amount <= maxRefundableAmount) {
            if (isMethodContact && transaction.order?.orderId) {
                // Step 1: Request OTP for contact refund
                try {
                    await requestContactOtpAsync({ orderId: transaction.order.orderId });
                    setContactOtpContent(true);
                } catch (error) {
                    // Error toast is handled in viewmodel
                    console.error('Failed to request OTP:', error);
                }
            } else {
                onConfirm(amount);
            }
        }
    };

    const handleOtpComplete = async (code: string) => {
        setOtpValue(code);
        const amount = parseFloat(refundAmount);
        if (!error && !isNaN(amount) && amount > 0 && amount <= maxRefundableAmount && transaction.order?.orderId) {
            try {
                // Step 2: Refund with OTP
                // Only include amount for partial refunds
                await refundContactWithOtpAsync({
                    orderId: transaction.order.orderId,
                    otp: code,
                    amount: amount < maxRefundableAmount ? amount : undefined,
                });
                // Success - modal will be closed by parent component
                onCancel(); // Close modal on success
            } catch (error) {
                // Error toast is handled in viewmodel
                console.error('Failed to refund with OTP:', error);
                // Reset OTP on error to allow retry
                setOtpValue('');
            }
        }
    };

    const handleOtpChange = (value: string) => {
        setOtpValue(value);
    };

    const isConfirmDisabled = 
        !!error || 
        isRefunding || 
        !refundAmount ||
        (contactOtpContent && (!otpValue || otpValue.length !== 5)) ||
        isRequestingContactOtp ||
        isRefundingContactWithOtp;

    return (
        <View>
            {/* Transaction Summary */}
            <View className="mb-4">
                {/* Amount and Status */}
                <View className="flex-row items-center gap-x-2 mb-2">
                    <FontText type="head" weight="bold" className="text-content-primary text-xl">
                    {transaction.amount} {transaction.currency}
                    </FontText>
                    <StatusBox status={transaction.status} />
                </View>

                {/* Date and Time */}
                <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-1">
                    {formatRelativeDate(transaction.date, false)} {formatAMPM(transaction.date)}
                </FontText>

                {/* Transaction ID */}
                <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-1">
                    TX: {transaction.transactionId}
                </FontText>

                {/* Order ID */}
                {transaction.merchantOrderId && (
                    <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                        {transaction.merchantOrderId}
                    </FontText>
                )}
            </View>

            {/* Confirmation Message */}
            <FontText type="body" weight="regular" className="text-content-secondary text-base mb-4">
                {t("Are you sure you want to refund this transaction?")}
            </FontText>

            {/* Refund Amount Input */}
            {contactOtpContent ? (
                <View className="mb-6">
                    <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-2">
                        {t('Please enter the OTP sent to your phone')}
                    </FontText>
                    <OtpInput
                        length={5}
                        value={otpValue}
                        onChange={handleOtpChange}
                        onComplete={handleOtpComplete}
                        autoFocus={true}
                        disabled={isRefundingContactWithOtp}
                        digitSize={55}
                        digitMargin={10}
                    />
                    {error && (
                        <FontText type="body" weight="regular" className="text-feedback-error text-xs mt-1">
                            {error}
                        </FontText>
                    )}
                </View>
            ) : (
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <FontText type="body" weight="medium" className="text-content-primary text-sm">
                            {t('Refund Amount')}
                        </FontText>
                        <FontText type="body" weight="regular" className="text-content-tertiary text-xs">
                            {t('Max')}: {maxRefundableAmount} {transaction.currency}
                        </FontText>
                    </View>
                    <Input
                        value={refundAmount}
                        onChangeText={setRefundAmount}
                        keyboardType="decimal-pad"
                        placeholder={t('Enter amount')}
                        placeholderTextColor="#94A3B8"
                        className="text-content-primary text-base"
                        error={!!error}
                        editable={!isRefunding}
                    />

                    {error && (
                        <FontText type="body" weight="regular" className="text-feedback-error text-xs mt-1">
                            {error}
                        </FontText>
                    )}
                </View>
            )}

            {/* Action Buttons */}
            <View className="gap-y-4">
                <Button
                    disabled={isConfirmDisabled}
                    isLoading={isRefunding || isRequestingContactOtp || isRefundingContactWithOtp}
                    title={contactOtpContent ? t('Confirm Refund') : t('Confirm refund')}
                    variant="danger"
                    onPress={contactOtpContent ? () => handleOtpComplete(otpValue) : handleConfirm}
                />
                <Button
                    className="border-0"
                    title={t('Cancel')}
                    variant="outline"
                    onPress={() => {
                        setContactOtpContent(false);
                        setOtpValue('');
                        onCancel();
                    }}
                    disabled={isRefunding || isRequestingContactOtp || isRefundingContactWithOtp}
                />
            </View>
        </View>
    );
};

export default RefundConfirmationTransaction;
