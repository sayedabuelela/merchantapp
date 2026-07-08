import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";
import SummaryItem from "@/src/modules/payment-links/components/details-screen/SummaryItem";
import DetailsSection from "@/src/shared/components/details-screens/DetailsSection";
import FontText from "@/src/shared/components/FontText";
import SectionRowItem from "@/src/shared/components/details-screens/SectionRowItem";
import SectionItemWithCopy from "@/src/shared/components/details-screens/SectionItemWithCopy";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import type { InstantRequestDetails } from "../../../domain/instant-settlement.models";
import DailyLimitCard from "../../components/DailyLimitCard";

interface Props {
    details: InstantRequestDetails;
}

const CURRENCY = 'EGP';
const money = (v: number) => `${currencyNumber(v)} ${CURRENCY}`;

const DetailsTabView = ({ details }: Props) => {
    const { t } = useTranslation();
    const ratePct = details.feeSnapshot ? ` (${details.feeSnapshot.rate}%)` : '';
    const dateTime = (iso: string) => `${formatRelativeDate(iso)} – ${formatAMPM(iso)}`;

    // Total Deduction = transaction total + instant (rate) fee + ACH (flat) fee.
    const totalDeduction = details.totalAmount + details.totalRateFees + details.flatFees;

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 pt-6 pb-10"
            showsVerticalScrollIndicator={false}
        >
            {/* Header: total deduction + raw status badge */}
            <View className="flex-row items-center mb-6 gap-x-3">
                <FontText type="head" weight="bold" className="text-content-primary text-2xl">
                    {money(totalDeduction)}
                </FontText>
                <StatusBox status={details.status} />
            </View>

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
                <SummaryItem title={t('Transaction Total')} value={money(details.totalAmount)} />
                <SummaryItem title={`${t('Instant Fee')}${ratePct}`} value={money(details.totalRateFees)} />
                <SummaryItem title={t('ACH Fee')} value={money(details.flatFees)} />
                <SummaryItem title={t('Total Deduction')} value={money(totalDeduction)} summaryLabel />
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
                        title={t('Account Number')}
                        value={m.accountNumber}
                        valueClassName="text-sm"
                        labelClassName="mb-0"
                    />
                </DetailsSection>
            ))}
        </ScrollView>
    );
};

export default DetailsTabView;
