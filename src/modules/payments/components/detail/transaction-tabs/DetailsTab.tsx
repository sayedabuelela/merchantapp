import { View } from 'react-native';
import { TransactionDetail } from '@/src/modules/payments/payments.model';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import { useTranslation } from 'react-i18next';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
import { formatAMPM, formatRelativeDate } from '@/src/core/utils/dateUtils';

interface Props {
    transaction: TransactionDetail;
}

const DetailsTab = ({ transaction }: Props) => {
    const { t } = useTranslation();

    // Safe access to nested properties
    const latestTransaction = transaction.transactions?.[transaction.transactions.length - 1];
    const customerInfo = transaction.metaData?.kashierOriginDetails;
    const hasMoreData = !!(
        transaction.metaData?.kashierOriginType ||
        transaction.metaData?.termsAndConditions?.ip ||
        transaction.metaData?.['kashier payment UI version']
    );

    return (
        <View>
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
                    <SectionRowItem title={t('Ref ID')} value={customerInfo.id} />
                </DetailsSection>
            )}

            {hasMoreData && (
                <DetailsSection title={t('More data')} className="mt-4">
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
                </DetailsSection>
            )}
        </View>
    );
};

export default DetailsTab;
