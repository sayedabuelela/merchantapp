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
import { NoActivitiesIcon, NoActivitiesSmallIcon } from '@/src/shared/assets/svgs';

const BalancesScreen = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { data: recentActivities } = useRecentBalanceActivities();
    const { accountStatistics: { data: accountStats }, transfersStatistics: { data: transfersStats } } = useStatistics();
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const { accounts } = useAccounts();

    const RecentActivitiesEmpty = () => {
        return (
            <View className="items-center justify-center py-8">
                <NoActivitiesSmallIcon />
                <FontText type="body" weight="bold" className="text-content-primary text-base text-center mt-4">
                    {t('No balance activities yet!')}
                </FontText>
                <FontText type="body" weight="regular" className="text-content-secondary text-base text-center mt-2">
                    {t('When funds move in or out of your account, the details will be listed here.')}
                </FontText>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <BalanceHeader
                    userName={user?.fullName || user?.userName}
                    balanceOverview={accountStats?.balanceOverview}
                    ongoingTransfers={transfersStats?.onGoingTransfersAmount}
                    onPressAccounts={() => setShowAccountsModal(true)}
                    showAccountsBtn={(accounts !== undefined && accounts?.length > 0)}
                />
                <View className="px-6">
                    {accountStats?.upcomingValueDates && accountStats?.upcomingValueDates.length > 0 && (
                        <SettlementForecast
                            upcomingValueDates={accountStats?.upcomingValueDates}
                            currency={t("EGP")}
                            nextRoute={ROUTES.BALANCE.ACTIVITIES}
                        />
                    )}
                    <View>
                        <SectionHeader
                            title={t("Recent activities")}
                            nextRouteTitle={t("All activities")}
                            nextRoute={ROUTES.BALANCE.ACTIVITIES}
                        />
                        {recentActivities?.data && recentActivities.data.length > 0 ? (
                            recentActivities.data.map((item) => (
                                <ActivityCard
                                    key={item._id}
                                    {...item}
                                    fromBalance
                                />
                            ))
                        ) : (<RecentActivitiesEmpty />)}
                    </View>
                </View>
            </ScrollView>
            {accounts !== undefined && (
                <AccountsModal
                    isVisible={showAccountsModal}
                    onClose={() => setShowAccountsModal(false)}
                    accounts={accounts}
                />
            )}
        </SafeAreaView>
    )
}

export default BalancesScreen