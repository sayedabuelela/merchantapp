import { Pressable, View } from "react-native";
import { Image } from "expo-image";

import FontText from "@/src/shared/components/FontText";
import { ICountry } from "@/src/shared/hooks/useCountries";

interface Props {
    flag: string;
    name: string;
    phone: string;
    onPress: () => void;
}
const CountryCodeItem = ({ flag, name, phone, onPress }: Props) => {
    return (
        <Pressable className="flex-row items-center py-3 " onPress={onPress}>
            <View className="flex-row items-center">
                <Image
                    source={{ uri: flag }}
                    className="w-5 h-5"
                />
                <FontText type="body" weight="bold" className="text-content-secondary text-base mx-2">
                    {`(${phone})`}
                </FontText>
            </View>
            <FontText type="body" weight="bold" className="text-content-secondary text-base">
                {name}
            </FontText>
        </Pressable>
    )
}

export default CountryCodeItem;