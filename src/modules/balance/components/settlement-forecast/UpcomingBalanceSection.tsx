import { Route } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, I18nManager, Pressable, View } from "react-native";
import SectionHeader from "../SectionHeader";
import SettlementForecastItem from "./UpcomingBalanceItem";
import FontText from "@/src/shared/components/__mocks__/FontText";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import { ActivityType } from "../../balance.model";

interface Props {
    upcomingValueDates: { amount: number; date: string }[];
    currency: string;
    // nextRoute: Route;
    setType: () => void;
}

const UpcomingBalanceSection = ({ upcomingValueDates, currency, setType }: Props) => {

    const { t } = useTranslation();

    return (
        <View className="mb-8">
            <SectionHeader
                title={t('Upcoming balance')}
                nextRouteTitle={t('Payouts')}
                onPressNextRoute={setType}
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