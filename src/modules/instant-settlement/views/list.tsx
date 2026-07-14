import ListTabs, { Tab } from "@/src/shared/components/ListTabs/ListTabs";
import { FadeInDownView } from "@/src/shared/components/wrappers/animated-wrappers";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectUser, useAuthStore } from "../../auth/auth.store";
import usePermissions from "../../auth/hooks/usePermissions";
import InstantSettlementHeader from "./components/header/InstantSettlementHeader";
import NewRequestTab from "./tabs/NewRequestTab";
import RequestsTab from "./tabs/RequestsTab";

type TabValue = 'new' | 'requests';

const InstantSettlementScreen = () => {
    const { t } = useTranslation();
    const [tab, setTab] = useState<TabValue>('new');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [search, setSearch] = useState('');

    const user = useAuthStore(selectUser);
    const { canCreateInstantSettlement } = usePermissions(user?.actions!);

    const tabs: Tab<TabValue>[] = useMemo(
        () => [
            { label: 'New Request', value: 'new' },
            { label: 'Requests', value: 'requests' },
        ],
        [],
    );

    // search maps to requestId (ISR-…) lookup only — no generic free-text param (§10)
    const requestId = search.trim() || undefined;

    const handleClearSearch = useCallback(() => setSearch(''), []);
    const handleSearchChange = useCallback((text: string) => setSearch(text), []);
    const handleRequestSuccess = useCallback(() => setTab('requests'), []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FadeInDownView delay={0} duration={300}>
                <InstantSettlementHeader
                    onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
                    onSubmitSearch={handleSearchChange}
                    isFilterOpen={isFiltersOpen}
                    isListEmpty={false}
                    hasFilters={false}
                    handleClearSearch={handleClearSearch}
                    searchValue={search}
                    showFilters={false}
                    backBtn
                />
            </FadeInDownView>

            {/* Wrap in a self-sized View: a bare horizontal ScrollView (ListTabs)
                as a direct flex-column child stretches vertically and creates a
                large gap. The View constrains it to its content height. */}
            <View>
                <ListTabs<TabValue>
                    tabs={tabs}
                    value={tab}
                    onSelectType={setTab}
                    className="mb-3"
                />
            </View>

            {tab === 'new' ? (
                <NewRequestTab
                    params={{ requestId }}
                    canCreateInstantSettlement={canCreateInstantSettlement}
                    enabled={true}
                    onRequestSuccess={handleRequestSuccess}
                />
            ) : (
                <RequestsTab params={{ requestId }} enabled={true} />
            )}
        </SafeAreaView>
    );
};

export default InstantSettlementScreen;
