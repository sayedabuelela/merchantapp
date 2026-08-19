import Button from '@/src/shared/components/Buttons/Button';
import { currencyNumber } from '@/src/core/utils/number-fields';
import AnimatedInfoMsg from '@/src/shared/components/animated-messages/AnimatedInfoMsg';
import FontText from '@/src/shared/components/FontText';
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/outline';
import { CheckBoxSquareEmptyIcon, CheckBoxSquareFilledIcon } from '@/src/shared/assets/svgs';
import type { InquiryBreakdown } from '../../domain/instant-settlement.models';

export interface ConfirmPayoutSheetRef {
    expand: () => void;
    close: () => void;
}

interface Props {
    inquiry: InquiryBreakdown | null;
    isRequesting: boolean;
    onConfirm: (declineTransactionOnPartialFailure: boolean) => void;
    onClose: () => void;
}

/** Portal default — the request is rejected rather than partially excluded. */
const DECLINE_ON_PARTIAL_FAILURE_DEFAULT = true;

const CURRENCY = 'EGP';

/**
 * The inquiry response carries computed fee AMOUNTS only — no rates. The portal
 * renders the rates from its fee config, which this path never fetches
 * (`feeConfigSnapshot` only exists on the request-details response), so the
 * displayed percentages are the standard config values.
 */
const INSTANT_FEE_RATE_PCT = 1;
const VAT_RATE_PCT = 14;

interface Row {
    label: string;
    value: number;
    /** deducted from the settlement amount — rendered with a leading minus */
    isDeduction?: boolean;
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
        const [declineOnPartialFailure, setDeclineOnPartialFailure] = useState(
            DECLINE_ON_PARTIAL_FAILURE_DEFAULT,
        );

        useImperativeHandle(
            ref,
            () => ({
                expand: () => {
                    // each payout starts from the default — the flag must not
                    // leak from a previous (possibly abandoned) confirmation.
                    setDeclineOnPartialFailure(DECLINE_ON_PARTIAL_FAILURE_DEFAULT);
                    sheetRef.current?.present();
                },
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
            return [
                { label: t('Gross settlement amount'), value: inquiry.totalSettlementAmount },
                {
                    label: `${t('Instant settlement fees')} (${INSTANT_FEE_RATE_PCT}%)`,
                    value: inquiry.totalRateFees,
                    isDeduction: true,
                },
                {
                    label: `${t('VAT')} (${VAT_RATE_PCT}%)`,
                    value: inquiry.vat,
                    isDeduction: true,
                },
                { label: t('ACH Fee'), value: inquiry.flatFees, isDeduction: true },
            ];
        }, [inquiry, t]);

        return (
            <BottomSheetModal
                ref={sheetRef}
                onDismiss={onClose}
                enableDynamicSizing
                enablePanDownToClose
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView className="px-6 pt-2 pb-8">
                    <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                        {t('Please review the details below before requesting your instant settlement.')}
                    </FontText>

                    <AnimatedInfoMsg
                        infoMsg={
                            <>
                                {t('fee_notice_prefix')}
                                <FontText weight="semi">
                                    {t('fee_notice_rate', { rate: INSTANT_FEE_RATE_PCT })}
                                </FontText>
                                {t('fee_notice_middle')}
                                <FontText weight="semi">
                                    {t('fee_notice_vat', { vat: VAT_RATE_PCT })}
                                </FontText>
                                {t('fee_notice_suffix')}
                            </>
                        }
                        className="mt-4 mb-4"
                    />

                    <View className="border border-stroke-main rounded-lg p-4">
                        {rows.map((row) => (
                            <View key={row.label} className="flex-row items-center justify-between py-2">
                                <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                                    {row.label}
                                </FontText>
                                <FontText type="body" weight="semi" className="text-content-primary text-sm">
                                    {row.isDeduction && row.value > 0 ? '- ' : ''}
                                    {currencyNumber(row.value)} {t(CURRENCY)}
                                </FontText>
                            </View>
                        ))}
                    </View>

                    <View className="border border-stroke-main rounded-lg p-4 mt-4 items-center">
                        <FontText type="body" weight="regular" className="text-content-secondary text-xs uppercase mb-1">
                            {t('Net payout amount')}
                        </FontText>
                        <FontText type="head" weight="bold" className="text-content-primary text-lg">
                            {currencyNumber(inquiry?.netTransferAmount ?? 0)} {t(CURRENCY)}
                        </FontText>
                    </View>

                    <Pressable
                        onPress={() => setDeclineOnPartialFailure((prev) => !prev)}
                        disabled={isRequesting}
                        className="border border-stroke-main rounded-lg p-4 mt-4 flex-row items-start gap-x-3"
                    >
                        {declineOnPartialFailure ? (
                            <CheckBoxSquareFilledIcon />
                        ) : (
                            <CheckBoxSquareEmptyIcon />
                        )}
                        <View className="flex-1">
                            <FontText type="body" weight="semi" className="text-content-primary text-sm">
                                {t('Reject Request if Any Transaction Is Excluded')}
                            </FontText>
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs mt-1">
                                {t('decline_on_partial_failure_hint')}
                            </FontText>
                        </View>
                    </Pressable>

                    <Button
                        title={t('Request payout')}
                        onPress={() => onConfirm(declineOnPartialFailure)}
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
