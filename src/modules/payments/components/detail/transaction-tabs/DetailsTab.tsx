import { View } from 'react-native';
import { TransactionDetail } from '@/src/modules/payments/payments.model';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import { useTranslation } from 'react-i18next';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { formatAMPM, formatRelativeDate } from '@/src/core/utils/dateUtils';
import DetailsAccordionItem from '@/src/modules/onboarding/data/components/DetailsAccordionItem';

interface Props {
    transaction: TransactionDetail;
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
 * Merges customer data from multiple sources (transaction.customer and transaction.metaData.kashierOriginDetails)
 * into a single normalized object. Prioritizes transaction.customer when both sources exist.
 *
 * @param transaction - The transaction detail object
 * @returns Normalized customer info or undefined if no customer data exists
 */
const getMergedCustomerInfo = (transaction: TransactionDetail): NormalizedCustomerInfo | undefined => {
    const directCustomer = transaction.customer;
    const originDetails = transaction.metaData?.kashierOriginDetails;

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

const DetailsTab = ({ transaction }: Props) => {
    const { t } = useTranslation();

    // Safe access to nested properties
    const latestTransaction = transaction.transactions?.[transaction.transactions.length - 1];
    const customerInfo = getMergedCustomerInfo(transaction);
    const hasMoreData = !!(
        transaction.metaData?.kashierOriginType ||
        transaction.metaData?.termsAndConditions?.ip ||
        transaction.metaData?.['kashier payment UI version']
    );

    return (
        <View className='mt-4'>
            <DetailsSection title={t('Recent transaction')}>
                <SectionRowItem
                    valueClassName="capitalize mr-[1px]"
                    title={t('Transaction type')}
                    value={transaction.trxType}
                />
                <SectionRowItem
                    title={t('Updated')}
                    value={`${formatRelativeDate(transaction.date)}, ${formatAMPM(transaction.date)}`}
                />
                <SectionRowItem
                    valueClassName="capitalize"
                    title={t('Status')}
                    value={latestTransaction?.status || transaction.status}
                />
                <SectionRowItem
                    title={t('Transaction ID')}
                    value={transaction.transactionId}
                />
                {transaction.order?.orderReference && (
                    <SectionRowItem
                        title={t('Order Reference')}
                        value={transaction.order.orderReference}
                    />
                )}
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
                    <SectionRowItem title={t('Ref ID')} value={customerInfo.id} />
                </DetailsSection>
            )}

            {hasMoreData && (
                <DetailsAccordionItem
                    title={t('More data')}
                >
                    <SectionRowItem
                        title={t('Kashier origin type')}
                        value={transaction.metaData?.kashierOriginType}
                    />
                    <SectionRowItem
                        title={t('IP address')}
                        value={transaction.metaData?.termsAndConditions?.ip}
                    />
                    <SectionRowItem
                        title={t('Kashier payment UI version')}
                        value={transaction.metaData?.['kashier payment UI version']}
                    />
                </DetailsAccordionItem>
            )}
        </View>
    );
};

export default DetailsTab;
