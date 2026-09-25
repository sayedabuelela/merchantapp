import React, { Component, ErrorInfo } from 'react';
import { View, Pressable } from 'react-native';
import FontText from './FontText';
import { recordError, logMessage } from '@/src/modules/crashlytics/crashlytics.service';
// Class component, so no useTranslation hook — i18next's module-level `t`, the
// same one PaymentLinkForm uses. The boundary renders fresh on each crash.
import { t } from 'i18next';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (errorInfo.componentStack) {
      logMessage(`Component stack: ${errorInfo.componentStack}`);
    }
    recordError(error, 'ErrorBoundary');
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-6">
          <FontText type="head" weight="bold" className="text-xl text-gray-900 mb-2">
            {t('Something went wrong')}
          </FontText>
          <FontText className="text-sm text-gray-500 text-center mb-6">
            {t('An unexpected error occurred. Please try again.')}
          </FontText>
          <Pressable
            onPress={this.handleRetry}
            className="bg-primary px-8 py-3 rounded-lg"
          >
            <FontText weight="semi" className="text-sm text-white">
              {t('Try Again')}
            </FontText>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
