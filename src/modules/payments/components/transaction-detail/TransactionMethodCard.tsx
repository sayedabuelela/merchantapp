import { useTranslation } from 'react-i18next';
import DetailsSection from '@/src/shared/components/details-screens/DetailsSection';
import SectionRowItem from '@/src/shared/components/details-screens/SectionRowItem';
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
        <DetailsSection title={t('Payment Details')}>
            {transaction.method && <SectionRowItem title={t('Payment Method')} value={transaction.method} />}
            {transaction.provider && <SectionRowItem title={t('Provider')} value={transaction.provider} />}
            {transaction.paymentChannel && <SectionRowItem title={t('Channel')} value={transaction.paymentChannel} />}
            {transaction.sourceOfFunds?.cardBrand && (
                <SectionRowItem title={t('Card Scheme')} value={transaction.sourceOfFunds.cardBrand} />
            )}
            {transaction.sourceOfFunds?.maskedCard && (
                <SectionRowItem title={t('Card Number')} value={transaction.sourceOfFunds.maskedCard} />
            )}
            {transaction.sourceOfFunds?.cardHolderName && (
                <SectionRowItem title={t('Card Holder')} value={transaction.sourceOfFunds.cardHolderName} />
            )}
            {transaction.sourceOfFunds?.issuer && (
                <SectionRowItem title={t('Issuer')} value={transaction.sourceOfFunds.issuer} />
            )}
            {transaction.transactionResponseCode && (
                <SectionRowItem title={t('Response Code')} value={transaction.transactionResponseCode} />
            )}
            {transaction.transactionResponseMessage?.en && (
                <SectionRowItem
                    title={t('Response Message')}
                    value={transaction.transactionResponseMessage.en}
                />
            )}
            {transaction.pcc?.financial_institution && (
                <SectionRowItem title={t('Financial Institution')} value={transaction.pcc.financial_institution} />
            )}
        </DetailsSection>
    );
};
