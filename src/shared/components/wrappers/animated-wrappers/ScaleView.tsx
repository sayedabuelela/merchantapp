import { MotiView } from "moti";
import { BaseAnimationProps } from "./animations.types";

const ScaleFadeIn = ({ children, delay = 0, duration = 1000, className, style }: BaseAnimationProps) => {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.90 }} // Starts slightly smaller
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: 'spring',
                duration,
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