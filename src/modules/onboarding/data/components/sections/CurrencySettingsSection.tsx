import { ROUTES } from "@/src/core/navigation/routes";
import { Currency } from "@/src/modules/onboarding/currency/currency.model";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import AccordionItem from "../AccordionItem";

const CurrencySettingsSection = ({
  currencies
}: { currencies: Currency[] }) => {
  const { t } = useTranslation();
  return (
    <AccordionItem
      title={t('Currency Settings')}
      editRoute={ROUTES.ONBOARDING.CURRENCY_SETTINGS}
    >
      <View className="flex-row items-center justify-between mb-4 ">
        <FontText type="body" weight="regular" className={` text-[#6F7E7E] text-sm mr-3 self-start`}>{t('Account Currency')}</FontText>

        <FontText type="body" weight="semi" className={`shrink text-content-primary text-sm self-start `} numberOfLines={1}>
          {currencies.map((currency, index) => (
            currency.name + (index < currencies.length - 1 ? ', ' : '')
          ))}
        </FontText>

      </View>
    </AccordionItem>
  )
}

export default CurrencySettingsSection