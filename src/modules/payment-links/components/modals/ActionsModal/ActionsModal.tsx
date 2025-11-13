import { useRouter, useSegments } from 'expo-router';
import { t } from 'i18next';
import { AnimatePresence, MotiView } from 'moti';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Bars3BottomLeftIcon, CheckCircleIcon, CheckIcon, PencilIcon, ShareIcon, TrashIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { KeyboardController } from 'react-native-keyboard-controller';

import FontText from '@/src/shared/components/FontText';
import ActionItem from './ActionItem';
import DeleteConfirmation from './DeleteConfirmation';
import MarkAsPaidConfirmation from './MarkAsPaidConfirmation';
import RejectConfirmation from './RejectConfirmation';
import ShareOptions from './ShareOptions';

import { formatRelativeDate } from '@/src/core/utils/dateUtils';
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store';
import usePermissions from '@/src/modules/auth/hooks/usePermissions';
import { ICountry } from '@/src/shared/hooks/useCountries';
import { PaymentLink } from '../../../payment-links.model';
import usePaymentLinkActionsVM from '../../../viewmodels/usePaymentLinkActionsVM';

type Mode = "actions" | "share" | "delete" | "reject" | "markAsPaid";

interface Props {
    isVisible: boolean;
    onClose: () => void;
    paymentLink: PaymentLink;
    countries: ICountry[] | undefined;
}

type ActionDescriptor = {
    key: string;
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    variant?: 'danger' | 'default';
};

// Memoized Actions List Component
const ActionsList = memo(function ActionsList({ items }: { items: ActionDescriptor[] }) {
    return (
        <>
            {items.map(item => (
                <ActionItem
                    key={item.key}
                    icon={item.icon}
                    title={item.title}
                    onPress={item.onPress}
                    variant={item.variant}
                />
            ))}
        </>
    );
});

const ModalHeader = memo(function ModalHeader({
    customerName,
    paymentLinkId,
    dueDate,
    mode,
    onClose
}: {
    customerName?: string;
    paymentLinkId?: string;
    dueDate?: string;
    mode: Mode;
    onClose: () => void;
}) {
    const getTitle = () => {
        if (!customerName) return '';
        if (mode === "actions") return customerName;
        switch (mode) {
            case "share": return t("Share Payment Link");
            case "delete": return t("Delete Payment Link");
            case "markAsPaid": return t("Mark as paid");
            case "reject": return t("Reject Payment Link");
            default: return '';
        }
    };

    return (
        <View className="flex-row justify-between items-center mb-4">
            <View>
                {customerName && (
                    <FontText type="head" weight="bold" className="text-content-hint text-xl mb-1">
                        {getTitle()}
                    </FontText>
                )}
                {paymentLinkId && (
                    <FontText type="body" weight="regular" className="text-light-gray text-xs">
                        {paymentLinkId} {dueDate && `• Due ${formatRelativeDate(dueDate)}`}
                    </FontText>
                )}
            </View>
            <TouchableOpacity
                onPress={onClose}
                className="items-center justify-center bg-[#F1F6FF] w-7 h-7 rounded-full"
            >
                <XMarkIcon size={18} color="#0F172A" />
            </TouchableOpacity>
        </View>
    );
});

// Separate action descriptors logic into a custom hook for better organization
const useActionDescriptors = (
    paymentLink: PaymentLink,
    permissions: any,
    handlers: any
) => {
    const {
        needApproval,
        paymentStatus,
        isChecker,
        state
    } = paymentLink;

    const {
        canEditPaymentRequests,
        canViewPaymentRequestDetails,
        canDeletePaymentRequests,
    } = permissions;

    const {
        handleNavigateDetails,
        handleEditPaymentLink,
        handleAction,
        setMode,
        isPaymentLinkDetails
    } = handlers;

    const approvedStatus = state !== "cancelled" && paymentStatus !== "paid" && paymentStatus !== "expired";
    const canDeleteStatus = state !== "cancelled" && paymentStatus !== "paid";

    return useMemo(() => {
        // Early returns for special cases
        if (needApproval) {
            if (canViewPaymentRequestDetails && !isPaymentLinkDetails) {
                return [{
                    key: 'details',
                    title: t("Details"),
                    icon: <Bars3BottomLeftIcon size={24} color="#001F5F" />,
                    onPress: handleNavigateDetails
                }];
            }
            return [];
        }

        if (paymentStatus === "rejected") {
            if (canDeletePaymentRequests && canDeleteStatus) {
                return [{
                    key: 'delete',
                    title: t("Delete"),
                    icon: <TrashIcon size={24} color="#001F5F" />,
                    onPress: () => setMode("delete"),
                    variant: 'danger' as const
                }];
            }
            return [];
        }

        if (isChecker && needApproval) {
            return [
                {
                    key: 'approve',
                    title: t("Approve"),
                    icon: <CheckIcon size={24} color="#001F5F" />,
                    onPress: () => handleAction("approve")
                },
                {
                    key: 'reject',
                    title: t("Reject"),
                    icon: <XMarkIcon size={24} color="#001F5F" />,
                    onPress: () => setMode("reject"),
                    variant: 'danger' as const
                }
            ];
        }

        // Build normal actions
        const items: ActionDescriptor[] = [];
        if (canViewPaymentRequestDetails && !isPaymentLinkDetails) {
            items.push({
                key: 'details',
                title: t("Details"),
                icon: <Bars3BottomLeftIcon size={24} color="#001F5F" />,
                onPress: handleNavigateDetails
            });
        }

        if (canEditPaymentRequests && approvedStatus) {
            items.push({
                key: 'edit',
                title: t("Edit"),
                icon: <PencilIcon size={24} color="#001F5F" />,
                onPress: handleEditPaymentLink
            });

            items.push({
                key: 'mark',
                title: t("Mark as paid"),
                icon: <CheckCircleIcon size={24} color="#001F5F" />,
                onPress: () => setMode("markAsPaid")
            });
        }

        if (canViewPaymentRequestDetails && approvedStatus) {
            items.push({
                key: 'share',
                title: t("Share"),
                icon: <ShareIcon size={24} color="#001F5F" />,
                onPress: () => setMode("share")
            });
        }

        if (canDeletePaymentRequests && canDeleteStatus) {
            items.push({
                key: 'delete',
                title: t("Delete"),
                icon: <TrashIcon size={24} color="#A50017" />,
                onPress: () => setMode("delete"),
                variant: 'danger' as const
            });
        }

        return items;
    }, [
        needApproval,
        paymentStatus,
        isChecker,
        state,
        canViewPaymentRequestDetails,
        canEditPaymentRequests,
        canDeletePaymentRequests,
        approvedStatus,
        canDeleteStatus,
        isPaymentLinkDetails
    ]);
};

const OptimizedActionsModal = ({ isVisible, onClose, paymentLink, countries }: Props) => {
    if (!paymentLink) return null;
    const segments = useSegments();
    const isPaymentLinkDetails = segments[1] === "[paymentLinkId]";
    // State management
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mode, setMode] = useState<Mode>("actions");
    const [rejectReason, setRejectReason] = useState<string>("");

    // Refs and hooks


    const router = useRouter();

    const {
        deleteMutation: { isPending: isDeleting, mutateAsync: deletePaymentLink },
        markAsPaidMutation: { isPending: isMarkingAsPaid, mutateAsync: markAsPaid }
    } = usePaymentLinkActionsVM();

    const user = useAuthStore(selectUser);
    const permissions = usePermissions(
        user?.actions!,
        user?.merchantId,
        paymentLink.createdByUserId
    );

    // Effect for animation
    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            // Use requestAnimationFrame for smoother animation start
            requestAnimationFrame(() => {
                setIsAnimating(true);
            });
        }
    }, [isVisible]);

    // Handlers
    const handleClose = useCallback(() => {
        setMode("actions");
        setIsAnimating(false);
    }, []);

    const handleNavigateDetails = useCallback(() => {
        router.push(`/payment-links/${paymentLink.paymentLinkId}`);
        handleClose();
    }, [router, paymentLink.paymentLinkId, handleClose]);

    const handleEditPaymentLink = useCallback(() => {
        router.push({
            pathname: "/payment-links/create-step1",
            params: {
                paymentType: paymentLink.paymentType,
                paymentLinkId: paymentLink.paymentLinkId
            },
        });
        handleClose();
    }, [router, paymentLink, handleClose]);

    const handleMarkAsPaid = useCallback(async () => {
        try {
            await markAsPaid({
                id: paymentLink.paymentLinkId,
                reference: paymentLink._id,
                amount: Number(paymentLink.totalAmount),
                currency: paymentLink.currency,
                customerName: paymentLink.customerName,
                createdUserId: paymentLink.createdByUserId
            });
        } catch (error) {
            console.error('Error marking payment link as paid:', error);
        } finally {
            handleClose();
        }
    }, [markAsPaid, paymentLink, handleClose]);

    const handleDeletePaymentLink = useCallback(async () => {
        try {
            await deletePaymentLink(paymentLink.paymentLinkId);
        } catch (error) {
            console.error('Error deleting payment link:', error);
        } finally {
            setMode("actions");
            handleClose();
        }
    }, [deletePaymentLink, paymentLink.paymentLinkId, handleClose]);

    const handleAction = useCallback(async (actionType: string, payload?: any) => {
        console.debug('handleAction', actionType, payload);
    }, []);

    // Get action descriptors
    const actionDescriptors = useActionDescriptors(
        paymentLink,
        permissions,
        { handleNavigateDetails, handleEditPaymentLink, handleAction, setMode, isPaymentLinkDetails }
    );

    // Render content based on mode
    const contentArea = useMemo(() => {
        switch (mode) {
            case "actions":
                return <ActionsList items={actionDescriptors} />;
            case "share":
                return <ShareOptions
                    paymentLinkId={paymentLink.paymentLinkId}
                    countries={countries}
                />;
            case "delete":
                return (
                    <DeleteConfirmation
                        onDelete={handleDeletePaymentLink}
                        onCancel={() => setMode("actions")}
                        isDeleting={isDeleting}
                    />
                );
            case "markAsPaid":
                return (
                    <MarkAsPaidConfirmation
                        onMarkAsPaid={handleMarkAsPaid}
                        onCancel={() => setMode("actions")}
                        isMarkingAsPaid={isMarkingAsPaid}
                    />
                );
            case "reject":
                return (
                    <RejectConfirmation
                        rejectReason={rejectReason}
                        setRejectReason={setRejectReason}
                        onReject={(reason) => handleAction("reject", reason)}
                        isLoading={false}
                    />
                );
            default:
                return null;
        }
    }, [mode, actionDescriptors, handleDeletePaymentLink, isDeleting, handleMarkAsPaid, isMarkingAsPaid, rejectReason, handleAction]);

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
                    setIsAnimating(false);
                    onClose();
                }}>
                    {isAnimating && (
                        <View className="flex-1 justify-end">
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    type: 'timing',
                                    duration: 200 // Reduced duration for opacity
                                }}
                                className="absolute inset-0 bg-content-secondary/30"
                            >
                                <Pressable style={{ flex: 1 }} onPress={handleClose} />
                            </MotiView>

                            <TouchableWithoutFeedback onPress={() => KeyboardController?.dismiss()}>
                                <MotiView
                                    from={{ translateY: 450 }}
                                    animate={{ translateY: 0 }}
                                    exit={{ translateY: 450 }}
                                    transition={{
                                        type: 'timing',
                                        duration: 400
                                    }}
                                    className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: -2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 5,
                                    }}
                                >
                                    <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-8" />

                                    <ModalHeader
                                        customerName={paymentLink.customerName}
                                        paymentLinkId={paymentLink.paymentLinkId}
                                        dueDate={paymentLink.dueDate}
                                        mode={mode}
                                        onClose={handleClose}
                                    />

                                    <View className="mb-6 gap-y-2">
                                        {contentArea}
                                    </View>
                                </MotiView>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </AnimatePresence>


            </KeyboardAvoidingView>
        </Modal>
    );
};

export default memo(OptimizedActionsModal);