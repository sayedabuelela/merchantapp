import { ChangePasswordSettingsIcon, FingerprintSettingsIcon, WarningSettingsIcon } from '@/src/shared/assets/svgs'
import FontText from '@/src/shared/components/FontText'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { ArrowRightIcon } from 'react-native-heroicons/outline'
import { ArrowUpOnSquareStackIcon, BriefcaseIcon, GlobeAltIcon, UserCircleIcon } from 'react-native-heroicons/solid'
import { SafeAreaView } from 'react-native-safe-area-context'
import LogoutModal from '../components/LogoutModal'
import { ModeToggle } from '../components/ModeToggle'
import useSettings from '../settings.viewmodel'
import { useLanguage } from '@/src/core/contexts/LanguageContext'
import useOnboardingDataViewModel from '../../onboarding/data/onboarding-data.viewmodel'
import { useOnboardingStore, accountTypeSelector } from '../../onboarding/onboarding.store'
import Button from '@/src/shared/components/Buttons/Button'
import { ROUTES } from '@/src/core/navigation/routes'
import { useRouter } from 'expo-router'
import PersonalInfoModal from '../components/PersonalInfoModal'
const SettingsScreen = () => {
    const { t } = useTranslation();
    const { logout, goToBusinessProfile, goToChangePassword, goToLanguage, goToPersonalInfo, goToOnboardingStatus, canViewBusinessProfile } = useSettings()
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const { isRTL } = useLanguage();
    const { onboardingData } = useOnboardingDataViewModel();
    const accountType = useOnboardingStore(accountTypeSelector);
    const router = useRouter();
console.log('canViewBusinessProfile : ', canViewBusinessProfile);
console.log('accountType : ', accountType);
console.log('onboardingData : ', onboardingData?.isApprovedBusinessInfo);

    const [isPersonalInfoModalVisible, setIsPersonalInfoModalVisible] = useState(false);
    const handlePersonalInfoModal = () => {
        setIsPersonalInfoModalVisible(true);
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 flex flex-row items-center justify-between mb-10">
                <FontText
                    type="head"
                    weight="bold"
                    className="text-content-primary text-2xl self-start mt-1"
                >
                    {t('Settings')}
                </FontText>
                <Pressable onPress={handlePersonalInfoModal}>
                    <UserCircleIcon size={40} color="#001F5F" />
                </Pressable>
            </View>
            <View className="px-6">
                <View className="flex-row items-center justify-between border border-[#FFD484] rounded p-3 bg-[#FFF7E8]">
                    <View className="flex-row items-center">
                        <WarningSettingsIcon />
                        <FontText
                            type="body"
                            weight="regular"
                            className="text-[#1A541D] mx-2 text-sm self-start "
                        >{t('Your account isn’t active')}</FontText>
                    </View>
                    <Button
                        variant='outline'
                        className='bg-[#FFF7E8] border border-[#513500]'
                        title={t('Activate Now')}
                        onPress={goToOnboardingStatus}
                        titleClasses='text-[#1A541D] text-sm'
                    />
                </View>
                <ModeToggle />
                {accountType && canViewBusinessProfile && onboardingData?.isApprovedBusinessInfo !== 'pending' && (
                    <Pressable className="flex-row items-center justify-between border-b border-stroke-main py-4"
                        onPress={goToBusinessProfile}
                    >
                        <View className="flex-row items-center">
                            <BriefcaseIcon size={24} color="#001F5F" />
                            <FontText
                                type="body"
                                weight="bold"
                                className="text-primary ml-2 text-base self-start mt-1"
                            >
                                {t('Business Profile')}
                            </FontText>
                        </View>
                        <ArrowRightIcon size={24} color="#001F5F" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
                    </Pressable>
                )}
                <Pressable className="flex-row items-center justify-between border-b border-stroke-main py-4"
                    onPress={goToChangePassword}
                >
                    <View className="flex-row items-center">
                        <ChangePasswordSettingsIcon />
                        <FontText
                            type="body"
                            weight="bold"
                            className="text-primary ml-2 text-base self-start mt-1"
                        >
                            {t('Change Password')}
                        </FontText>
                    </View>
                    <ArrowRightIcon size={24} color="#001F5F" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
                </Pressable>
                <Pressable className="flex-row items-center justify-between border-b border-stroke-main py-4"
                    onPress={goToLanguage}
                >
                    <View className="flex-row items-center">
                        <GlobeAltIcon size={24} color="#001F5F" />
                        <FontText
                            type="body"
                            weight="bold"
                            className="text-primary ml-2 text-base self-start "
                        >
                            {t('Language')}
                        </FontText>
                    </View>
                    <ArrowRightIcon size={24} color="#001F5F" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
                </Pressable>
                {/* <Pressable className="flex-row items-center justify-between border-b border-stroke-main py-4">
                    <View className="flex-row items-center">
                        <InformationCircleIcon size={24} color="#001F5F" />
                        <FontText
                            type="body"
                            weight="bold"
                            className="text-primary ml-2 text-base self-start"
                        >
                            {t('Help')}
                        </FontText>
                    </View>
                    <ArrowRightIcon size={24} color="#001F5F" />
                </Pressable> */}
                <Pressable className="flex-row items-center justify-between border-b border-stroke-main py-4">
                    <View className="flex-row items-center">
                        <FingerprintSettingsIcon />
                        <FontText
                            type="body"
                            weight="bold"
                            className="text-primary ml-2 text-base self-start"
                        >
                            {t('Use Fingerprint Or Face ID')}
                        </FontText>
                    </View>
                </Pressable>
                <Pressable className="flex-row items-center justify-between py-4" onPress={() => setIsLogoutModalVisible(true)}>
                    <View className="flex-row items-center">
                        <ArrowUpOnSquareStackIcon size={24} color="#A50017" />
                        <FontText
                            type="body"
                            weight="bold"
                            className="text-danger ml-2 text-base self-start"
                        >
                            {t('Log Out')}
                        </FontText>
                    </View>
                </Pressable>
            </View>
            <LogoutModal isVisible={isLogoutModalVisible} onClose={() => setIsLogoutModalVisible(false)} onLogout={logout} />
            <PersonalInfoModal
                isVisible={isPersonalInfoModalVisible}
                onClose={() => setIsPersonalInfoModalVisible(false)}
                onLogout={logout}
            // merchantBelongsTo={merchantBelongsTo}
            />
        </SafeAreaView>
    )
}

export default SettingsScreen