import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView } from "react-native";
import { PaymentStatus } from "../payment-links.model";



interface Props {
    value: PaymentStatus | string;
    onSelectStatus: (val: PaymentStatus | string) => void;
    isListEmpty: boolean;
}

export default function PaymentLinksTabs({ value, onSelectStatus, isListEmpty }: Props) {
    const { t } = useTranslation();
    const TABS = [
        { label: t("All") , value: "" },
        { label: t("Paid"), value: "paid" },
        { label: t("Unpaid"), value: "unpaid" },
        { label: t("Overdue"), value: "overdue" },
        { label: t("Expired"), value: "expired" },
        { label: t("Awaiting approval"), value: "awaiting_approval" },
        { label: t("Rejected"), value: "rejected" },
    ];
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-stroke-divider  mt-4"
            contentContainerClassName="px-6 align-center"
            style={{ flexGrow: 0 }}
        >
            {!isListEmpty && TABS.map(tab => {
                const isActive = tab.value === value;
                return (
                    <Pressable
                        key={tab.value}
                        onPress={() => onSelectStatus(tab.value)}
                        className="mr-8"
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
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
