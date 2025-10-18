import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { AnimatePresence, MotiView } from "moti";
import { COMMON_STYLES } from "../../styles/main";

interface AnimatedErrorMsgProps {
    errorMsg: string;
    className?: string;
    withBackground?: boolean;
}
const AnimatedErrorMsg = ({ errorMsg, className, withBackground = true }: AnimatedErrorMsgProps) => {
    return (
        <AnimatePresence>
            {!!errorMsg && (
                <MotiView
                    key="error-message"
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
                        "mt-3",
                        className
                    )}
                >
                    <FontText className={`${COMMON_STYLES.errorMsg} flex-1 flex-wrap`}>
                        {errorMsg}
                    </FontText>
                </MotiView>
            )}
        </AnimatePresence>
    )
}

export default AnimatedErrorMsg;
