import { ViewProps } from 'react-native';

export interface BaseAnimationProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string; // For NativeWind
}

export interface PressScaleProps extends BaseAnimationProps {
  scaleValue?: number; // default 0.97
  disabled?: boolean;
  onPress?: () => void;
}

export interface ShakeProps extends BaseAnimationProps {
  trigger?: boolean | number; // toggle or increment to trigger
  intensity?: number; // default 10
}

export interface StaggerProps extends BaseAnimationProps {
  staggerDelay?: number; // default 100ms between children
  animationType?: 'fadeInDown' | 'fadeInUp' | 'scale'; // which animation to apply
  duration?: number;
}

export interface FadeOutProps extends BaseAnimationProps {
  visible: boolean;
  onExitComplete?: () => void;
}