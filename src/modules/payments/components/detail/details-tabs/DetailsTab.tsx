import { View } from "react-native";
import { OrderDetailPayment } from "@/src/modules/payments/payments.model";
import DetailsSection from "@/src/shared/components/details-screens/DetailsSection";
import { useTranslation } from "react-i18next";
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem";
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";

interface Props {
    order: OrderDetailPayment;
}

const DetailsTab = ({ order }: Props) => {
    const { t } = useTranslation();

    // Safe access to nested properties
    const latestHistoryStatus = order.history?.[0]?.status;
    const customerInfo = order.metaData?.kashierOriginDetails;
    const hasMoreData = !!(
        order.metaData?.kashierOriginType ||
        order.metaData?.termsAndConditions?.ip ||
        order.metaData?.['kashier payment UI version']
    );

    return (
        <View>
            <DetailsSection title={t('Recent transaction')}>
                <SectionRowItem
                    valueClassName="capitalize mr-[1px]"
                    title={t('Transaction type')}
                    value={order.lastTransactionType}
                />
                <SectionRowItem
                    title={t('Updated')}
                    value={`${formatRelativeDate(order.updatedAt)}, ${formatAMPM(order.updatedAt)}`}
                />
                <SectionRowItem
                    valueClassName="capitalize"
                    title={t('Status')}
                    value={latestHistoryStatus}
                />
                <SectionRowItem
                    title={t('Transaction ID')}
                    value={order.targetTransactionId}
                />
            </DetailsSection>

            {customerInfo && (
                <DetailsSection className="mt-4">
                    <SectionRowItem
                        title={t('Customer name')}
                        value={customerInfo.customerName}
                    />
                    <SectionRowItem
                        title={t('Phone')}
                        value={customerInfo.customerPhone}
                    />
                    <SectionRowItem
                        title={t('Email')}
                        value={customerInfo.customerEmail}
                    />
                    <SectionRowItem
                        title={t('Ref ID')}
                        value={customerInfo.id}
                    />
                </DetailsSection>
            )}

            {hasMoreData && (
                <DetailsSection title={t('More data')} className="mt-4">
                    <SectionRowItem
                        title={t('Kashier origin type')}
                        value={order.metaData?.kashierOriginType}
                    />
                    <SectionRowItem
                        title={t('IP address')}
                        value={order.metaData?.termsAndConditions?.ip}
                    />
                    <SectionRowItem
                        title={t('Kashier payment UI version')}
                        value={order.metaData?.['kashier payment UI version']}
                    />
                </DetailsSection>
            )}
        </View>
    )
}

export default DetailsTab;
