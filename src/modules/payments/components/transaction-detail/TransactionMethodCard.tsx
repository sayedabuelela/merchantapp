import { useTranslation } from 'react-i18next';
import { DetailSection, DetailRow } from '../detail';
import { TransactionDetail } from '../../payments.model';

interface TransactionMethodCardProps {
    transaction: TransactionDetail;
}

/**
 * Transaction payment method and details card
 */
export const TransactionMethodCard = ({ transaction }: TransactionMethodCardProps) => {
    const { t } = useTranslation();

    const hasPaymentDetails =
        transaction.method ||
        transaction.provider ||
        transaction.paymentChannel ||
        transaction.sourceOfFunds;

    if (!hasPaymentDetails) return null;

    return (
        <DetailSection title={t('Payment Details')}>
            {transaction.method && <DetailRow label={t('Payment Method')} value={transaction.method} />}
            {transaction.provider && <DetailRow label={t('Provider')} value={transaction.provider} />}
            {transaction.paymentChannel && <DetailRow label={t('Channel')} value={transaction.paymentChannel} />}
            {transaction.sourceOfFunds?.cardBrand && (
                <DetailRow label={t('Card Scheme')} value={transaction.sourceOfFunds.cardBrand} />
            )}
            {transaction.sourceOfFunds?.maskedCard && (
                <DetailRow label={t('Card Number')} value={transaction.sourceOfFunds.maskedCard} />
            )}
            {transaction.sourceOfFunds?.cardHolderName && (
                <DetailRow label={t('Card Holder')} value={transaction.sourceOfFunds.cardHolderName} />
            )}
            {transaction.sourceOfFunds?.issuer && (
                <DetailRow label={t('Issuer')} value={transaction.sourceOfFunds.issuer} />
            )}
            {transaction.transactionResponseCode && (
                <DetailRow label={t('Response Code')} value={transaction.transactionResponseCode} />
            )}
            {transaction.transactionResponseMessage?.en && (
                <DetailRow
                    label={t('Response Message')}
                    value={transaction.transactionResponseMessage.en}
                />
            )}
            {transaction.pcc?.financial_institution && (
                <DetailRow label={t('Financial Institution')} value={transaction.pcc.financial_institution} />
            )}
        </DetailSection>
    );
};
