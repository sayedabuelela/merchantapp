import { cn } from "@/src/core/utils/cn";
import FontText from "@/src/shared/components/FontText";
import { COMMON_STYLES } from "@/src/shared/styles/main";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import usePaymentLinkActionsVM from "../../../viewmodels/usePaymentLinkActionsVM";
import { ArrowTopRightOnSquareIcon } from "react-native-heroicons/outline";
import Button from "@/src/shared/components/Buttons/Button";
import Input from "@/src/shared/components/inputs/Input";
import CountryPhoneInput from "@/src/shared/components/inputs/CountryPhoneInput";
import { ICountry } from "@/src/shared/hooks/useCountries";
import { memo, useCallback, useMemo, useState } from "react";
import CountryCodeItem from "@/src/shared/components/bottom-sheets/phone-code-selector/CountryCodeItem";
import { FlatList } from "react-native-gesture-handler";
import { isValidEmail, isValidPhone } from "@/src/core/utils/validation";
import AnimatedError from "@/src/shared/components/animated-messages/AnimatedError";
import AnimatedSuccessMsg from "@/src/shared/components/animated-messages/AnimatedSuccessMsg";
const EgyptPhoneCode = { phone: "+20", name: "مصر", flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDElEQVQ4y6WTMUvDQBiGkxRMCpKEA8GlILj1DzhLQd1EUTsIDh0EB/9Cof4IF/+RzjqX2JhChdDBC0Sat/eG9MTekrQHDwf5vufhllgArG3g2VEIxX5DROVae/FlH5tAl4GDyfkVZsNRLb6HT+VNhy4Dh9HxCaYPj4j7t/+5qVj7zl06dMvAuHeG6eAe8cV1Lbg77p3+BaSUWD9FkSOTHyXFIjPmdHQgTVNjIf+J8Pk2QPR6h2z+bszp6ECSJOYLfueQXy+Qk2cs8pkxp6MDQRBACAHXdWvBXTo64HkewjAE7zqsdnXAcRz4vt8IOqtAx7ZtbAJdBgJFV3HUkG7lWi1FW7HbkHbpbvs7LwEg89oYVCxAMQAAAABJRU5ErkJggg==" }
interface Props {
    countries: ICountry[] | undefined;
    paymentLinkId: string;
}

interface CountryListProps {
    countries: ICountry[];
    handleSelect: (country: { phone: string, name: string, flag: string }) => void;
}
const CountryList = memo(({ countries, handleSelect }: CountryListProps) => {
    console.log('CountryListcountries', countries)
    // Memoize the keyExtractor to avoid recreation
    const keyExtractor = useCallback(
        (item: ICountry) => `${item.name}-${item.phone}`,
        []
    );

    // Memoize renderItem to prevent recreation on every render
    const renderItem = useCallback(
        ({ item }: { item: ICountry }) => (
            <CountryCodeItem
                flag={item.flag}
                name={item.name}
                phone={item.phone}
                onPress={() => handleSelect(item)}
            />
        ),
        []
    );

    return (
        <FlatList
            data={countries}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={true} // Enable subview removal
        />
    );
});

const ShareOptions = ({ countries, paymentLinkId }: Props) => {
    const { t } = useTranslation();
    const { generateSherableUrl } = usePaymentLinkActionsVM()
    const [countryListVisible, setCountryListVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<ICountry>(EgyptPhoneCode);
    const [searchTerm, setSearchTerm] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const { shareMutation: { mutateAsync: sharePaymentLink, isPending: isShareLoading, error,isSuccess } } = usePaymentLinkActionsVM();
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const handleSendEmail = async () => {
        if (!isValidEmail(email)) {
            setIsEmailValid(false);
            return;
        } else {
            setIsEmailValid(true);
        }
        try {
            await sharePaymentLink({
                operation: "email",
                urlIdentifier: paymentLinkId,
                key: email,
            });
            setEmail("");
        } catch (e) {
            console.log('error', e)
        }
    };

    // Phone send
    const handleSendSms = async () => {
        if (!isValidPhone(phone, selectedCountry?.phone)) {
            setIsPhoneValid(false);
            return;
        } else {
            setIsPhoneValid(true);
        }
        try {
            await sharePaymentLink({
                operation: "phone",
                urlIdentifier: paymentLinkId,
                key: phone,
                countryCode: `${selectedCountry?.phone}`,
            });
            setPhone("");
            setSelectedCountry(EgyptPhoneCode);
        } catch (e) {
            console.log('error', e)
        }
    };
    const handleSelect = (country: { phone: string, name: string, flag: string }) => {
        setSelectedCountry(country);
        setCountryListVisible(false);
    }

    const filteredCountries = useMemo(() => {
        if (!countries) {
            return [];
        }
        return countries.filter((country: any) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [countries, searchTerm]);

    const handleShowCountryCode = () => {
        setCountryListVisible(true)
    }


    return (
        <>
            {countryListVisible && <View className="h-[200px]">
                <Input
                    // label={t("Search")}
                    placeholder={t("Search")}
                    onChangeText={setSearchTerm}
                />
                <CountryList countries={filteredCountries}
                    handleSelect={handleSelect}
                />
            </View>
            }
            {!countryListVisible && (
                <>
                    <FontText type="body" weight="regular" className="text-content-secondary text-base">
                        {t("Copy, email or text this payment link to your customer.")}
                    </FontText>
                    <View className="mt-6 gap-y-4">
                        {error && (
                            <AnimatedError
                                className="m-0"
                                errorMsg={error.message}
                            />
                        )}
                        {isSuccess && (
                            <AnimatedSuccessMsg
                                className="m-0"
                                successMsg={t("Payment link shared successfully")}
                            />
                        )}
                        <View>
                            <FontText
                                type="body"
                                weight='semi'
                                className={cn(COMMON_STYLES.label)}>
                                {t('Link to share')}
                            </FontText>
                            <View className="flex-row items-center gap-x-2">
                                <View className="flex-row items-center justify-between border border-stroke-input rounded px-4 py-3 pr-8 bg-[#F5F6F6] w-[70%]">
                                    <Text
                                        className="font-body-regular-ltr text-content-secondary text-sm "
                                        lineBreakMode="tail"
                                        numberOfLines={1}
                                    >
                                        {generateSherableUrl(paymentLinkId)}
                                    </Text>
                                    <TouchableOpacity className="">
                                        <ArrowTopRightOnSquareIcon size={24} color="#001F5F" />
                                    </TouchableOpacity>
                                </View>
                                <Button
                                    className="h-[42px] flex-1"
                                    title={t("Copy")}
                                    onPress={() => { }}
                                    variant="outline"
                                />
                            </View>
                        </View>
                         <View className="flex-row items-end gap-x-2">
                            <View className="w-[70%]">
                                <CountryPhoneInput
                                    label={t("Send SMS")}
                                    value={phone}
                                    onChangeText={setPhone}
                                    onCodePress={handleShowCountryCode}
                                    selectedCountryCode={selectedCountry}
                                    error={!isPhoneValid}
                                />
                            </View>
                            <Button
                                className="h-[42px] flex-1"
                                title={t("Send")}
                                onPress={handleSendSms}
                                isLoading={isShareLoading}
                                variant="outline"
                            />
                        </View>
                        <View className="flex-row items-end gap-x-2">
                            <View className="w-[70%]">
                                <Input
                                    label={t("Send Email")}
                                    placeholder={t("Please enter email")}
                                    value={email}
                                    onChangeText={setEmail}
                                    error={!isEmailValid}
                                />
                            </View>
                            <Button
                                className="h-[42px] flex-1"
                                title={t("Send")}
                                onPress={handleSendEmail}
                                isLoading={isShareLoading}
                                variant="outline"
                            />
                        </View>
                       
                    </View>
                </>
            )}
        </>
    )
}

export default ShareOptions;