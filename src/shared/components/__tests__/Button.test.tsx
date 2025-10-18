jest.mock('@/src/shared/components/FontText');

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Button from '../Buttons/Button';

describe('Button', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles onPress callback', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Clickable" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Clickable'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" onPress={onPressMock} disabled />
    );
    
    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('disables button when isLoading prop is true', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button title="Loading" onPress={onPressMock} isLoading testID="loading-button" />
    );
    
    fireEvent.press(getByTestId('loading-button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
}); 