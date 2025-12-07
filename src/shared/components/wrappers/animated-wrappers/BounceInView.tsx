import { MotiView } from 'moti';
import { BaseAnimationProps } from './animations.types';

const BounceInView = ({ children, delay = 0, className, style }: BaseAnimationProps) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 10,
        stiffness: 100,
        duration: 800,
        delay,
      }}
      className={className}
      style={style}
    >
      {children}
    </MotiView>
  );
};

export default BounceInView;
