import React from 'react';
import { render } from '@testing-library/react-native';
import FontText from '../FontText';

// Mock the cn utility
jest.mock('@/src/core/utils/cn', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

// Mock the getFontClass utility
jest.mock('@/src/core/utils/fonts', () => ({
  getFontClass: (type: string, weight: string) => `font-${type}-${weight}`,
  FontType: {
    body: 'body',
    head: 'head',
    // add other font types as needed
  },
  FontWeight: {
    regular: 'regular',
    bold: 'bold',
    // add other font weights as needed
  },
}));

describe('FontText', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<FontText>Hello World</FontText>);
    
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies default font class when no type or weight provided', () => {
    const { getByText } = render(<FontText>Hello World</FontText>);
    
    const textElement = getByText('Hello World');
    expect(textElement.props.className).toContain('font-body-regular');
    expect(textElement.props.className).toContain('self-start');
  });

  it('applies correct font class based on type and weight props', () => {
    const { getByText } = render(
      <FontText type="head" weight="bold">Hello World</FontText>
    );
    
    const textElement = getByText('Hello World');
    expect(textElement.props.className).toContain('font-head-bold');
  });

  it('merges custom className with default classes', () => {
    const { getByText } = render(
      <FontText className="text-red-500">Hello World</FontText>
    );
    
    const textElement = getByText('Hello World');
    expect(textElement.props.className).toContain('font-body-regular');
    expect(textElement.props.className).toContain('self-start');
    expect(textElement.props.className).toContain('text-red-500');
  });

  it('passes additional props to Text component', () => {
    const { getByText } = render(
      <FontText testID="custom-text" numberOfLines={2}>Hello World</FontText>
    );
    
    const textElement = getByText('Hello World');
    expect(textElement.props.testID).toBe('custom-text');
    expect(textElement.props.numberOfLines).toBe(2);
  });
});
