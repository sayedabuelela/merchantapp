import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";
import SummaryItem from "@/src/modules/payment-links/components/details-screen/SummaryItem";
import DetailsSection from "@/src/shared/components/details-screens/DetailsSection";
import FontText from "@/src/shared/components/FontText";
import SectionItem from "@/src/shared/components/details-screens/SectionItem";
import SectionItemWithCopy from "@/src/shared/components/details-screens/SectionItemWithCopy";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import {
    BanknotesIcon,
    BuildingLibraryIcon,
    CalendarIcon,
    IdentificationIcon,
    RectangleGroupIcon,
    UserIcon,
} from "react-native-heroicons/outline";
import type { InstantRequestDetails } from "../../../domain/instant-settlement.models";

interface Props {
    details: InstantRequestDetails;
}

const CURRENCY = 'EGP';
const money = (v: number) => `${currencyNumber(v)} ${CURRENCY}`;

const DetailsTabView = ({ details }: Props) => {
    const { t } = useTranslation();
    const ratePct = details.feeSnapshot ? ` (${details.feeSnapshot.rate}%)` : '';
    const dateTime = (iso: string) => `${formatRelativeDate(iso)}, ${formatAMPM(iso)}`;

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 pt-6 pb-10"
            showsVerticalScrollIndicator={false}
        >
            {/* Header: total amount + raw status badge */}
            <View className="items-center mb-6">
                <FontText type="head" weight="bold" className="text-content-primary text-2xl mb-2">
                    {money(details.totalAmount)}
                </FontText>
                <StatusBox status={details.status} />
            </View>

            {/* Details card */}
            <DetailsSection
                className="mb-6"
                icon={<RectangleGroupIcon size={24} color="#556767" />}
                title={t('Details')}
            >
                <SectionItemWithCopy
                    icon={<IdentificationIcon size={24} color="#556767" />}
                    title={t('Request ID')}
                    value={details.requestId}
                    valueClassName="uppercase"
                />
                <SectionItem
                    icon={<UserIcon size={24} color="#556767" />}
                    title={t('Merchant')}
                    value={details.merchantName}
                />
                <SectionItem
                    icon={<BuildingLibraryIcon size={24} color="#556767" />}
                    title={t('Store')}
                    value={details.storeName}
                />
                <SectionItem
                    icon={<BanknotesIcon size={24} color="#556767" />}
                    title={t('Transactions')}
                    value={String(details.transactionsCount)}
                />
                <SectionItem
                    icon={<UserIcon size={24} color="#556767" />}
                    title={t('Requested by')}
                    value={details.requestedBy}
                />
                <SectionItem
                    icon={<CalendarIcon size={24} color="#556767" />}
                    title={t('Created')}
                    value={dateTime(details.createdAt)}
                />
                <SectionItem
                    icon={<CalendarIcon size={24} color="#556767" />}
                    title={t('Updated')}
                    value={dateTime(details.updatedAt)}
                />
            </DetailsSection>

            {/* Financial Summary */}
            <DetailsSection
                className="gap-y-3 mb-6"
                icon={<BanknotesIcon size={24} color="#556767" />}
                title={t('Financial Summary')}
            >
                <SummaryItem title={t('Gross')} value={money(details.totalAmount)} />
                <SummaryItem title={`${t('Rate Fees')}${ratePct}`} value={money(details.totalRateFees)} />
                <SummaryItem title={t('Flat Fees')} value={money(details.flatFees)} />
                <SummaryItem title={t('VAT')} value={money(details.vat)} />
                <SummaryItem title={t('Total Fees')} value={money(details.totalFees)} />
                <SummaryItem title={t('Settlement')} value={money(details.totalSettlementAmount)} />
                <SummaryItem title={t('Net Transfer')} value={money(details.netTransferAmount)} summaryLabel />
            </DetailsSection>

            {/* Payout method — hidden when payoutMethodsByAccount absent */}
            {details.payoutMethods.map((m) => (
                <DetailsSection
                    key={m.accountId}
                    className="mb-6"
                    icon={<BuildingLibraryIcon size={24} color="#556767" />}
                    title={t('Payout method')}
                >
                    <SectionItem
                        icon={<BanknotesIcon size={24} color="#556767" />}
                        title={t('Method')}
                        value={m.payoutMethod}
                    />
                    <SectionItem
                        icon={<BuildingLibraryIcon size={24} color="#556767" />}
                        title={t('Branch')}
                        value={[m.bankBranchName, m.bankBranchCode].filter(Boolean).join(' – ')}
                    />
                    <SectionItem
                        icon={<BuildingLibraryIcon size={24} color="#556767" />}
                        title={t('Bank')}
                        value={m.bankName}
                    />
                    <SectionItem
                        icon={<UserIcon size={24} color="#556767" />}
                        title={t('Account Holder')}
                        value={m.accountHolderName}
                    />
                    <SectionItemWithCopy
                        icon={<IdentificationIcon size={24} color="#556767" />}
                        title={t('Account Number')}
                        value={m.accountNumber}
                    />
                </DetailsSection>
            ))}
        </ScrollView>
    );
};

export default DetailsTabView;
