import { ROUTES } from "@/src/core/navigation/routes";
import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import CurrencyCheckBox from "./components/CurrencyCheckBox";
import useCurrencyViewModel from "./currency.viewmodel";
import { FadeInDownView, FadeInUpView } from "@/src/shared/components/wrappers/animated-wrappers";

const CurrencySettingsScreen = () => {
    const { t } = useTranslation();
    const { currencyData, staticCurrencies, selectedCurrencies, handleCurrencyChange, isSubmittingPartialData, submitCurrencyData } = useCurrencyViewModel();
    console.log('selectedCurrencies : ', selectedCurrencies);

    const submitHandler = () => {
        submitCurrencyData(selectedCurrencies);
    }


    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <FadeInDownView delay={0} duration={600}>
                <Header title={t('Currency Settings')} progress={98} />
            </FadeInDownView>
            <View className="flex-1 justify-between pb-6">
                <View>
                    <FadeInUpView delay={150} duration={600}>
                        <FontText type="body" weight="bold" className="text-content-secondary text-sm mb-6">
                            {t('Account Currencies')}
                        </FontText>
                    </FadeInUpView>
                    <FadeInUpView delay={250} duration={600}>
                        <View className="flex-row items-center flex-wrap mt-5 gap-4">
                            {staticCurrencies?.map((currency) => (
                                <CurrencyCheckBox
                                    key={currency.name}
                                    currency={currency}
                                    isSelected={currencyData?.some(c => c.name === currency.name) ?? false}
                                    handleCurrencyChange={handleCurrencyChange}
                                />
                            ))}
                        </View>
                    </FadeInUpView>

                </View>
                <View>
                    <FadeInUpView delay={350} duration={600}>
                        <Button
                            className='mb-6'
                            title={t('Continue')}
                            isLoading={isSubmittingPartialData}
                            disabled={!selectedCurrencies.length}
                            onPress={submitHandler}
                        />
                    </FadeInUpView>
                    <FadeInUpView delay={450} duration={600}>
                        <Link href={ROUTES.TABS.HOME}>
                            <FontText
                                type="body"
                                weight='bold'
                                className={'text-primary text-sm text-center'}
                            >
                                {t('Skip')}
                            </FontText>
                        </Link>
                    </FadeInUpView>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default CurrencySettingsScreen;
