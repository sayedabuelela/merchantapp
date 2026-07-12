import { cn } from "@/src/core/utils/cn";
import { formatAMPM } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { RequestRecord } from "../../domain/instant-settlement.models";

interface Props {
    record: RequestRecord;
}

const CURRENCY = 'EGP';

/** A row in the embedded Records list. Direction from the signed amount (§6). */
const PayoutRecordRow = ({ record }: Props) => {
    const { t } = useTranslation();
    const isIn = record.direction === 'in';

    return (
        <View className="flex-row items-center justify-between border-[1.5px] rounded border-tertiary p-4 mb-2">
            <View className="flex-1 pr-2">
                {/* accountId only — no friendly labels (SSOT §6) */}
                <FontText type="body" weight="regular" className="text-content-secondary text-[10px] mb-0.5" numberOfLines={1}>
                    {record.accountId || record.operation || t('Record')}
                </FontText>
                {!!record.createdAt && (
                    <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                        {formatAMPM(record.createdAt)}
                    </FontText>
                )}
            </View>
            <FontText
                type="body"
                weight="bold"
                className={cn('text-sm', isIn ? 'text-[#4AAB4E]' : 'text-[#A50017]')}
            >
                {isIn ? '+' : '-'}{currencyNumber(record.amount)} {t(CURRENCY)}
            </FontText>
        </View>
    );
};

export default PayoutRecordRow;
