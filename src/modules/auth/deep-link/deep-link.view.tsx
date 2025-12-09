import FontText from '@/src/shared/components/FontText';
import { FadeInDownView } from '@/src/shared/components/wrappers/animated-wrappers';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeepLinkParams } from './deep-link.model';
import { useDeepLinkViewModel } from './deep-link.viewmodel';

interface DeepLinkViewProps {
  params: DeepLinkParams;
}

export default function DeepLinkView({ params }: DeepLinkViewProps) {
  const { authenticateWithDeepLink } = useDeepLinkViewModel();
  const { t } = useTranslation();

  useEffect(() => {
    // Trigger authentication on mount - intentionally runs only once with initial params
    authenticateWithDeepLink(params);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <FontText type="head" weight="bold" className="text-content-primary mb-8 text-center text-2xl">
        {t('Authenticating...')}
      </FontText>
      <FadeInDownView className="justify-center" delay={200} duration={500}>
        <LottieView
          source={require('@/src/shared/assets/animations/Sandy-Loading.lottie')}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
          speed={0.5}
        />
      </FadeInDownView>
      <FontText type="body" weight="regular" className="text-gray-400 mt-2 text-center text-base">
        {t('Please wait while we verify your credentials')}
      </FontText>
    </SafeAreaView>
  );
}
