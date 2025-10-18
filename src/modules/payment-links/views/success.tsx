import { CheckCircleIcon, ShareIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import ShareOptions from '../components/modals/ActionsModal/ShareOptions'
import useCountries from '@/src/shared/hooks/useCountries'
import { useTranslation } from 'react-i18next'
import { Link, useLocalSearchParams } from 'expo-router'
import DetailsSection from '../components/details-screen/DetailsSection'
import CreateOptionBox from '../components/create-payment/CreateOptionBox'
import { View } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Button from '@/src/shared/components/Buttons/Button'
const CreateNewPaymentLinkSuccessScreen = () => {
    const { paymentLinkId } = useLocalSearchParams<{ paymentLinkId: string }>();
    const { t } = useTranslation();
    const { countries } = useCountries();
    return (
        <SafeAreaView className="flex-1 bg-white pt-11 px-6 ">
            <KeyboardAwareScrollView
                bottomOffset={20}
                className="flex-1"
                contentContainerClassName='pb-12'
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View className="items-center mb-10">
                    <CheckCircleIcon color="#4AAB4E" size={124} />
                    <FontText type="head" weight="bold" className="text-feedback-success-text text-xl mt-2">{t("Success! Payment link created")}</FontText>
                    <FontText type="body" weight="regular" className="text-content-secondary text-base mt-2 text-center">{t("Your payment link is ready to be shared with your customer!")}</FontText>
                </View>
                <CreateOptionBox
                    icon={<ShareIcon color="#202020" size={24} />}
                    title={t("Share payment link")}
                >
                    <ShareOptions countries={countries} paymentLinkId={paymentLinkId} />
                </CreateOptionBox>
                <View>
                    <Link
                        href={`/payment-links/${paymentLinkId}`}
                        asChild
                        dismissTo
                    >
                        <Button
                            title={t("View Details")}
                        />
                    </Link>
                    <Link
                        href="/payment-links"
                        asChild
                        dismissTo
                    >
                        <Button
                            title={t("Go to payment links")}
                            variant="outline"
                            className="mt-4"
                        />
                    </Link>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default CreateNewPaymentLinkSuccessScreen