import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Currency } from "../currency.model";
interface CurrencyCheckBoxProps {
    currency: Currency;
    isSelected: boolean;
    handleCurrencyChange: (currency: Currency) => void;
}

const CurrencyCheckBox = ({ currency, isSelected, handleCurrencyChange }: CurrencyCheckBoxProps) => {
    const { t } = useTranslation();
    
    return (
        <BouncyCheckbox
            size={24}
            fillColor="#001F5F"
            textComponent={<FontText type="body" weight="regular" className="text-content-primary text-base ml-2" >{t(currency.name)}</FontText>}
            iconStyle={{
                borderColor: "#001F5F",
                borderRadius: 4,
            }}
            innerIconStyle={{
                borderColor: "#D5D9D9",
                borderRadius: 4,
            }}
            textStyle={{
                textDecorationLine: "none",
            }}
            onPress={(isChecked: boolean) => { handleCurrencyChange(currency) }}
            isChecked={isSelected}
        />
    )
}

export default CurrencyCheckBox