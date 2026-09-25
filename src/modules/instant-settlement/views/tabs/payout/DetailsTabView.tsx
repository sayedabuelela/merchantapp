import { currencyLabel } from "@/src/core/constants/currencies";
import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";
import SummaryItem from "@/src/modules/payment-links/components/details-screen/SummaryItem";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import DetailsSection from "@/src/shared/components/details-screens/DetailsSection";
import FontText from "@/src/shared/components/FontText";
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem";
import SectionItemWithCopy from "@/src/shared/components/details-screens/SectionItemWithCopy";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import type { InstantRequestDetails } from "../../../domain/instant-settlement.models";
import { isDeclinedStatus, toDisplayStatus } from "../../../mappers/instant-settlement.status";
import DailyLimitCard from "../../components/DailyLimitCard";

interface Props {
    details: InstantRequestDetails;
}

const CURRENCY = 'EGP';

const DetailsTabView = ({ details }: Props) => {
    const { t } = useTranslation();
    // Inside the component so the currency label goes through `t`, the way every
    // other instant-settlement view does it.
    const money = (v: number) => `${currencyNumber(v)} ${currencyLabel(t, CURRENCY)}`;
    const ratePct = details.feeSnapshot ? ` (${details.feeSnapshot.rate}%)` : '';
    const dateTime = (iso: string) => `${formatRelativeDate(iso)} – ${formatAMPM(iso)}`;

    // Total Deduction = transaction total + instant (rate) fee + VAT + ACH (flat) fee.
    const totalDeduction = details.totalAmount + details.totalRateFees + details.vat + details.flatFees;

    const isDeclined = isDeclinedStatus(details.status);

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 pt-6 pb-10"
            showsVerticalScrollIndicator={false}
        >
            {/* Header: total deduction + status badge (DECLINE → REJECTED) */}
            <View className="flex-row items-center mb-6 gap-x-3">
                <FontText type="head" weight="bold" className="text-content-primary text-2xl">
                    {money(details.totalAmount)}
                </FontText>
                <StatusBox status={toDisplayStatus(details.status)} />
            </View>

            {/* Rejection reason — declined requests only */}
            {isDeclined && !!details.declineReason && (
                <AnimatedError
                    title={t('Request rejected!')}
                    errorMsg={details.declineReason}
                    className="mt-0 mb-6"
                />
            )}

            {/* Details card — plain label → value rows */}
            <DetailsSection className="mb-6" title={t('Details')}>
                <SectionRowItem title={t('Request ID')} value={details.requestId} valueClassName="uppercase" />
                <SectionRowItem title={t('Origin')} value={t('Instant settlements')} />
                <SectionRowItem title={t('Transactions')} value={String(details.transactionsCount)} />
                <SectionRowItem title={t('Requested by')} value={details.requestedBy} />
                <SectionRowItem title={t('Created')} value={dateTime(details.createdAt)} />
                <SectionRowItem title={t('Updated')} value={dateTime(details.updatedAt)} />
            </DetailsSection>

            {/* Daily limit */}
            <DailyLimitCard limits={details.limits} className="mx-0 mb-6" />

            {/* Financial Summary */}
            <DetailsSection className="gap-y-3 mb-6" title={t('Financial Summary')}>
                <SummaryItem title={t('Transaction Total')} value={money(details.totalSettlementAmount)} />
                <SummaryItem title={`${t('Instant Fee')}${ratePct}`} value={money(details.totalRateFees)} />
                <SummaryItem title={t('VAT')} value={money(details.vat)} />
                <SummaryItem title={t('ACH Fee')} value={money(details.flatFees)} />
                <SummaryItem title={t('Total Deduction')} value={money(details.netTransferAmount)} summaryLabel />
            </DetailsSection>

            {/* Payout method — hidden when payoutMethodsByAccount absent */}
            {details.payoutMethods.map((m) => (
                <DetailsSection key={m.accountId} className="mb-6" title={t('Payout method')}>
                    <SectionRowItem title={t('Method')} value={m.payoutMethod} />
                    <SectionRowItem
                        title={t('Branch')}
                        value={[m.bankBranchName, m.bankBranchCode].filter(Boolean).join(' – ')}
                    />
                    <SectionRowItem title={t('Bank')} value={m.bankName} />
                    <SectionRowItem title={t('Account Holder')} value={m.accountHolderName} />
                    <SectionItemWithCopy
                        inline
                        title={t('Account Num.')}
                        value={m.accountNumber}
                    />
                </DetailsSection>
            ))}
        </ScrollView>
    );
};

export default DetailsTabView;
