import { currencyLabel } from '@/src/core/constants/currencies';
import Button from '@/src/shared/components/Buttons/Button';
import { currencyNumber } from '@/src/core/utils/number-fields';
import FontText from '@/src/shared/components/FontText';
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetTextInput,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import InstantSheetHeader from './InstantSheetHeader';
import { useSuggestionsVM } from '../../viewmodels/useSuggestionsVM';
import type { SuggestionGroup } from '../../domain/instant-settlement.models';
import type { EligibleQueryParams } from '../../dto/instant-settlement.dto';

export interface CustomAmountSheetRef {
    expand: () => void;
    close: () => void;
}

interface Props {
    /** filter context forwarded as suggestion query params */
    params?: EligibleQueryParams;
    /** fired with the chosen suggestion's transaction set to drive inquiry+create */
    onConfirm: (transactionIds: string[]) => void;
    onClose: () => void;
}

const CURRENCY = 'EGP';
const QUICK_CHIPS = [10000, 20000, 50000, 100000];
const DEBOUNCE_MS = 400;

type SelectedSide = 'below' | 'above';

const SuggestionCard = ({
    label,
    group,
    selected,
    onPress,
}: {
    label: string;
    group: SuggestionGroup;
    selected: boolean;
    onPress: () => void;
}) => {
    const { t } = useTranslation();
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 border rounded-lg p-4 ${
                selected ? 'border-primary bg-surface-secondary' : 'border-stroke-main'
            }`}
        >
            <FontText type="body" weight="regular" className="text-content-secondary text-xxs uppercase mb-1">
                {t(label)}
            </FontText>
            <FontText type="body" weight="bold" className="text-content-primary text-sm mb-1">
                {currencyNumber(group.totalAmount)} {t(CURRENCY)}
            </FontText>
            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                {group.transactionsCount} {t('transactions')}
            </FontText>
        </Pressable>
    );
};

/**
 * Custom-amount sheet (gorhom). Input + quick chips + validation + suggestions.
 *
 * Suggestions come from the backend (POST /instant/suggestions). Selecting a
 * Below/Above set and confirming forwards its `transactionIds` to the parent,
 * which runs the normal inquiry → confirm → create flow.
 */
const CustomAmountSheet = forwardRef<CustomAmountSheetRef, Props>(
    ({ params, onConfirm, onClose }, ref) => {
        const { t } = useTranslation();
        const sheetRef = useRef<BottomSheetModal | null>(null);
        /** true only for a dismiss triggered by Confirm — see `handleDismiss` */
        const wasSubmittedRef = useRef(false);
        const [amountText, setAmountText] = useState('');
        const [selectedSide, setSelectedSide] = useState<SelectedSide | null>(null);

        const {
            fetchSuggestionsAsync,
            suggestions,
            isLoadingSuggestions,
            suggestionsError,
            resetSuggestions,
        } = useSuggestionsVM();

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

        const amount = useMemo(() => {
            const n = parseFloat(amountText.replace(/,/g, ''));
            return Number.isFinite(n) ? n : NaN;
        }, [amountText]);

        const isEmpty = amountText.trim() === '' || amount === 0;
        const isInvalid = !isEmpty && (Number.isNaN(amount) || amount < 0);
        const isValid = !isEmpty && !isInvalid;

        // selection is only meaningful for the currently-loaded suggestions
        useEffect(() => {
            setSelectedSide(null);
        }, [suggestions]);

        // debounced suggestions fetch on a valid amount
        useEffect(() => {
            if (!isValid) {
                resetSuggestions();
                return;
            }
            const handle = setTimeout(() => {
                fetchSuggestionsAsync({
                    targetAmount: amount,
                    channel: params?.channel,
                    method: params?.method,
                    dateFrom: params?.dateFrom,
                    dateTo: params?.dateTo,
                }).catch(() => {
                    // error toast handled by the VM
                });
            }, DEBOUNCE_MS);
            return () => clearTimeout(handle);
        }, [isValid, amount, params, fetchSuggestionsAsync, resetSuggestions]);

        const hasSuggestions = !!(suggestions?.below || suggestions?.above);

        const selectedGroup: SuggestionGroup | undefined =
            selectedSide === 'below'
                ? suggestions?.below
                : selectedSide === 'above'
                  ? suggestions?.above
                  : undefined;

        const handleConfirm = useCallback(() => {
            if (!selectedGroup?.transactionIds.length) return;
            wasSubmittedRef.current = true;
            onConfirm(selectedGroup.transactionIds);
            sheetRef.current?.dismiss();
        }, [selectedGroup, onConfirm]);

        /**
         * The sheet is hidden, not unmounted, so its state survives a dismiss.
         * Clear it on close — the amount is only carried over when the user
         * intentionally submitted it (Confirm), never when they backed out.
         */
        const handleDismiss = useCallback(() => {
            if (!wasSubmittedRef.current) {
                setAmountText('');
                setSelectedSide(null);
                resetSuggestions();
            }
            wasSubmittedRef.current = false;
            onClose();
        }, [resetSuggestions, onClose]);

        return (
            <BottomSheetModal
                ref={sheetRef}
                onDismiss={handleDismiss}
                enableDynamicSizing
                enablePanDownToClose
                keyboardBehavior="interactive"
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView className="px-6 pt-2 pb-8">
                    <InstantSheetHeader
                        title={t('Custom amount')}
                        onClose={() => sheetRef.current?.dismiss()}
                    />

                    <FontText type="body" weight="semi" className="text-content-primary text-sm mb-2">
                        {t('Amount to settle')}
                    </FontText>
                    <View className="flex-row items-center border border-stroke-main rounded-lg px-4 py-3">
                        <BottomSheetTextInput
                            value={amountText}
                            onChangeText={setAmountText}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#919C9C"
                            className="flex-1 text-content-primary text-base"
                        />
                        {/* Suffix inside the input box — short label, not the full name */}
                        <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                            {currencyLabel(t, CURRENCY)}
                        </FontText>
                    </View>

                    {/* quick chips */}
                    <View className="flex-row flex-wrap gap-2 mt-3">
                        {QUICK_CHIPS.map((chip) => (
                            <Pressable
                                key={chip}
                                onPress={() => setAmountText(String(chip))}
                                className="bg-surface-secondary border border-stroke-main rounded px-3 py-2"
                            >
                                <FontText type="body" weight="regular" className="text-primary text-xs">
                                    {chip.toLocaleString('en-US')}
                                </FontText>
                            </Pressable>
                        ))}
                    </View>

                    {isInvalid && (
                        <FontText type="body" weight="regular" className="text-[#A50017] text-xs mt-3">
                            {t('Please enter a valid amount')}
                        </FontText>
                    )}

                    {/* suggestions */}
                    {isValid && (
                        <View className="mt-5">
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs mb-2">
                                {t('Suggested transactions around your amount (oldest first):')}
                            </FontText>

                            {isLoadingSuggestions ? (
                                <View className="py-4 items-center">
                                    <ActivityIndicator color="#001F5F" />
                                </View>
                            ) : suggestionsError ? (
                                <FontText type="body" weight="regular" className="text-[#A50017] text-xs">
                                    {t('Could not load suggestions')}
                                </FontText>
                            ) : hasSuggestions ? (
                                <View className="flex-row gap-3">
                                    {suggestions?.below && (
                                        <SuggestionCard
                                            label="Lower"
                                            group={suggestions.below}
                                            selected={selectedSide === 'below'}
                                            onPress={() => setSelectedSide('below')}
                                        />
                                    )}
                                    {suggestions?.above && (
                                        <SuggestionCard
                                            label="Closest higher"
                                            group={suggestions.above}
                                            selected={selectedSide === 'above'}
                                            onPress={() => setSelectedSide('above')}
                                        />
                                    )}
                                </View>
                            ) : (
                                <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                                    {t('No suggestions found')}
                                </FontText>
                            )}
                        </View>
                    )}

                    {/* Confirm forwards the selected suggestion's transaction set
                        to the parent, which runs inquiry → confirm → create. */}
                    <Button
                        title={t('Confirm')}
                        onPress={handleConfirm}
                        disabled={!selectedGroup}
                        className="w-full mt-6"
                    />
                </BottomSheetView>
            </BottomSheetModal>
        );
    },
);

CustomAmountSheet.displayName = 'CustomAmountSheet';

export default CustomAmountSheet;
