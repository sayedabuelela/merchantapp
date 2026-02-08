import {useTranslation} from 'react-i18next';
import {AmountDisplay} from '../detail';
import {OrderDetailPayment} from '../../payments.model';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionItem from '@/src/shared/components/details-screens/SectionItem';
import {PaymentMethodDetails} from "@/src/modules/payments/components/order-detail/PaymentMethodDetails";
import SectionItemWithCopy from '@/src/shared/components/details-screens/SectionItemWithCopy';
import {getEffectiveOrderDetailStatus} from '../../utils/posStatus.utils';

interface OrderSummaryCardProps {
    order: OrderDetailPayment;
}

export const OrderSummaryCard = ({order}: OrderSummaryCardProps) => {
    const {t} = useTranslation();
    const effectiveStatus = getEffectiveOrderDetailStatus(order);
    console.log('OrderSummaryCard order.method : ',order.method);

    return (
        <>
            <AmountDisplay
                amount={order.amount}
                currency={order.currency}
                status={effectiveStatus}
                merchantOrderId={order.merchantOrderId}
            />
            <PaymentMethodDetails sourceOfFunds={order.sourceOfFunds} method={order.method} paymentChannel={order.paymentChannel} />
            <DetailsSection className="mt-4">
                <SectionItemWithCopy title={t("Merchant order ID")} value={order.merchantOrderId}/>
                <SectionItemWithCopy title={t("Kashier order ID")} value={order.orderId}/>
                <SectionItem title={t("Origin")} value={order.metaData?.kashierOriginDetails?.id}/>
            </DetailsSection>
        </>
    );
};
