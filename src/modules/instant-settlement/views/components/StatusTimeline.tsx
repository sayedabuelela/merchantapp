import {cn} from "@/src/core/utils/cn";
import {formatAMPM, formatRelativeDate} from "@/src/core/utils/dateUtils";
import FontText from "@/src/shared/components/FontText";
import {View} from "react-native";
import {CheckIcon, XMarkIcon} from "react-native-heroicons/solid";

export type TimelineNodeState = 'done' | 'current' | 'error' | 'pending';

export interface TimelineStep {
    title: string;
    description: string;
    /** ISO — shown only when the node has a recorded timestamp */
    at?: string;
    state: TimelineNodeState;
}

const RAIL_COLOR = '#D5D9D9';
const DONE_COLOR = '#28C2A0';
const CURRENT_COLOR = '#F5A623';
const ERROR_COLOR = '#A50017';

const TimelineNode = ({state}: { state: TimelineNodeState }) => {
    if (state === 'done') {
        return (
            <View className="w-7 h-7 rounded-full items-center justify-center" style={{backgroundColor: DONE_COLOR}}>
                <CheckIcon size={16} color="#fff"/>
            </View>
        );
    }
    if (state === 'error') {
        return (
            <View className="w-7 h-7 rounded-full items-center justify-center" style={{backgroundColor: ERROR_COLOR}}>
                <XMarkIcon size={16} color="#fff"/>
            </View>
        );
    }
    if (state === 'current') {
        return (
            <View className="w-7 h-7 rounded-full items-center justify-center border-2 bg-white"
                  style={{borderColor: CURRENT_COLOR}}>
                <View className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: CURRENT_COLOR}}/>
            </View>
        );
    }
    // pending
    return <View className="w-7 h-7 rounded-full border-2 bg-white" style={{borderColor: RAIL_COLOR}}/>;
};

const StatusTimeline = ({steps}: { steps: TimelineStep[] }) => {
    return (
        <View>
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const muted = step.state === 'pending';
                return (
                    <View key={`${step.title}-${index}`} className="flex-row">
                        {/* Node + rail column */}
                        <View className="items-center mr-4">
                            <TimelineNode state={step.state}/>
                            {!isLast && <View className="w-0.5 flex-1" style={{backgroundColor: RAIL_COLOR}}/>}
                        </View>
                        {/* Content column */}
                        <View className={cn("flex-1", isLast ? "pb-2" : "pb-8")}>
                            <FontText
                                type="head"
                                weight="bold"
                                className={cn("text-base leading-6", muted ? "text-[#B0B8B8]" : "text-content-primary")}
                            >
                                {step.title}
                            </FontText>
                            <FontText
                                type="body"
                                weight="regular"
                                className={cn("text-sm leading-5 mt-0.5", muted ? "text-[#C4CBCB]" : "text-content-secondary")}
                            >
                                {step.description}
                                <View className="h-1 "/>
                                {!!step.at && (step.state === 'done' || step.state === 'error') && (
                                    <FontText type="body" weight="regular" className="text-xs leading-4 text-[#919C9C]">
                                        {formatRelativeDate(step.at)} {formatAMPM(step.at)}
                                    </FontText>
                                )}
                            </FontText>
                            {/*{!!step.at && (step.state === 'done' || step.state === 'error') && (*/}
                            {/*    <FontText type="body" weight="regular" className="text-xs leading-4 mt-1 text-[#919C9C]">*/}
                            {/*        {formatRelativeDate(step.at)} {formatAMPM(step.at)}*/}
                            {/*    </FontText>*/}
                            {/*)}*/}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

export default StatusTimeline;
