import { cn } from "@/src/core/utils/cn";
import { AlertIconCircle } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { AnimatePresence, MotiView } from "moti";
import { View } from "react-native";
import { COMMON_STYLES } from "../../styles/main";

interface AnimatedErrorProps {
    errorMsg: string;
    /** optional bold headline rendered above `errorMsg` */
    title?: string;
    className?: string;
    withBackground?: boolean;
}
const AnimatedError = ({ errorMsg, title, className, withBackground = true }: AnimatedErrorProps) => {
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
                    <View className="ms-2 flex-shrink">
                        {!!title && (
                            <FontText weight="semi" className={`${COMMON_STYLES.errorMsg} mb-1`}>
                                {title}
                            </FontText>
                        )}
                        <FontText className={COMMON_STYLES.errorMsg}>
                            {errorMsg}
                        </FontText>
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    )
}

export default AnimatedError;
