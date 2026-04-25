import {SafeAreaView} from 'react-native-safe-area-context'
import FontText from '@/src/shared/components/FontText'
import {I18nManager, Pressable, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import {LanguageSettingsIcon} from '@/src/shared/assets/svgs'
import LanguageBtn from '../components/LanguageBtn'
import {useLanguage} from '@/src/core/contexts/LanguageContext'
import {FadeInDownView, FadeInUpView} from '@/src/shared/components/wrappers/animated-wrappers'
import {ChevronLeftIcon} from "react-native-heroicons/outline";
import {router} from "expo-router";

const isRTL = I18nManager.isRTL;
const LanguageScreen = () => {
    const {t} = useTranslation();
    const {changeAppLanguage, currentLanguage} = useLanguage();

    return (
        <SafeAreaView className="flex-1 bg-white px-6">
            <View>
                <Pressable onPress={router.back}>
                    <ChevronLeftIcon size={24} color="#0F172A"
                                     style={isRTL ? {transform: [{rotate: '180deg'}]} : {}}/>
                </Pressable>
            </View>
            <FadeInDownView delay={0} duration={600}>
                <View className="items-center justify-center pt-36">
                    <LanguageSettingsIcon/>
                    <FontText
                        type="head"
                        weight="bold"
                        className="text-content-primary text-2xl mt-4">
                        {t('Change Language')}
                    </FontText>
                </View>
            </FadeInDownView>
            <FadeInUpView delay={150} duration={600}>
                <View className=" mt-10">
                    <LanguageBtn
                        language={t('English')} handlePress={() => changeAppLanguage('en')}
                        isActive={currentLanguage === 'en'}/>
                    <LanguageBtn
                        className="border-0"
                        language={t('Arabic')} handlePress={() => changeAppLanguage('ar')}
                        isActive={currentLanguage === 'ar'}/>
                </View>
            </FadeInUpView>

        </SafeAreaView>
    )
}

export default LanguageScreen