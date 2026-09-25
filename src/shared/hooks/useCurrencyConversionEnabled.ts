import useHasFeature from '@/src/modules/auth/hooks/useHasFeature';
import { CURRENCY_CONVERSION_FEATURE } from '@/src/core/constants/currencies';

const useCurrencyConversionEnabled = () => useHasFeature(CURRENCY_CONVERSION_FEATURE);

export default useCurrencyConversionEnabled;
