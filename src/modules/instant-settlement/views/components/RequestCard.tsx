import { formatAMPM } from "@/src/core/utils/dateUtils";
import { currencyNumber } from "@/src/core/utils/number-fields";
import { ROUTES } from "@/src/core/navigation/routes";
import FontText from "@/src/shared/components/FontText";
import { Link } from "expo-router";
import { PressableScale } from "pressto";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { InstantRequestSummary } from "../../domain/instant-settlement.models";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";

interface Props {
    request: InstantRequestSummary;
}

const CURRENCY = 'EGP';

/** Requests history card — amount + N orders + mapped status + time. */
const RequestCard = ({ request }: Props) => {
    const { t } = useTranslation();

    return (
        <Link href={ROUTES.INSTANT_SETTLEMENT.REQUEST_DETAILS(request.id)} asChild>
            <PressableScale>
                <View className="border-[1.5px] rounded border-tertiary px-4 py-4 mb-2">
                    <View className="flex-row items-start justify-between">
                        <View>
                            <FontText type="body" weight="bold" className="text-content-primary text-sm mb-1">
                                {currencyNumber(request.amount)} {t(CURRENCY)}
                            </FontText>
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                                {request.ordersCount} {t('orders')}
                            </FontText>
                        </View>
                        <View className="items-end gap-y-1">
                            <StatusBox status={request.status} />
                            <FontText type="body" weight="regular" className="text-content-secondary text-xs">
                                {formatAMPM(request.createdAt)}
                            </FontText>
                        </View>
                    </View>
                </View>
            </PressableScale>
        </Link>
    );
};

export default RequestCard;
