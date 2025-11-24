import { MotiView } from 'moti';
import { BaseAnimationProps } from './animations.types';

const FadeInUpView = ({ children, delay = 100, className }: BaseAnimationProps) => {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'spring',
                duration: 1000,
                delay
            }}
            className={className}
        >
            {children}
        </MotiView>
    );
};

export default FadeInUpView;