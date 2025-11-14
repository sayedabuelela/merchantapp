import {useTranslation} from 'react-i18next';
import {AmountDisplay} from '../detail';
import {OrderDetailPayment} from '../../payments.model';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionItem from '@/src/shared/components/details-screens/SectionItem';
import {PaymentMethodDetails} from "@/src/modules/payments/components/order-detail/PaymentMethodDetails";

interface OrderSummaryCardProps {
    order: OrderDetailPayment;
}

export const OrderSummaryCard = ({order}: OrderSummaryCardProps) => {
    const {t} = useTranslation();
    return (
        <>
            <AmountDisplay
                amount={order.amount}
                currency={order.currency}
                status={order.status}
                orderId={order.orderId}
            />
            <PaymentMethodDetails sourceOfFunds={order.sourceOfFunds} />
            <DetailsSection className="mt-4">
                <SectionItem title={t("Merchant order ID")} value={order.merchantOrderId}/>
                <SectionItem title={t("Network order ID")} value={order?.orderId}/>
                <SectionItem title={t("Origin")} value={order?.metaData?.kashierOriginDetails?.id}/>
            </DetailsSection>
        </>
    );
};
