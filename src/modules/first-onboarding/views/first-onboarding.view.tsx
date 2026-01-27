import { FlatList, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import FadeInUpView from '@/src/shared/components/wrappers/animated-wrappers/FadeInUpView';
import { useFirstOnboardingViewModel } from '../first-onboarding.viewmodel';
import OnboardingSlide from '../components/OnboardingSlide';
import PaginationDots from '../components/PaginationDots';
import { FirstOnboardingSlide } from '../first-onboarding.model';
import { getBodyFontClass } from '@/src/core/utils/fonts';
import FontText from '@/src/shared/components/FontText';
import React from 'react';
import Button from '@/src/shared/components/Buttons/Button';
import { ArrowRightIcon } from 'react-native-heroicons/outline';

const FirstOnboardingScreen = () => {
    const { t } = useTranslation();
    const {
        flatListRef,
        slides,
        currentIndex,
        isLastSlide,
        viewabilityConfig,
        handleViewableItemsChanged,
        keyExtractor,
        getItemLayout,
        handleContinue,
        handleSkip,
        handleLogin,
        handleRegister,
    } = useFirstOnboardingViewModel();

    const renderItem = ({ item }: { item: FirstOnboardingSlide }) => (
        <OnboardingSlide slide={item} />
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                removeClippedSubviews
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                getItemLayout={getItemLayout}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />

            <View className="px-8 pb-6">
                <View className="mb-8">
                    <PaginationDots total={slides.length} activeIndex={currentIndex} />
                </View>

                {isLastSlide ? (
                    <FadeInUpView delay={100}>
                        <View className="gap-3">
                            <Pressable
                                onPress={handleLogin}
                                className="bg-primary py-3 rounded-[6px] items-center active:opacity-80"
                            >
                                <FontText className="text-white text-base" type="body" weight="semi">
                                    {t('firstOnboarding.loginButton', 'Log in to your account')}
                                </FontText>
                            </Pressable>
                            <Pressable
                                onPress={handleRegister}
                                className="py-3 rounded-[6px] items-center active:opacity-80"
                            >
                                <FontText className="text-gray-900 text-base" type="body" weight="semi">
                                    {t('firstOnboarding.registerButton', 'Create a new account')}
                                </FontText>
                            </Pressable>
                        </View>
                    </FadeInUpView>
                ) : (
                    <FadeInUpView delay={100}>
                        <View className="gap-3 ">
                            <Pressable
                                onPress={handleContinue}
                                className="bg-primary py-3 rounded-[6px] items-center active:opacity-80 flex-row justify-center align-center"
                            >
                                <FontText className="text-white text-base mr-1" type="body" weight="semi">
                                    {t('Continue')}
                                </FontText>
                                <ArrowRightIcon size={19} color="white" />
                            </Pressable>
                            <Pressable
                                onPress={handleSkip}
                                className="py-3 rounded-[6px] items-center active:opacity-80"
                            >
                                <FontText className="text-primary text-base" type="body" weight="semi">
                                    {t('firstOnboarding.skipButton', 'Skip forward')}
                                </FontText>
                            </Pressable>
                        </View>
                    </FadeInUpView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default FirstOnboardingScreen;