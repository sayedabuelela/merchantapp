import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { AnimatePresence, MotiView } from "moti";
import { COMMON_STYLES } from "../../styles/main";
import { InformationCircleIcon } from "react-native-heroicons/outline";

interface AnimatedInfoMsgProps {
    infoMsg: string;
    className?: string;
    withBackground?: boolean;
}
const AnimatedInfoMsg = ({ infoMsg, className, withBackground = true }: AnimatedInfoMsgProps) => {
    return (
        <AnimatePresence>
            {!!infoMsg && (
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
                        "flex-row p-4 my-6 rounded items-start",
                        withBackground ? "bg-[#F1F6FF] border border-[#C0D5FF]" : "",
                        className
                    )}
                >
                    <InformationCircleIcon size={24} color="#001F5F" />
                    <FontText
                        type="body"
                        weight="regular"
                        className={`${COMMON_STYLES.infoMsg}  ml-2 flex-1 flex-wrap`}>
                        {infoMsg}
                    </FontText>
                </MotiView>
            )}
        </AnimatePresence>
    )
}

export default AnimatedInfoMsg;
