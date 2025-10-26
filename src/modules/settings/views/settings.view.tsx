import { ChangePasswordSettingsIcon, DisabledFingerprintSettingsIcon, FingerprintSettingsIcon, WarningSettingsIcon } from '@/src/shared/assets/svgs'
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
import useOnboardingDataViewModel from '../../onboarding/data/onboarding-data.viewmodel'
import { useOnboardingStore, accountTypeSelector } from '../../onboarding/onboarding.store'
import PersonalInfoModal from '../components/PersonalInfoModal'
import ActivationNote from '../components/ActivationNote'
import SettingsItem from '../components/SettingsItem'
import BiometricSettingsModal from '../components/BiometricSettingsModal'
import { useBiometricViewModel } from '../../auth/biometric/biometric.viewmodel'
import { selectIsEnabled, useBiometricStore } from '../../auth/biometric/biometric.store'
const SettingsScreen = () => {
    const { t } = useTranslation();
    const { logout, goToBusinessProfile, goToChangePassword, goToLanguage, goToOnboardingStatus, canViewBusinessProfile } = useSettings()
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
    const { onboardingData } = useOnboardingDataViewModel();
    const { enableBiometric, disableBiometric, isBiometricAvailable } = useBiometricViewModel();
    const accountType = useOnboardingStore(accountTypeSelector);
    const [isPersonalInfoModalVisible, setIsPersonalInfoModalVisible] = useState(false);
    const handlePersonalInfoModal = () => {
        setIsPersonalInfoModalVisible(!isPersonalInfoModalVisible);
    }
    const handleBiometricModal = () => {
        if (isBiometricAvailable) {
            setIsBiometricModalVisible(!isBiometricModalVisible);
        }
    }
    const handleEnableBiometric = async () => {
        // isLoading = true;
        await enableBiometric();
        // handleBiometricModal();
        // if (success) router.replace(ROUTES.TABS.ROOT);
    }
    const handleDisableBiometric = async () => {
        await disableBiometric();
        // handleBiometricModal();
        // if (success) router.replace(ROUTES.TABS.ROOT);
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
                {onboardingData?.isApprovedBusinessInfo === 'pending' && (
                    <ActivationNote goToOnboardingStatus={goToOnboardingStatus} />
                )}
                <ModeToggle />

                {accountType && canViewBusinessProfile && onboardingData?.isApprovedBusinessInfo !== 'pending' && (
                    <SettingsItem
                        title={t('Business Profile')}
                        icon={<BriefcaseIcon size={24} color="#001F5F" />}
                        onPress={goToBusinessProfile}
                        withArrow
                    />
                )}

                <SettingsItem
                    title={t('Change Password')}
                    icon={<ChangePasswordSettingsIcon />}
                    onPress={goToChangePassword}
                    withArrow
                />

                <SettingsItem
                    title={t('Language')}
                    icon={<GlobeAltIcon size={24} color="#001F5F" />}
                    onPress={goToLanguage}
                    withArrow
                />
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

                <SettingsItem
                    disabled={!isBiometricAvailable}
                    title={t('Use Fingerprint Or Face ID')}
                    icon={isBiometricAvailable ? <FingerprintSettingsIcon /> : <DisabledFingerprintSettingsIcon />}
                    onPress={handleBiometricModal}
                />
                {/* <Pressable className="flex-row items-center justify-between border-b border-stroke-main py-4">
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
                </Pressable> */}

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
                onClose={handlePersonalInfoModal}
                onLogout={logout}
            // merchantBelongsTo={merchantBelongsTo}
            />
            <BiometricSettingsModal
                isBiometricAvailable={isBiometricAvailable}
                isVisible={isBiometricModalVisible}
                onClose={handleBiometricModal}
                handleEnableBiometric={handleEnableBiometric}
                handleDisableBiometric={handleDisableBiometric}
            />
        </SafeAreaView>
    )
}

export default SettingsScreen