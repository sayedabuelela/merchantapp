import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import FontText from "../FontText";

const SkipButton = ({ onPress }: { onPress: () => void }) => {
    const { t } = useTranslation();

    return (
        <TouchableOpacity onPress={onPress} className="mt-6">
            <FontText
                type="body"
                weight='bold'
                className={'text-primary text-sm text-center'}
            >
                {t('Skip')}
            </FontText>
        </TouchableOpacity>
    )
}

export default SkipButton;

