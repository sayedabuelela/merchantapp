import { Route } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import SectionHeader from "../SectionHeader";
import SettlementForecastItem from "./UpcomingBalanceItem";

interface Props {
    upcomingValueDates: { amount: number; date: string }[];
    currency: string;
    nextRoute: Route;
}

const UpcomingBalanceSection = ({ upcomingValueDates, currency, nextRoute }: Props) => {

    const { t } = useTranslation();

    return (
        <View className="mb-8">
            <SectionHeader
                title={t('Upcoming balance')}
                nextRouteTitle={t('Payouts')}
                nextRoute={nextRoute}
            />
            <FlatList
                data={upcomingValueDates}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <SettlementForecastItem {...item} />
                )}
                keyExtractor={(item) => item.date}
            />
        </View>
    );
};

export default UpcomingBalanceSection;