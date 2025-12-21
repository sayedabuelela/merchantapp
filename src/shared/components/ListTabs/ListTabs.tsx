import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView } from "react-native";
import PressScaleView from "@/src/shared/components/wrappers/animated-wrappers/PressScaleView";

export interface Tab<T = string> {
    label: string;
    value: T;
}

interface Props<T = string> {
    tabs: Tab<T>[];
    value: T;
    onSelectType: (val: T) => void;
    isListEmpty?: boolean;
    className?: string;
    contentContainerClassName?: string;
}

export default function ListTabs<T = string>({ tabs, value, onSelectType, isListEmpty, className, contentContainerClassName }: Props<T>) {
    const { t } = useTranslation();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName={cn("gap-6 px-6", contentContainerClassName)}
            className={cn("border-b border-tertiary mt-4 ", className)}>
            {!isListEmpty && tabs.map(tab => {
                const isActive = tab.value === value;
                return (
                    <PressScaleView
                        key={String(tab.value)}
                        onPress={() => onSelectType(tab.value)}
                    >
                        <FontText
                            type="body"
                            weight="semi"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className={cn(`text-sm`, isActive ? "text-primary" : "text-[#6F7E7E]")}
                        >
                            {t(tab.label)}
                        </FontText>

                        <MotiView
                            from={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                            transition={{ type: "timing", duration: 200 }}
                            className="h-0.5 bg-primary rounded-full mt-3"
                        />
                    </PressScaleView>
                );
            })}
        </ScrollView>
    );
}
