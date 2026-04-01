import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { AnimatePresence, MotiView } from "moti";
import { COMMON_STYLES } from "../../styles/main";
import { ExclamationTriangleIcon } from "react-native-heroicons/outline";

interface AnimatedWarningMsgProps {
    warningMsg: string;
    className?: string;
    withBackground?: boolean;
}

const AnimatedWarningMsg = ({ warningMsg, className, withBackground = true }: AnimatedWarningMsgProps) => {
    return (
        <AnimatePresence>
            {!!warningMsg && (
                <MotiView
                    key="warning-message"
                    from={{
                        opacity: 0,
                        translateY: 10
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0
                    }}
                    exit={{
                        opacity: 0,
                        translateY: 10
                    }}
                    transition={{
                        type: 'timing',
                        duration: 600
                    }}
                    className={cn(
                        "flex-row p-4 mt-4 mb-2 rounded items-start",
                        withBackground ? "bg-[#FFF7E8] border border-[#F5D99A]" : "",
                        className
                    )}
                >
                    <ExclamationTriangleIcon size={24} color="#B77801" />
                    <FontText
                        type="body"
                        weight="regular"
                        className="text-[#956200] ms-2 flex-shrink text-sm">
                        {warningMsg}
                    </FontText>
                </MotiView>
            )}
        </AnimatePresence>
    );
};

export default AnimatedWarningMsg;
