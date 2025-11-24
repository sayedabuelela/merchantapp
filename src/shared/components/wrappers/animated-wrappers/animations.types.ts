import { ViewProps } from 'react-native';

export interface BaseAnimationProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  className?: string; // For NativeWind
}