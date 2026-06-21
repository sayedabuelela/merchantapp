import { cn } from "@/src/core/utils/cn";
import { formatRelativeDate } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import FontText from "@/src/shared/components/FontText";
import IconBox from "@/src/shared/components/wrappers/IconBox";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ArrowSmallDownIcon, ArrowSmallUpIcon } from "react-native-heroicons/outline";
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
        <View className="flex-row items-center justify-between py-3 border-b border-tertiary">
            <View className="flex-row items-center gap-x-2 flex-1">
                <IconBox className={cn(isIn ? 'bg-[#D1FFD3] border border-[#AEFFB2]' : 'bg-[#FFEAED] border border-[#FEE4E7]')}>
                    {isIn ? (
                        <ArrowSmallDownIcon size={10} color="#1A541D" />
                    ) : (
                        <ArrowSmallUpIcon size={10} color="#A50017" />
                    )}
                </IconBox>
                <View className="flex-1">
                    {/* accountId only — no friendly labels (SSOT §6) */}
                    <FontText type="body" weight="regular" className="text-content-primary text-xs" numberOfLines={1}>
                        {record.accountId || record.operation || t('Record')}
                    </FontText>
                    {!!record.valueDate && (
                        <FontText type="body" weight="regular" className="text-content-secondary text-[10px]">
                            {formatRelativeDate(record.valueDate)}
                        </FontText>
                    )}
                </View>
            </View>
            <FontText
                type="body"
                weight="bold"
                className={cn('text-sm', isIn ? 'text-[#1A541D]' : 'text-[#A50017]')}
            >
                {isIn ? '+' : '-'}{currencyNumber(record.amount)} {t(CURRENCY)}
            </FontText>
        </View>
    );
};

export default PayoutRecordRow;
