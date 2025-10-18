import React from 'react';
import { Text } from 'react-native';

interface FontTextProps {
  children: React.ReactNode;
  type?: string;
  weight?: string;
  className?: string;
  [key: string]: any;
}

const FontText = (props: FontTextProps) => {
  const { children, ...rest } = props;
  return <Text {...rest}>{children}</Text>;
};

export default FontText; 