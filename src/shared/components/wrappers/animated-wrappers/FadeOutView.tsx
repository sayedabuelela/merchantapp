import { AnimatePresence, MotiView } from 'moti';
import { FadeOutProps } from './animations.types';

const FadeOutView = ({
  children,
  visible,
  onExitComplete,
  delay = 0,
  className,
  style
}: FadeOutProps) => {
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: 'timing',
            duration: 300,
            delay,
          }}
          className={className}
          style={style}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
};

export default FadeOutView;
