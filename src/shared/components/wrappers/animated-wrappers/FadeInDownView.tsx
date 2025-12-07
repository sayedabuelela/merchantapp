import { MotiView } from 'moti';
import React from 'react';
import { BaseAnimationProps } from './animations.types';

const FadeInDownView = ({ children, delay = 0, duration = 1000, className, style }: BaseAnimationProps) => {
    return (
        <MotiView
            from={{ opacity: 0, translateY: -40 }}
            animate={{ opacity: 1, translateY: 0 }}
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

export default FadeInDownView;