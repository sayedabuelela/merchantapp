import { formatRelativeDate } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import FontText from "@/src/shared/components/FontText";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { groupUpcomingDates } from "../../balance.utils";
import SettlementForecastButton from "./SettlementForecastButton";
import LaterSettlementsList from "./LaterSettlementsList";
import SettlementForecastItem from "./SettlementForecastItem";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import SectionHeader from "../SectionHeader";
import { ROUTES } from "@/src/core/navigation/routes";

interface Props {
    upcomingValueDates: { amount: number; date: string }[];
    currency: string;
    onPressPayouts: () => void;
}
const scenario1 = [
    { amount: 100, date: "2025-09-25" },
    { amount: 200, date: "2025-09-26" },
    { amount: 300, date: "2025-09-27" },
    { amount: 400, date: "2025-09-28" },
];
const SettlementForecast = ({ upcomingValueDates, currency, onPressPayouts }: Props) => {
    const { t } = useTranslation();

    return (
        <View className="mb-8">
            <SectionHeader
                title={t('Settlement forecast')}
                nextRouteTitle={t('Payouts')}
                onPressPayouts={onPressPayouts}
                nextRoute={ROUTES.BALANCE.ACTIVITIES}
            />
            <FlatList
                data={scenario1}
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

export default SettlementForecast;