import { cn } from "@/src/core/utils/cn";
import { AlertIconCircle } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { AnimatePresence, MotiView } from "moti";
import { COMMON_STYLES } from "../../styles/main";

interface AnimatedErrorProps {
    errorMsg: string;
    className?: string;
    withBackground?: boolean;
}
const AnimatedError = ({ errorMsg, className, withBackground = true }: AnimatedErrorProps) => {
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
                        "flex-row p-4 mt-4 mb-6 rounded",
                        withBackground ? "bg-feedback-error-bg border border-stroke-feedback-danger" : "",
                        className
                    )}
                >
                    <AlertIconCircle />
                    <FontText className={`${COMMON_STYLES.errorMsg} ml-2 flex-1 flex-wrap`}>
                        {errorMsg}
                    </FontText>
                </MotiView>
            )}
        </AnimatePresence>
    )
}

export default AnimatedError;
