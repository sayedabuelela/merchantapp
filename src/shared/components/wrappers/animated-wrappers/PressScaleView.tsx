import { MotiPressable } from 'moti/interactions';
import { PressScaleProps } from './animations.types';

const PressScaleView = ({
  children,
  scaleValue = 0.97,
  disabled = false,
  onPress,
  className,
  style
}: PressScaleProps) => {
  return (
    <MotiPressable
      onPress={onPress}
      disabled={disabled}
      animate={({ pressed }) => {
        'worklet';
        return {
          scale: pressed ? scaleValue : 1,
        };
      }}
      transition={{
        type: 'spring',
        duration: 200,
      }}
      className={className}
      style={style}
    >
      {children}
    </MotiPressable>
  );
};

export default PressScaleView;
