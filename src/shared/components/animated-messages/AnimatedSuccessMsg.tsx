import { cn } from "@/src/core/utils/cn";
import { AlertIconCircle } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { AnimatePresence, MotiView } from "moti";
import { COMMON_STYLES } from "../../styles/main";
import { CheckBadgeIcon } from "react-native-heroicons/outline";

interface AnimatedSuccessMsgProps {
    successMsg: string;
    className?: string;
    withBackground?: boolean;
}
const AnimatedSuccessMsg = ({ successMsg, className, withBackground = true }: AnimatedSuccessMsgProps) => {
    return (
        <AnimatePresence>
            {!!successMsg && (
                <MotiView
                    key="success-message"
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
                        "flex-row p-4 mt-4 mb-6 rounded items-center",
                        withBackground ? "bg-feedback-success-bg border border-success" : "",
                        className
                    )}
                >
                    <CheckBadgeIcon size={24} color="#4AAB4E" />
                    <FontText
                        type="body"
                        weight="regular"
                        className={`${COMMON_STYLES.successMsg} ml-2 flex-1 flex-wrap`}>
                        {successMsg}
                    </FontText>
                </MotiView>
            )}
        </AnimatePresence>
    )
}

export default AnimatedSuccessMsg;
