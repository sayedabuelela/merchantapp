import { View } from 'react-native'
import { useAuthStore } from '@/src/modules/auth/auth.store'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context';
import FontText from '@/src/shared/components/FontText';
import BalanceHeader from '../components/header/BalanceHeader';
import useStatistics from '../viewmodels/useStatistics';
import SettlementForecast from '../components/settlement-forecast/SettlementForecast';

const BalancesScreen = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { accountStatistics: { data: accountStats }, transfersStatistics: { data: transfersStats } } = useStatistics();
    // console.log('transfersStats', transfersStats);
    return (

        <SafeAreaView className="flex-1 bg-white">
            <BalanceHeader
                userName={user?.fullName || user?.userName}
                balanceOverview={accountStats?.balanceOverview}
                ongoingTransfers={transfersStats?.onGoingTransfersAmount}
            />
            <View className="px-6">
                {accountStats?.upcomingValueDates && accountStats?.upcomingValueDates.length > 0 && (
                    <SettlementForecast upcomingValueDates={accountStats?.upcomingValueDates} currency={t("EGP")} />
                )}
            </View>
        </SafeAreaView>
    )
}

export default BalancesScreen