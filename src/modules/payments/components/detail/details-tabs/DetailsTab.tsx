import { View } from "react-native";
import { OrderDetailPayment } from "@/src/modules/payments/payments.model";
import DetailsSection from "@/src/shared/components/details-screens/DetailsSection";
import { useTranslation } from "react-i18next";
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem";
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";
import DetailsAccordionItem from "@/src/modules/onboarding/data/components/DetailsAccordionItem";

interface Props {
    order: OrderDetailPayment;
}

/**
 * Normalized customer information interface
 */
interface NormalizedCustomerInfo {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    reference?: string;
}

/**
 * Merges customer data from multiple sources (order.customer and order.metaData.kashierOriginDetails)
 * into a single normalized object. Prioritizes order.customer when both sources exist.
 *
 * @param order - The order detail payment object
 * @returns Normalized customer info or undefined if no customer data exists
 */
const getMergedCustomerInfo = (order: OrderDetailPayment): NormalizedCustomerInfo | undefined => {
    const directCustomer = order.customer;
    const originDetails = order.metaData?.kashierOriginDetails;

    // Return undefined if neither source has data
    if (!directCustomer && !originDetails) {
        return undefined;
    }

    // Build full name from available fields
    const buildFullName = (): string | undefined => {
        // Priority 1: Use name if available
        if (directCustomer?.name) return directCustomer.name;
        if (originDetails?.customerName) return originDetails.customerName;
        if (originDetails?.name) return originDetails.name;

        // Priority 2: Build from firstName + lastName
        if (directCustomer?.firstName || directCustomer?.lastName) {
            return [directCustomer.firstName, directCustomer.lastName]
                .filter(Boolean)
                .join(' ')
                .trim() || undefined;
        }

        return undefined;
    };

    // Merge both sources, with directCustomer taking priority
    return {
        id: directCustomer?.id || directCustomer?.reference || originDetails?.id,
        name: buildFullName(),
        email: directCustomer?.email || originDetails?.customerEmail,
        phone: directCustomer?.Phone || directCustomer?.mobilePhone || originDetails?.customerPhone,
        reference: directCustomer?.reference || originDetails?.id,
    };
};

const DetailsTab = ({ order }: Props) => {
    const { t } = useTranslation();

    // Safe access to nested properties
    const latestHistoryStatus = order.history?.[0]?.status;
    const customerInfo = getMergedCustomerInfo(order);
    const hasMoreData = !!(
        order.metaData?.kashierOriginType ||
        order.metaData?.termsAndConditions?.ip ||
        order.metaData?.['kashier payment UI version']
    );

    return (
        <View className='mt-4'>
            <DetailsSection title={t('Recent transaction')}>
                <SectionRowItem
                    valueClassName="capitalize mr-[1px]"
                    title={t('Transaction type')}
                    value={order.lastTransactionType === 'mogo_get_installment_plans' ? 'Mogo' : order.lastTransactionType}
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
                    value={order?.history?.[0]?.transactionId || '-'}
                />
            </DetailsSection>

            {customerInfo && (
                <DetailsSection className="mt-4">
                    <SectionRowItem
                        title={t('Customer name')}
                        value={customerInfo.name}
                    />
                    <SectionRowItem
                        title={t('Phone')}
                        value={customerInfo.phone}
                    />
                    <SectionRowItem
                        title={t('Email')}
                        value={customerInfo.email}
                    />
                    <SectionRowItem
                        title={t('Ref ID')}
                        value={customerInfo.id}
                    />
                </DetailsSection>
            )}

            {hasMoreData && (
                <DetailsAccordionItem
                    title={t('More data')}
                >
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
                </DetailsAccordionItem>
            )}
        </View>
    )
}

export default DetailsTab;
