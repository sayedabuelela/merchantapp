import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { ActivityType } from "../balance.model";

const TABS = [
    { label: "Payouts", value: "payout" as ActivityType },
    { label: "Transfers", value: "transfer" as ActivityType },
    { label: "All Activities", value: "all" as ActivityType },
];

interface Props {
    value: ActivityType;
    onSelectType: (val: ActivityType) => void;
    isListEmpty: boolean;
}

export default function ActivitiesTabs({ value, onSelectType, isListEmpty }: Props) {
    const { t } = useTranslation();
    
    return (
        <View className="border-b border-stroke-divider mt-4 flex-row items-center justify-center gap-x-8 ">
            {!isListEmpty && TABS.map(tab => {
                const isActive = tab.value === value;
                return (
                    <Pressable
                        key={tab.value}
                        onPress={() => onSelectType(tab.value)}
                    >
                        <FontText
                            type="body"
                            weight="semi"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className={cn(`text-sm ${isActive ? "text-primary" : "text-[#6F7E7E]"}`)}
                        >
                            {t(tab.label)}
                        </FontText>

                        <MotiView
                            from={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                            transition={{ type: "timing", duration: 200 }}
                            className="h-0.5 bg-primary rounded-full mt-3"
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}
