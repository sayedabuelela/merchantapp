import Button from "@/src/shared/components/Buttons/Button";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import MainHeader from "@/src/shared/components/headers/MainHeader";
import SimpleLoader from "@/src/shared/components/loaders/SimpleLoader";
import ListTabs, { Tab } from "@/src/shared/components/ListTabs/ListTabs";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ExclamationTriangleIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInstantRequestDetailsVM } from "../viewmodels/useInstantRequestDetailsVM";
import AccountsTabView from "./tabs/payout/AccountsTabView";
import DetailsTabView from "./tabs/payout/DetailsTabView";
import HistoryTabView from "./tabs/payout/HistoryTabView";
import TransactionsTabView from "./tabs/payout/TransactionsTabView";

type PayoutTab = 'details' | 'transactions' | 'accounts' | 'history';

const TABS: Tab<PayoutTab>[] = [
    { label: 'Details', value: 'details' },
    { label: 'Transactions', value: 'transactions' },
    { label: 'Accounts', value: 'accounts' },
    { label: 'History', value: 'history' },
];

/**
 * Payout details — 4-tab screen (Details | Transactions | Accounts | History).
 * Two queries back the four tabs: the details query (Details + Accounts + History)
 * and a separate paginated transactions query (owned by TransactionsTabView).
 */
const PayoutDetailsScreen = () => {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const uuid = id ?? '';

    const [tab, setTab] = useState<PayoutTab>('details');

    const { details, isLoading, isError, refetch } = useInstantRequestDetailsVM(uuid);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <MainHeader title={t('Payout details')} className="mb-0" />
            {isError && !details ? (
                <View className="flex-1 px-6 mt-6 items-center justify-center">
                    <EmptyDataList
                        icon={<ExclamationTriangleIcon size={48} color="#919C9C" />}
                        title={t('Something went wrong')}
                        description={t('Could not load the payout details')}
                    />
                    <Button
                        variant="outline"
                        title={t('Retry')}
                        onPress={() => refetch()}
                        className="mt-4"
                        titleClasses="text-sm"
                    />
                </View>
            ) : isLoading || !details ? (
                <SimpleLoader />
            ) : (
                <>
                    {/* Wrap in a self-sized View: a bare horizontal ScrollView
                        (ListTabs) as a direct flex-column child stretches vertically
                        and creates a large gap. */}
                    <View>
                        <ListTabs<PayoutTab>
                            tabs={TABS}
                            value={tab}
                            onSelectType={setTab}
                        />
                    </View>
                    <View className="flex-1">
                        {tab === 'details' && <DetailsTabView details={details} />}
                        {tab === 'transactions' && <TransactionsTabView uuid={uuid} />}
                        {tab === 'accounts' && (
                            <AccountsTabView
                                records={details.records}
                                recordsUnavailable={details.recordsUnavailable}
                            />
                        )}
                        {tab === 'history' && <HistoryTabView statusHistory={details.statusHistory} />}
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

export default PayoutDetailsScreen;
