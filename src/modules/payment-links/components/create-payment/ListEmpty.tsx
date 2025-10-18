import { FeesListEmptyIcon, ItemsListEmptyIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const ListEmpty = ({ type }: { type: 'fees' | 'items' }) => {
    const { t } = useTranslation();
    return (
        <View className="items-center">
            {type === 'fees' ? <FeesListEmptyIcon /> : <ItemsListEmptyIcon />}
            <FontText type="body" weight="bold" className="text-content-secondary text-base mt-4">
                {t(type === 'fees' ? "You didn’t add additional fees" : "No items added yet!")}
            </FontText>
        </View>
    )
}

export default ListEmpty;