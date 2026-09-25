import { useTranslation } from 'react-i18next';
import { AmountDisplay } from '../detail';
import { TransactionDetail } from '../../payments.model';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionItem from '@/src/shared/components/details-screens/SectionItem';
import { PaymentMethodDetails } from '../order-detail/PaymentMethodDetails';
import SectionItemWithCopy from '@/src/shared/components/details-screens/SectionItemWithCopy';
import { getEffectiveTransactionDetailStatus } from '../../utils/posStatus.utils';
import useSelectedCurrency from '@/src/shared/hooks/useSelectedCurrency';
import useCurrencyConversionEnabled from '@/src/shared/hooks/useCurrencyConversionEnabled';
import { toDisplayCode } from '@/src/core/constants/currencies';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { formatRelativeDate, formatTime } from '@/src/core/utils/dateUtils';

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
    const { isVirtual: isVirtualView } = useSelectedCurrency();
    const isCurrencyConversionEnabled = useCurrencyConversionEnabled();
    // Transactions nest the conversion payload under `order`
    const virtual = transaction.order?.virtualTransaction;
    // Rate captured at payment time (backend-provided) — never recalculated client-side
    const showCapturedRate = isCurrencyConversionEnabled
        && virtual?.virtualCurrency != null
        && virtual?.virtualExchangeRate != null;
    return (
        <>
            <AmountDisplay
                amount={transaction.amount}
                currency={transaction.currency}
                status={effectiveStatus}
                merchantOrderId={transaction.merchantOrderId}
                virtualAmount={virtual?.virtualAmount}
                virtualCurrency={virtual?.virtualCurrency}
                amountPrimary={isVirtualView ? 'virtual' : 'egp'}
            />
            <PaymentMethodDetails
                method={transaction.method}
                sourceOfFunds={transaction.sourceOfFunds}
                paymentChannel={transaction.paymentChannel}
            />
            <DetailsSection className="mt-4 gap-y-4">
                <SectionItemWithCopy title={t('Merchant order ID')} value={transaction.merchantOrderId} />
                <SectionItemWithCopy
                    title={t('Kashier order ID')}
                    value={transaction.order?.orderId}
                />
                <SectionItem
                    title={t('Origin')}
                    value={transaction.metaData?.kashierOriginDetails?.id}
                />
                {showCapturedRate && (
                    <SectionItem
                        title={t('Locked rate')}
                        value={`1 ${t(toDisplayCode(virtual?.virtualCurrency))} = ${currencyNumber(virtual!.virtualExchangeRate!)} ${t('EGP')}`}
                    />
                )}
                {showCapturedRate && virtual?.virtualRateRecordedAt && (
                    <SectionItem
                        title={t('Rate locked at')}
                        value={`${formatRelativeDate(virtual.virtualRateRecordedAt)} ${formatTime(virtual.virtualRateRecordedAt)}`}
                    />
                )}
            </DetailsSection>
        </>
    );
};

