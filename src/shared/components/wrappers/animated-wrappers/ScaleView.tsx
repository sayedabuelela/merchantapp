import { MotiView } from "moti";
import { BaseAnimationProps } from "./animations.types";

const ScaleFadeIn = ({ children, delay = 0, className, style }: BaseAnimationProps) => {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.95 }} // Starts slightly smaller
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: 'spring',
                duration: 1000,
                delay,
            }}
            className={className}
            style={style}
        >
            {children}
        </MotiView>
    );
};

export default ScaleFadeIn;