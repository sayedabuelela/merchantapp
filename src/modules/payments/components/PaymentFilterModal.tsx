import { formatDateString } from "@/src/core/utils/dateUtils";
import DateRangePickerBottomSheet, { DateRangePickerRef } from "@/src/shared/components/bottom-sheets/date-range/DateRangePickerBottomSheet";
import { DateRangeSelector } from "@/src/shared/components/bottom-sheets/date-range/DateRangeSelector";
import Button from "@/src/shared/components/Buttons/Button";
import GeneralModalHeader from "@/src/shared/components/GeneralModal/GeneralModalHeader";
import { AnimatePresence, MotiView } from "moti";
import { memo, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import { FetchSessionsParams, FetchTransactionsParams } from "../payments.model";
import DropDownUI from "@/src/shared/components/dropdown/DropDownUI";
import {
    BuildingStorefrontIcon,
    CheckCircleIcon,
    CreditCardIcon,
    CubeTransparentIcon,
    TagIcon
} from "react-native-heroicons/outline";
import { useApi } from "@/src/core/api/clients.hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchBranches, fetchDiscounts } from "../payments.services";

interface PaymentFilterModalProps {
    isVisible: boolean;
    onClose: () => void;
    filters: FetchSessionsParams | FetchTransactionsParams;
    setFilters: (filters: SetStateAction<FetchSessionsParams | FetchTransactionsParams>) => void;
    currentTab: "sessions" | "transactions";
}

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

const PaymentFilterModal = ({ isVisible, onClose, filters, setFilters, currentTab }: PaymentFilterModalProps) => {
    const { t } = useTranslation();
    const { api } = useApi();

    const isOrdersTab = currentTab === "sessions";
    const isTransactionsTab = currentTab === "transactions";

    const [showModal, setShowModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Shared filters
    const [paymentDate, setPaymentDate] = useState<DateRange | undefined>(undefined);
    const [channel, setChannel] = useState<string | null | undefined>(null);
    const [status, setStatus] = useState<string | null | undefined>(null);
    const [method, setMethod] = useState<string | null | undefined>(null);

    // Orders only
    const [origin, setOrigin] = useState<string | null | undefined>(null);
    const [branchName, setBranchName] = useState<string | null | undefined>(null);

    // Transactions only
    const [transactionType, setTransactionType] = useState<string | null | undefined>(null);
    const [discount, setDiscount] = useState<string | null | undefined>(null);
    const [posBranch, setPosBranch] = useState<string | null | undefined>(null);

    const paymentDateRef = useRef<DateRangePickerRef>(null);

    // Fetch discounts (only for transactions)
    const { data: discountsData } = useQuery({
        queryKey: ['discounts'],
        queryFn: () => fetchDiscounts(api),
        enabled: isTransactionsTab,
        staleTime: 10 * 60 * 1000,
    });

    // Fetch branches
    const { data: branchesData } = useQuery({
        queryKey: ['pos-branches'],
        queryFn: () => fetchBranches(api),
        staleTime: 10 * 60 * 1000,
    });

    // Channel options (shared)
    const channelOptions = [
        { label: t('All channels'), value: null as string | null },
        { label: t('Online'), value: 'online' },
        { label: t('POS'), value: 'pos' },
        { label: t('E-commerce'), value: 'ECOMMERCE' },
    ];

    // Payment method options (shared between orders and transactions)
    const paymentMethodOptions = [
        { label: t('all'), value: null as string | null },
        { label: t('Card'), value: 'Card' },
        { label: t('Wallet'), value: 'Wallet' },
        { label: t('Valu'), value: 'Valu' },
        { label: t('Cash'), value: 'Cash' },
        { label: t('OCTO'), value: 'OCTO' },
        { label: t('Souhoola'), value: 'Souhoola' },
        { label: t('Contact'), value: 'Contact' },
        { label: t('Basata'), value: 'Basata' },
        { label: t('Aman'), value: 'Aman' },
        { label: t('Instapay'), value: 'Instapay' },
    ];

    // Status options (different per tab)
    const orderStatusOptions = [
        { label: t('All'), value: null as string | null },
        { label: t('CREATE'), value: 'CREATE' },
        { label: t('OPENED'), value: 'OPENED' },
        { label: t('PENDING'), value: 'PENDING' },
        { label: t('PAID'), value: 'PAID' },
        { label: t('FAILED'), value: 'FAILED' },
        { label: t('EXPIRED'), value: 'EXPIRED' },
        { label: t('AUTHORIZED'), value: 'AUTHORIZED' },
        { label: t('REFUNDED'), value: 'REFUNDED' },
        { label: t('PARTIALLY REFUND'), value: 'PARTIALLY REFUND' },
        { label: t('REFUND PENDING'), value: 'REFUND PENDING' },
        { label: t('VOIDED'), value: 'VOIDED' },
        { label: t('REVERSED'), value: 'REVERSED' },
        { label: t('REJECTED'), value: 'REJECTED' },
        { label: t('ABANDONED'), value: 'ABANDONED' },
    ];

    const transactionStatusOptions = [
        { label: t('all'), value: null as string | null },
        { label: t('Approved'), value: 'Approved' },
        { label: t('Rejected'), value: 'Rejected' },
        { label: t('Unknown'), value: 'Unknown' },
    ];

    // Payment source options (orders only)
    const paymentSourceOptions = [
        { label: t('All'), value: null as string | null },
        { label: t('Payment Link'), value: 'Payment Link' },
        { label: t('Payment Page'), value: 'Payment Page' },
        { label: t('Product Page'), value: 'Product Page' },
        { label: t('integration'), value: 'integration' },
    ];

    // Transaction type options (transactions only)
    const transactionTypeOptions = [
        { label: t('All types'), value: null as string | null },
        { label: t('Payment'), value: 'PAYMENT' },
        { label: t('Refund'), value: 'REFUND' },
        { label: t('Reversal'), value: 'REVERSAL' },
    ];

    // Branch options (shared between orders and transactions)
    const branchOptions = [
        { label: t('All branches'), value: null as string | null },
        ...(branchesData?.data || []).map(branch => ({
            label: branch._id,
            value: branch._id
        }))
    ];

    // Discount options (transactions only)
    const discountOptions = [
        { label: t('All discounts'), value: null as string | null },
        ...(discountsData?.data || []).map(discount => ({
            label: discount,
            value: discount
        }))
    ];

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            setIsAnimating(true);

            if (isOrdersTab) {
                const ordersFilters = filters as FetchSessionsParams;
                setPaymentDate({
                    from: ordersFilters.dateFrom ? new Date(ordersFilters.dateFrom) : undefined,
                    to: ordersFilters.dateTo ? new Date(ordersFilters.dateTo) : undefined
                });
                setChannel(ordersFilters.channel ?? null);
                setStatus(ordersFilters.status ?? null);
                setMethod(ordersFilters.method ?? null);
                setOrigin(ordersFilters.origin ?? null);
                setBranchName(ordersFilters.branchName ?? null);
            } else {
                const transFilters = filters as FetchTransactionsParams;
                setPaymentDate({
                    from: transFilters.startDate ? new Date(transFilters.startDate) : undefined,
                    to: transFilters.endDate ? new Date(transFilters.endDate) : undefined
                });
                setChannel(transFilters.channel ?? null);
                setStatus(transFilters.status ?? null);
                setMethod(transFilters.method ?? null);
                setTransactionType(transFilters.type ?? null);
                setDiscount(transFilters.discount ?? null);
                setPosBranch(transFilters.posBranch ?? null);
            }
        } else {
            setIsAnimating(false);
        }
    }, [isVisible, filters, isOrdersTab]);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        onClose();
    }, [onClose]);

    const handleSaveClick = useCallback(() => {
        if (isOrdersTab) {
            setFilters(prev => ({
                ...prev,
                dateFrom: paymentDate?.from ? formatDateString(paymentDate.from) : undefined,
                dateTo: paymentDate?.to ? formatDateString(paymentDate.to) : undefined,
                channel: channel === null ? undefined : channel,
                status: status === null ? undefined : status,
                method: method === null ? undefined : method,
                origin: origin === null ? undefined : origin,
                branchName: branchName === null ? undefined : branchName,
            } as FetchSessionsParams));
        } else {
            setFilters(prev => ({
                ...prev,
                startDate: paymentDate?.from ? paymentDate.from.toISOString() : undefined,
                endDate: paymentDate?.to ? paymentDate.to.toISOString() : undefined,
                channel: channel === null ? undefined : channel,
                status: status === null ? undefined : status,
                method: method === null ? undefined : method,
                type: transactionType === null ? undefined : transactionType,
                discount: discount === null ? undefined : discount,
                posBranch: posBranch === null ? undefined : posBranch,
            } as FetchTransactionsParams));
        }
        handleClose();
    }, [
        paymentDate, channel, status, method, origin, branchName,
        transactionType, discount, posBranch, isOrdersTab, setFilters, handleClose
    ]);

    const handleClearAll = useCallback(() => {
        setPaymentDate({ from: undefined, to: undefined });
        setChannel(null);
        setStatus(null);
        setMethod(null);
        setOrigin(null);
        setBranchName(null);
        setTransactionType(null);
        setDiscount(null);
        setPosBranch(null);

        if (isOrdersTab) {
            setFilters(prev => ({
                ...prev,
                dateFrom: undefined,
                dateTo: undefined,
                channel: undefined,
                status: undefined,
                method: undefined,
                origin: undefined,
                branchName: undefined,
            } as FetchSessionsParams));
        } else {
            setFilters(prev => ({
                ...prev,
                startDate: undefined,
                endDate: undefined,
                channel: undefined,
                status: undefined,
                method: undefined,
                type: undefined,
                discount: undefined,
                posBranch: undefined,
            } as FetchTransactionsParams));
        }
    }, [isOrdersTab, setFilters]);

    const isDisabled = !paymentDate?.from && !paymentDate?.to &&
        (channel === null || channel === undefined) &&
        (status === null || status === undefined) &&
        (method === null || method === undefined) &&
        (branchName === null || branchName === undefined) &&
        (posBranch === null || posBranch === undefined) &&
        (isOrdersTab ?
            (origin === null || origin === undefined) :
            ((transactionType === null || transactionType === undefined) &&
             (discount === null || discount === undefined))
        );

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
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
                                <GeneralModalHeader
                                    title={t('Filters')}
                                    onClose={handleClose}
                                />

                                {/* Payment Date Range */}
                                <DateRangeSelector
                                    label={t('Payment date')}
                                    from={paymentDate?.from}
                                    to={paymentDate?.to}
                                    onPress={() => paymentDateRef.current?.expand()}
                                    t={t}
                                />

                                {/* Channel Dropdown */}
                                <DropDownUI
                                    options={channelOptions}
                                    selected={channel}
                                    onChange={setChannel}
                                    label={t('Channel')}
                                    icon={<CubeTransparentIcon size={24} color="#556767" />}
                                    placeholder={t('Channel')}
                                    dropdownKey="channel"
                                    variant="filter"
                                />

                                {/* Status Dropdown */}
                                <DropDownUI
                                    options={isOrdersTab ? orderStatusOptions : transactionStatusOptions}
                                    selected={status}
                                    onChange={setStatus}
                                    label={t('Status')}
                                    icon={<CheckCircleIcon size={24} color="#556767" />}
                                    placeholder={t('Status')}
                                    dropdownKey="status"
                                    variant="filter"
                                />

                                {/* Payment Method Dropdown */}
                                <DropDownUI
                                    options={paymentMethodOptions}
                                    selected={method}
                                    onChange={setMethod}
                                    label={t('Payment method')}
                                    icon={<CreditCardIcon size={24} color="#556767" />}
                                    placeholder={t('Payment method')}
                                    dropdownKey="method"
                                    variant="filter"
                                />

                                {/* Branches Dropdown (Shared) */}
                                <DropDownUI
                                    options={branchOptions}
                                    selected={isOrdersTab ? branchName : posBranch}
                                    onChange={isOrdersTab ? setBranchName : setPosBranch}
                                    label={t('Branch')}
                                    icon={<BuildingStorefrontIcon size={24} color="#556767" />}
                                    placeholder={t('Branch')}
                                    dropdownKey="branch"
                                    variant="filter"
                                />

                                {/* Orders Only Filters */}
                                {isOrdersTab && (
                                    <DropDownUI
                                        options={paymentSourceOptions}
                                        selected={origin}
                                        onChange={setOrigin}
                                        label={t('Payment source')}
                                        icon={<TagIcon size={24} color="#556767" />}
                                        placeholder={t('Payment source')}
                                        dropdownKey="paymentSource"
                                        variant="filter"
                                    />
                                )}

                                {/* Transactions Only Filters */}
                                {isTransactionsTab && (
                                    <>
                                        <DropDownUI
                                            options={transactionTypeOptions}
                                            selected={transactionType}
                                            onChange={setTransactionType}
                                            label={t('Transaction type')}
                                            icon={<TagIcon size={24} color="#556767" />}
                                            placeholder={t('Transaction type')}
                                            dropdownKey="transactionType"
                                            variant="filter"
                                        />

                                        <DropDownUI
                                            options={discountOptions}
                                            selected={discount}
                                            onChange={setDiscount}
                                            label={t('Discount')}
                                            icon={<TagIcon size={24} color="#556767" />}
                                            placeholder={t('Discount')}
                                            dropdownKey="discount"
                                            variant="filter"
                                        />
                                    </>
                                )}

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
                            ref={paymentDateRef}
                            title={t('Payment Date')}
                            type="paymentDate"
                            savedRange={paymentDate}
                            onDateRangeSelected={(range) => setPaymentDate(range)}
                        />
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default memo(PaymentFilterModal);
