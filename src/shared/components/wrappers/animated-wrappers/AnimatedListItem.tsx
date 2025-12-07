import { MotiView } from 'moti';
import React from 'react';

interface AnimatedListItemProps {
    children: React.ReactNode;
    index: number;
    maxAnimatedItems?: number;
    delay?: number;
    staggerDelay?: number;
    duration?: number;
}

/**
 * Animated wrapper for FlashList items
 * Only animates the first N items on initial render for performance
 * Items beyond maxAnimatedItems render instantly
 */
const AnimatedListItem = ({
    children,
    index,
    maxAnimatedItems = 8,
    delay = 0,
    staggerDelay = 40,
    duration = 400,
}: AnimatedListItemProps) => {
    // Skip animation for items beyond the threshold
    const shouldAnimate = index < maxAnimatedItems;

    if (!shouldAnimate) {
        return <>{children}</>;
    }

    return (
        <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'spring',
                duration,
                delay: delay + index * staggerDelay,
            }}
        >
            {children}
        </MotiView>
    );
};

export default AnimatedListItem;
