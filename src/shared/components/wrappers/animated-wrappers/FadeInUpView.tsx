import { MotiView } from 'moti';
import { BaseAnimationProps } from './animations.types';

const FadeInUpView = ({ children, delay = 100, duration = 1000, className, style }: BaseAnimationProps) => {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'spring',
                duration,
                delay
            }}
            className={className}
            style={style}
        >
            {children}
        </MotiView>
    );
};

export default FadeInUpView;