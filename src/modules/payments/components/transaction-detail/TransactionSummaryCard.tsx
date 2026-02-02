import { useTranslation } from 'react-i18next';
import { AmountDisplay } from '../detail';
import { TransactionDetail } from '../../payments.model';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionItem from '@/src/shared/components/details-screens/SectionItem';
import { PaymentMethodDetails } from '../order-detail/PaymentMethodDetails';
import SectionItemWithCopy from '@/src/shared/components/details-screens/SectionItemWithCopy';
import { getEffectiveTransactionDetailStatus } from '../../utils/posStatus.utils';

interface TransactionSummaryCardProps {
    transaction: TransactionDetail;
}

/**
 * Main transaction summary card displaying key transaction information
 * Matches OrderSummaryCard style with AmountDisplay and PaymentMethodDetails
 */
export const TransactionSummaryCard = ({ transaction }: TransactionSummaryCardProps) => {
    const { t } = useTranslation();
    const effectiveStatus = getEffectiveTransactionDetailStatus(transaction);
    return (
        <>
            <AmountDisplay
                amount={transaction.amount}
                currency={transaction.currency}
                status={effectiveStatus}
                merchantOrderId={transaction.merchantOrderId}
            />
            <PaymentMethodDetails
                method={transaction.method}
                sourceOfFunds={transaction.sourceOfFunds}
                paymentChannel={transaction.paymentChannel}
            />
            <DetailsSection className="mt-4">
                <SectionItemWithCopy title={t('Merchant order ID')} value={transaction.merchantOrderId} />
                <SectionItemWithCopy
                    title={t('Kashier order ID')}
                    value={transaction.order?.orderId}
                />
                <SectionItem
                    title={t('Origin')}
                    value={transaction.metaData?.kashierOriginDetails?.id}
                />
            </DetailsSection>
        </>
    );
};

