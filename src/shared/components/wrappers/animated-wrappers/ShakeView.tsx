import { MotiView } from 'moti';
import { useEffect } from 'react';
import { ShakeProps } from './animations.types';

const ShakeView = ({
  children,
  trigger,
  intensity = 10,
  delay = 0,
  className,
  style
}: ShakeProps) => {
  return (
    <MotiView
      from={{ translateX: 0 }}
      animate={{ translateX: 0 }}
      transition={{
        type: 'spring',
        damping: 10,
        stiffness: 100,
        delay,
      }}
      // Trigger shake animation when trigger changes
      state={
        trigger
          ? {
              translateX: [0, intensity, -intensity, intensity, -intensity, 0],
            }
          : undefined
      }
      className={className}
      style={style}
    >
      {children}
    </MotiView>
  );
};

export default ShakeView;
