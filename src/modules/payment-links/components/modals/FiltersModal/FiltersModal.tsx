import { cn } from "@/src/core/utils/cn";
import { formatDateString } from "@/src/core/utils/dateUtils";
import { decimalNumber, formatInputCurrency } from "@/src/core/utils/number-fields";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import Input from "@/src/shared/components/inputs/Input";
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { AnimatePresence, MotiView } from "moti";
import { memo, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { KeyboardAvoidingView, KeyboardController } from "react-native-keyboard-controller";
import DateRangePickerBottomSheet, { DateRangePickerRef } from "../../../../../shared/components/bottom-sheets/date-range/DateRangePickerBottomSheet";
import { DateRangeSelector } from "../../../../../shared/components/bottom-sheets/date-range/DateRangeSelector";
import { FetchPaymentLinksParams } from "../../../payment-links.model";

interface FiltersModalProps {
  isVisible: boolean;
  onClose: () => void;
  filters: FetchPaymentLinksParams;
  setFilters: (filters: SetStateAction<FetchPaymentLinksParams>) => void;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface RangeState {
  from?: string;
  to?: string;
}

const FiltersModal = ({ isVisible, onClose, filters, setFilters }: FiltersModalProps) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [amount, setAmount] = useState<RangeState>({ from: undefined, to: undefined });
  const creationDateRef = useRef<DateRangePickerRef>(null);
  const dueDateRef = useRef<DateRangePickerRef>(null);

  const [creationDateRange, setCreationDateRange] = useState<DateRange | undefined>(undefined);
  const [dueDateRange, setDueDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      setIsAnimating(true);
      setCreationDateRange({
        from: filters.startDate ? new Date(filters.startDate) : undefined,
        to: filters.endDate ? new Date(filters.endDate) : undefined
      });
      setDueDateRange({
        from: filters.startDueDate ? new Date(filters.startDueDate) : undefined,
        to: filters.endDueDate ? new Date(filters.endDueDate) : undefined
      });
      setAmount({
        from: filters.startAmountRange?.toString(),
        to: filters.endAmountRange?.toString()
      });
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, filters]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    // Let the animation complete before calling onClose
    onClose();
    // setTimeout(() => {
    // }, 550);
  }, [onClose]);

  const handleSaveClick = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      startDate: creationDateRange?.from ? formatDateString(creationDateRange.from) : undefined,
      endDate: creationDateRange?.to ? formatDateString(creationDateRange.to) : undefined,
      startDueDate: dueDateRange?.from ? formatDateString(dueDateRange.from) : undefined,
      endDueDate: dueDateRange?.to ? formatDateString(dueDateRange.to) : undefined,
      startAmountRange: amount.from ? Number(amount.from) : undefined,
      endAmountRange: amount.to ? Number(amount.to) : undefined
    }));
    handleClose();
  }, [creationDateRange, dueDateRange, amount, setFilters, handleClose]);

  const handleClearAll = useCallback(() => {
    setCreationDateRange({ from: undefined, to: undefined });
    setDueDateRange({ from: undefined, to: undefined });
    setAmount({ from: undefined, to: undefined });
    setFilters(prev => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
      startDueDate: undefined,
      endDueDate: undefined,
      startAmountRange: undefined,
      endAmountRange: undefined
    }));
  }, [setFilters]);

  const handleAmountFromChange = useCallback((value: string) => {
    setAmount(prev => ({
      ...prev,
      from: decimalNumber(value).replace(/,/g, "")
    }));
  }, []);

  const handleAmountToChange = useCallback((value: string) => {
    setAmount(prev => ({
      ...prev,
      to: decimalNumber(value).replace(/,/g, "")
    }));
  }, []);

  const isDisabled = !creationDateRange?.from && !creationDateRange?.to &&
    !dueDateRange?.from && !dueDateRange?.to &&
    !amount.from && !amount.to;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <AnimatePresence onExitComplete={() => {
          setShowModal(false);
        }}>
          {isAnimating && (
            <View className="flex-1 justify-end">
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'timing', duration: 300 }}
                className="absolute inset-0 bg-content-secondary/30"
              >
                <Pressable style={{ flex: 1 }} onPress={handleClose} />
              </MotiView>

              <TouchableWithoutFeedback onPress={() => KeyboardController?.dismiss()}>
                <MotiView
                  from={{ translateY: 550 }}
                  animate={{ translateY: 0 }}
                  exit={{ translateY: 550 }}
                  transition={{
                    type: 'timing',
                    duration: 500,
                    // Add damping for smoother animation
                    // damping: 20,
                    // stiffness: 90
                  }}
                  className="bg-white w-full rounded-t-3xl pt-4 shadow-lg pb-12 px-6"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                >
                  <View className="w-8 h-[3px] bg-content-disabled rounded-full self-center mb-8" />

                  <View className="flex-row justify-between items-center mb-6">
                    <FontText type="head" weight="bold" className="text-content-primary text-xl">
                      {t('Filters')}
                    </FontText>
                    <TouchableOpacity
                      onPress={handleClose}
                      className="items-center justify-center bg-feedback-error-bg w-7 h-7 rounded-full"
                    >
                      <XMarkIcon size={18} color="#A50017" />
                    </TouchableOpacity>
                  </View>

                  {/* Amount Range */}
                  <View className="mb-6">
                    <FontText type="body" weight="semi" className={cn(COMMON_STYLES.label)}>
                      {t('Amount')}
                    </FontText>
                    <View className="flex-row items-center justify-between">
                      <Input
                        className="w-[47%]"
                        placeholder={t('From')}
                        onChangeText={handleAmountFromChange}
                        value={formatInputCurrency(amount.from)}
                        keyboardType="number-pad"
                      />
                      <Input
                        className="w-[47%]"
                        placeholder={t('To')}
                        onChangeText={handleAmountToChange}
                        value={formatInputCurrency(amount.to)}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  {/* Date Range Selectors */}
                  <DateRangeSelector
                    label={t('Creation Date')}
                    from={creationDateRange?.from}
                    to={creationDateRange?.to}
                    onPress={() => creationDateRef.current?.expand()}
                    t={t}
                  />

                  <DateRangeSelector
                    label={t('Due Date')}
                    from={dueDateRange?.from}
                    to={dueDateRange?.to}
                    onPress={() => dueDateRef.current?.expand()}
                    t={t}
                  />

                  {/* Action Buttons */}
                  <View className="mt-8">
                    <Button
                      disabled={isDisabled}
                      title={t('Apply Filters')}
                      onPress={handleSaveClick}
                    />
                    <Button
                      variant="outline"
                      title={t('Clear All')}
                      onPress={handleClearAll}
                      className="border-0 mt-4"
                      titleClasses="text-placeholder-color"
                    />
                  </View>
                </MotiView>
              </TouchableWithoutFeedback>

              <DateRangePickerBottomSheet
                ref={creationDateRef}
                title={t('Creation Date')}
                type="creationDate"
                savedRange={creationDateRange}
                onDateRangeSelected={(range) => setCreationDateRange(range)}
              />

              <DateRangePickerBottomSheet
                ref={dueDateRef}
                title={t('Due Date')}
                type="dueDate"
                savedRange={dueDateRange}
                onDateRangeSelected={(range) => setDueDateRange(range)}
              />
            </View>
          )}
        </AnimatePresence>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default memo(FiltersModal);