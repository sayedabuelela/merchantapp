import { MotiView } from 'moti';
import { BaseAnimationProps } from './animations.types';

const SlideInLeftView = ({ children, delay = 0, className, style }: BaseAnimationProps) => {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
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

export default SlideInLeftView;
