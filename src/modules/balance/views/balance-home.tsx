import { useAuthStore } from '@/src/modules/auth/auth.store';
import FontText from '@/src/shared/components/FontText';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActivityCard from '../components/ActivityCard';
import AccountsModal from '../components/AccountsModal';
import BalanceHeader from '../components/header/BalanceHeader';
import SectionHeader from '../components/SectionHeader';
import SettlementForecast from '../components/settlement-forecast/SettlementForecast';
import useAccounts from '../viewmodels/useAccounts';
import { useRecentBalanceActivities } from '../viewmodels/useActivitiesVM';
import useStatistics from '../viewmodels/useStatistics';
import { ROUTES } from '@/src/core/navigation/routes';

const BalancesScreen = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { data: recentActivities } = useRecentBalanceActivities();
    const { accountStatistics: { data: accountStats }, transfersStatistics: { data: transfersStats } } = useStatistics();
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const { accounts } = useAccounts();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <BalanceHeader
                    userName={user?.fullName || user?.userName}
                    balanceOverview={accountStats?.balanceOverview}
                    ongoingTransfers={transfersStats?.onGoingTransfersAmount}
                    onPressAccounts={() => setShowAccountsModal(true)}
                />
                <View className="px-6">
                    {accountStats?.upcomingValueDates && accountStats?.upcomingValueDates.length > 0 && (
                        <SettlementForecast
                            upcomingValueDates={accountStats?.upcomingValueDates}
                            currency={t("EGP")}
                            onPressPayouts={() => { }}
                        />
                    )}
                    <View>
                        <SectionHeader
                            title={t("Recent activities")}
                            nextRouteTitle={t("All activities")}
                            nextRoute={ROUTES.BALANCE.ACTIVITIES}
                            onPressPayouts={() => { }}
                        />
                        {recentActivities?.data && recentActivities.data.length > 0 ? (
                            recentActivities.data.map((item) => (
                                <ActivityCard
                                    key={item._id}
                                    {...item}
                                    fromBalance
                                />
                            ))
                        ) : (
                            <View className="py-20">
                                <FontText type="body" weight="regular" className="text-content-secondary text-center">
                                    {t("No activities found")}
                                </FontText>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            {accounts?.data !== undefined && (
                <AccountsModal
                    isVisible={showAccountsModal}
                    onClose={() => setShowAccountsModal(false)}
                    accounts={accounts?.data}
                />
            )}
        </SafeAreaView>
    )
}

export default BalancesScreen