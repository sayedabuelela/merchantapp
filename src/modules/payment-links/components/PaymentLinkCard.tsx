import { formatRelativeDate } from '@/src/core/utils/dateUtils'
import RecordCard, { RecordChip } from '@/src/shared/components/cards/RecordCard'
import DualAmount from '@/src/shared/components/currency/DualAmount'
import { Link } from 'expo-router'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PaymentLink } from '../payment-links.model'
import StatusBox from './StatusBox'
import DeliveryStatusBox from './DeliveryStatusBox'
import { PressableScale } from 'pressto'
import { selectUser, useAuthStore } from '@/src/modules/auth/auth.store'
import usePermissions from '@/src/modules/auth/hooks/usePermissions'

interface Props {
    paymentLink: PaymentLink;
    onOpenActions: (paymentLink: PaymentLink) => void;
    // Which amount leads for virtual-origin links: 'virtual' in a virtual-currency view, 'egp' in the EGP view
    amountPrimary?: 'egp' | 'virtual';
}

const PaymentLinkCard = ({
    paymentLink,
    onOpenActions,
    amountPrimary = 'egp'
}: Props) => {
    const { t } = useTranslation();
    const { customerName, paymentLinkId, dueDate, paymentType, paymentStatus, createdByUserId, totalAmount, currency, virtualAmount, virtualCurrency, invoiceReferenceId, invoiceItems, lastShareStatus } = paymentLink;

    // Permission checks
    const user = useAuthStore(selectUser);
    const {
        canViewPaymentLinkDetails,
        canEditPaymentLink,
        canDeletePaymentLink,
        canCancelPaymentLink
    } = usePermissions(
        user?.actions || {},
        user?.merchantId,
        createdByUserId
    );

    // Check if user has ANY action permissions (for ActionsModal)
    const hasAnyActionPermission =
        canEditPaymentLink ||
        canDeletePaymentLink ||
        canCancelPaymentLink ||
        canViewPaymentLinkDetails;

    // Only allow long press if there are available actions
    const handleLongPress = useCallback(() => {
        if (hasAnyActionPermission) {
            onOpenActions(paymentLink);
        }
    }, [hasAnyActionPermission, onOpenActions, paymentLink]);

    const hasShareStatus = !!(lastShareStatus?.email.status || lastShareStatus?.sms.status);

    // Built up front so an all-empty row never reserves space
    const chips = [
        { value: paymentLinkId, uppercase: true },
        paymentType === "professional" && invoiceItems.length > 0
            ? {
                value: `${invoiceItems.length} ${t(invoiceItems.length <= 1 ? "Item" : "Items")}`,
                uppercase: false,
            }
            : { value: undefined, uppercase: false },
        { value: invoiceReferenceId, uppercase: false },
    ].filter((c) => !!c.value);

    // Card content
    const cardContent = (
        <PressableScale onLongPress={handleLongPress}>
            <RecordCard
                title={customerName}
                subtitle={dueDate ? `${t("Due")} ${t(formatRelativeDate(dueDate))}` : undefined}
                chips={chips.length ? (
                    <>
                        {chips.map((chip) => (
                            <RecordChip key={chip.value} uppercase={chip.uppercase}>
                                {chip.value}
                            </RecordChip>
                        ))}
                    </>
                ) : undefined}
                amount={
                    <DualAmount
                        amount={totalAmount}
                        currency={currency}
                        virtualAmount={virtualAmount}
                        virtualCurrency={virtualCurrency}
                        primary={amountPrimary}
                        size="sm"
                        className="items-end"
                    />
                }
                status={<StatusBox status={paymentStatus} />}
                // Delivery chips are self-contained pills, so no rule above them
                metaDivider={false}
                meta={hasShareStatus ? (
                    <>
                        {lastShareStatus?.email.status && (
                            <DeliveryStatusBox delivery_status={lastShareStatus.email.status} type="email" />
                        )}
                        {lastShareStatus?.sms.status && (
                            <DeliveryStatusBox delivery_status={lastShareStatus.sms.status} type="sms" />
                        )}
                    </>
                ) : null}
            />
        </PressableScale>
    );

    // Only wrap with Link if user can view details
    if (!canViewPaymentLinkDetails) {
        return cardContent;
    }

    return (
        <Link href={`/payment-links/${paymentLinkId}`} asChild>
            {cardContent}
        </Link>
    );
}

export default memo(PaymentLinkCard);
