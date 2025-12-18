import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView } from "react-native";
import { PaymentStatus } from "../payment-links.model";

const TABS = [
    { label: "All", value: "" },
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Overdue", value: "overdue" },
    { label: "Expired", value: "expired" },
    { label: "Awaiting approval", value: "awaiting_approval" },
    { label: "Rejected", value: "rejected" },
];

interface Props {
    value: PaymentStatus | string;
    onSelectStatus: (val: PaymentStatus | string) => void;
    isListEmpty: boolean;
}

export default function PaymentLinksTabs({ value, onSelectStatus, isListEmpty }: Props) {
    const { t } = useTranslation();
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-stroke-divider px-6 mt-4"
            contentContainerStyle={{ alignItems: "center" }}
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
