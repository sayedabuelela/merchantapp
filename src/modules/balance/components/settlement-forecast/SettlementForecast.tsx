import { formatRelativeDate } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import FontText from "@/src/shared/components/FontText";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { groupUpcomingDates } from "../../balance.utils";
import SettlementForecastButton from "./SettlementForecastButton";
import LaterSettlementsList from "./LaterSettlementsList";

interface Props {
    upcomingValueDates: { amount: number; date: string }[];
    currency: string;
}
const scenario1 = [
    { amount: 100, date: "2025-09-25" },
    { amount: 200, date: "2025-09-26" },
    { amount: 300, date: "2025-09-27" },
    { amount: 400, date: "2025-09-28" },
];
const SettlementForecast = ({ upcomingValueDates, currency }: Props) => {
    const { t } = useTranslation();
    upcomingValueDates = scenario1;
    const grouped = useMemo(
        () => groupUpcomingDates(upcomingValueDates),
        [upcomingValueDates]
    );

    const initialSelectedDate =
        grouped.today?.date ?? grouped.tomorrow?.date ?? 'later';
    const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
    const selectedValue =
        upcomingValueDates.find((item) => item.date === selectedDate) ?? null;

    return (
        <View className="border border-stroke-main p-4 rounded">
            <FontText
                type="body"
                weight="regular"
                className="text-xs text-content-primary uppercase mb-2"
            >
                {t("settlement forecast")}
            </FontText>

            <View className="flex flex-row gap-x-2 items-center mb-4">
                {grouped.today && (
                    <SettlementForecastButton
                        date={grouped.today.date}
                        isActive={selectedDate === grouped.today.date}
                        onPress={() => setSelectedDate(grouped.today!.date)}
                        t={t}
                    />
                )}
                {grouped.tomorrow && (
                    <SettlementForecastButton
                        date={grouped.tomorrow.date}
                        isActive={selectedDate === grouped.tomorrow.date}
                        onPress={() => setSelectedDate(grouped.tomorrow!.date)}
                        t={t}
                    />
                )}
                {grouped.later.length > 0 && (
                    <SettlementForecastButton
                        date="later"
                        isActive={selectedDate === "later"}
                        onPress={() => setSelectedDate("later")}
                        t={t}
                    />
                )}
            </View>

            {selectedDate === "later" ? (
                <LaterSettlementsList
                    laterSettlements={grouped}
                    currency={currency}
                />
            ) : (
                <FontText
                    type="body"
                    weight="bold"
                    className="text-base text-content-primary uppercase"
                >
                    {currencyNumber(selectedValue?.amount || 0) + " " + currency}
                </FontText>
            )}
        </View>
    );
};

export default SettlementForecast;