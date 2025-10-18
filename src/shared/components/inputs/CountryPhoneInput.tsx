import { cn } from "@/src/core/utils/cn";
import { getFontClass } from "@/src/core/utils/fonts";
import { TextInput, TouchableOpacity, View, Text } from "react-native"
import { Image } from "expo-image";
import { useRef, useState } from "react";
import FontText from "../FontText";
import { COMMON_STYLES } from "../../styles/main";
import CountyCodeBottomSheet from "../bottom-sheets/phone-code-selector/CountyCodeBottomSheet";
import { ICountry } from "../../hooks/useCountries";

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[azfkWRj[~qV%M{M|azazazf6M{i^#M{[~q%;WRj[E2ayj[j[fQayWCj[ayj[j[fQj[ayj[j[azfwj[j[ayj[j[fQj[j[ayj[j[ayfjj[j[ayj[j[ayj[j[ayt7j[ayj[j[';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    label?: string;
    [key: string]: any;
    onCodePress?: () => void;
    selectedCountryCode?: ICountry
    error?: boolean;
}
const CountryPhoneInput = ({ value, onChangeText, label, onCodePress, selectedCountryCode, error, }: Props) => {
    const borderColorClass = error
    ? "border-2 border-stroke-danger" : "border-stroke-input"

    return (
        <>
            {label && <FontText
                type="body"
                weight='semi'
                className={cn(COMMON_STYLES.label)}>
                {label}
            </FontText>}
            <View
                className={cn(`pr-4 h-11 bg-white border rounded ${borderColorClass} items-center flex-row`)}
            >
                <TouchableOpacity className="flex-row items-center px-2 h-11 border border-l-0 border-stroke-input bg-[#F8F9F9] mr-2"
                    onPress={onCodePress}
                >
                    <Image
                        placeholder={{ blurhash }}
                        style={{ width: 20, height: 20 }}
                        source={{ uri: selectedCountryCode?.flag }}
                        transition={1000}
                    />
                    <Text className="font-body-regular-ltr text-content-primary text-sm ml-1">{selectedCountryCode?.phone}</Text>
                </TouchableOpacity>
                <TextInput
                    value={value}
                    className={cn(`flex-1 w-full h-full overflow-hidden text-base leading-[1.35]  text-content-primary text-left self-start ${getFontClass('body', 'regular')}`)}
                    onChangeText={onChangeText}
                    placeholderTextColor="#B3BBBB"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
        </>
    )
}

export default CountryPhoneInput