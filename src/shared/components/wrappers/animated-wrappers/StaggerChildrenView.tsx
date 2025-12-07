import { MotiView } from 'moti';
import React, { Children } from 'react';
import { View } from 'react-native';
import { StaggerProps } from './animations.types';

const StaggerChildrenView = ({
  children,
  staggerDelay = 100,
  animationType = 'fadeInDown',
  delay = 0,
  duration = 1000,
  className,
  style
}: StaggerProps) => {
  const childArray = Children.toArray(children);

  const getAnimationConfig = (type: string) => {
    switch (type) {
      case 'fadeInUp':
        return { from: { opacity: 0, translateY: 40 }, animate: { opacity: 1, translateY: 0 } };
      case 'scale':
        return { from: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } };
      case 'fadeInDown':
      default:
        return { from: { opacity: 0, translateY: -40 }, animate: { opacity: 1, translateY: 0 } };
    }
  };

  const animation = getAnimationConfig(animationType);

  return (
    <View className={className} style={style}>
      {childArray.map((child, index) => (
        <MotiView
          key={index}
          from={animation.from}
          animate={animation.animate}
          transition={{
            type: 'spring',
            duration,
            delay: delay + index * staggerDelay,
          }}
        >
          {child}
        </MotiView>
      ))}
    </View>
  );
};

export default StaggerChildrenView;
