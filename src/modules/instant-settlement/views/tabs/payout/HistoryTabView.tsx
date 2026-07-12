import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { ClockIcon } from "react-native-heroicons/outline";
import type {
    RequestStatus,
    RequestStatusHistoryEntry,
} from "../../../domain/instant-settlement.models";
import { isDeclinedStatus } from "../../../mappers/instant-settlement.status";
import StatusTimeline, { TimelineStep } from "../../components/StatusTimeline";

interface Props {
    status: RequestStatus;
    statusHistory: RequestStatusHistoryEntry[];
    createdAt: string;
}

type TFn = (key: string) => string;

/** First recorded timestamp for a given raw status (already upper-cased). */
const atFor = (
    history: RequestStatusHistoryEntry[],
    status: string,
): string | undefined => history.find((e) => e.status === status)?.at;

/**
 * Derive the fixed 3-step journey (Request submitted → Risk review → Funds
 * transferred) from the current status + status-history timestamps.
 */
const buildTimelineSteps = (
    rawStatus: RequestStatus,
    history: RequestStatusHistoryEntry[],
    createdAt: string,
    t: TFn,
): TimelineStep[] => {
    const status = (rawStatus || '').toUpperCase();
    const submittedAt = atFor(history, 'PENDING') ?? history[0]?.at ?? createdAt;
    const processingAt = atFor(history, 'PROCESSING');
    const transferredAt = atFor(history, 'TRANSFERRED');
    const declinedAt = history.find((e) => isDeclinedStatus(e.status))?.at;

    // Step 1 — always done once the request exists.
    const submitted: TimelineStep = {
        title: t('Request submitted'),
        description: t('Your instant settlement request was received.'),
        at: submittedAt,
        state: 'done',
    };

    // Step 2 — risk review (rejected branch on DECLINE/DECLINED).
    let risk: TimelineStep;
    if (isDeclinedStatus(status)) {
        risk = {
            title: t('Request rejected'),
            description: t('Risk review declined the request.'),
            at: declinedAt,
            state: 'error',
        };
    } else if (status === 'PENDING') {
        risk = {
            title: t('Risk review'),
            description: t('Risk review is currently in progress.'),
            state: 'current',
        };
    } else {
        risk = {
            title: t('Risk review'),
            description: t('Automated risk evaluation.'),
            at: processingAt ?? submittedAt,
            state: 'done',
        };
    }

    // Step 3 — funds transferred.
    let funds: TimelineStep;
    if (status === 'TRANSFERRED') {
        funds = {
            title: t('Funds transferred'),
            description: t('Transfer to preassigned payout methods per account.'),
            at: transferredAt,
            state: 'done',
        };
    } else if (status === 'PROCESSING') {
        funds = {
            title: t('Funds transferred'),
            description: t('Transfer is being processed.'),
            state: 'current',
        };
    } else {
        funds = {
            title: t('Funds transferred'),
            description: t('Transfer to your bank account.'),
            state: 'pending',
        };
    }

    return [submitted, risk, funds];
};

/** History tab — derived 3-step status timeline. */
const HistoryTabView = ({ status, statusHistory, createdAt }: Props) => {
    const { t } = useTranslation();

    if (!status) {
        return (
            <View className="flex-1 px-6 mt-6">
                <EmptyDataList
                    icon={<ClockIcon size={48} color="#919C9C" />}
                    title={t('No history')}
                    description={t('No status history for this request')}
                />
            </View>
        );
    }

    const steps = buildTimelineSteps(status, statusHistory, createdAt, t);

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 pt-6 pb-10"
            showsVerticalScrollIndicator={false}
        >
            <StatusTimeline steps={steps} />
        </ScrollView>
    );
};

export default HistoryTabView;
