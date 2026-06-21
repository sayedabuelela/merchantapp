import Button from '@/src/shared/components/Buttons/Button';
import { currencyNumber } from '@/src/core/utils/number-fields';
import FontText from '@/src/shared/components/FontText';
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/outline';
import type { InquiryBreakdown } from '../../domain/instant-settlement.models';

export interface ConfirmPayoutSheetRef {
    expand: () => void;
    close: () => void;
}

interface Props {
    inquiry: InquiryBreakdown | null;
    isRequesting: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const CURRENCY = 'EGP';

interface Row {
    label: string;
    value: number;
}

/**
 * Confirm sheet (gorhom) — replaces the hand-rolled InstantInquiryModal.
 * Rows are data-driven from the inquiry response (only fields present render).
 * Submit is guarded against double-tap via `isRequesting`.
 */
const ConfirmPayoutSheet = forwardRef<ConfirmPayoutSheetRef, Props>(
    ({ inquiry, isRequesting, onConfirm, onClose }, ref) => {
        const { t } = useTranslation();
        const sheetRef = useRef<BottomSheetModal | null>(null);

        useImperativeHandle(
            ref,
            () => ({
                expand: () => sheetRef.current?.present(),
                close: () => sheetRef.current?.dismiss(),
            }),
            [],
        );

        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.5}
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                />
            ),
            [],
        );

        const rows: Row[] = useMemo(() => {
            if (!inquiry) return [];
            const out: Row[] = [
                { label: 'Settlement amount', value: inquiry.totalSettlementAmount },
                { label: 'Instant sett. fees', value: inquiry.totalRateFees },
            ];
            if (inquiry.flatFees > 0) out.push({ label: 'Flat fees', value: inquiry.flatFees });
            out.push({ label: 'VAT', value: inquiry.vat });
            return out;
        }, [inquiry]);

        return (
            <BottomSheetModal
                ref={sheetRef}
                onDismiss={onClose}
                enableDynamicSizing
                enablePanDownToClose
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView className="px-6 pt-2 pb-8">
                    <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-4">
                        {t('Please confirm the details below')}
                    </FontText>

                    <View className="border border-stroke-main rounded-lg p-4">
                        {rows.map((row) => (
                            <View key={row.label} className="flex-row items-center justify-between py-2">
                                <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                                    {t(row.label)}
                                </FontText>
                                <FontText type="body" weight="semi" className="text-content-primary text-sm">
                                    {currencyNumber(row.value)} {t(CURRENCY)}
                                </FontText>
                            </View>
                        ))}

                        <View className="border-t border-stroke-main mt-2 pt-3 items-center">
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs uppercase mb-1">
                                {t('Total payout amount')}
                            </FontText>
                            <FontText type="head" weight="bold" className="text-content-primary text-lg">
                                {currencyNumber(inquiry?.netTransferAmount ?? 0)} {t(CURRENCY)}
                            </FontText>
                        </View>
                    </View>

                    <Button
                        title={t('Request payout')}
                        onPress={onConfirm}
                        isLoading={isRequesting}
                        disabled={isRequesting || !inquiry}
                        icon={<CheckIcon size={18} color="#FFFFFF" />}
                        className="flex-row gap-x-1 w-full mt-6"
                    />
                </BottomSheetView>
            </BottomSheetModal>
        );
    },
);

ConfirmPayoutSheet.displayName = 'ConfirmPayoutSheet';

export default ConfirmPayoutSheet;
