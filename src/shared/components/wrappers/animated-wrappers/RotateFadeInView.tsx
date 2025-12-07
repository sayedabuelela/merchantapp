import { MotiView } from 'moti';
import { BaseAnimationProps } from './animations.types';

const RotateFadeInView = ({ children, delay = 0, className, style }: BaseAnimationProps) => {
  return (
    <MotiView
      from={{ opacity: 0, rotate: '-10deg' }}
      animate={{ opacity: 1, rotate: '0deg' }}
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

export default RotateFadeInView;
