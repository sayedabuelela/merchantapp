import { SafeAreaView } from 'react-native-safe-area-context'
import FontText from '@/src/shared/components/FontText'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { LanguageSettingsIcon } from '@/src/shared/assets/svgs'
import LanguageBtn from '../components/LanguageBtn'
import { useLanguage } from '@/src/core/contexts/LanguageContext'

const LanguageScreen = () => {
    const { t } = useTranslation();
    const { changeAppLanguage, currentLanguage } = useLanguage();
    console.log(currentLanguage);
    const handlePress = () => {
        changeAppLanguage('en');
    }
    return (
        <SafeAreaView className="flex-1 bg-white pt-36">
            <View className="items-center justify-center ">
                <LanguageSettingsIcon />
                <FontText
                    type="head"
                    weight="bold"
                    className="text-content-primary text-2xl mt-4">
                    {t('Change Language')}
                </FontText>
            </View>
            <View className="px-6 mt-10">
                <LanguageBtn
                    language={t('English')} handlePress={() => changeAppLanguage('en')} isActive={currentLanguage === 'en'} />
                <LanguageBtn
                    className="border-0"
                    language={t('Arabic')} handlePress={() => changeAppLanguage('ar')} isActive={currentLanguage === 'ar'} />
            </View>


        </SafeAreaView>
    )
}

export default LanguageScreen