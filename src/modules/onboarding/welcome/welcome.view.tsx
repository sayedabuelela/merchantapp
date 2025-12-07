import React from 'react';
import {View, Text, FlatList, Image, Dimensions, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useWelcomeViewModel} from './welcome.viewmodel';
import { FadeInDownView, FadeInUpView, PressScaleView } from '@/src/shared/components/wrappers/animated-wrappers';

const {width} = Dimensions.get('window');

export function WelcomeScreen() {
    const {t} = useTranslation();
    const {slides, activeIndex, flatListRef, handleNext, handleScroll} = useWelcomeViewModel();

    return (
        <View className="flex-1 bg-white">
            <FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                renderItem={({item}) => (
                    <View style={{width}} className="items-center justify-center p-8">
                        <FadeInDownView delay={0} duration={600}>
                            <Image
                                source={item.image}
                                className="w-72 h-72 mb-8"
                                resizeMode="contain"
                            />
                        </FadeInDownView>
                        <FadeInUpView delay={150} duration={600}>
                            <Text className="text-2xl font-bold text-center text-primary mb-4">
                                {item.title}
                            </Text>
                        </FadeInUpView>
                        <FadeInUpView delay={300} duration={600}>
                            <Text className="text-base text-gray-600 text-center">
                                {item.description}
                            </Text>
                        </FadeInUpView>
                    </View>
                )}
            />

            {/* Pagination dots */}
            <FadeInUpView delay={400} duration={600}>
                <View className="flex-row justify-center my-6">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 mx-1 rounded-full ${
                                index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
                            }`}
                        />
                    ))}
                </View>
            </FadeInUpView>

            {/* Bottom button */}
            <FadeInUpView delay={500} duration={600}>
                <View className="px-8 pb-12">
                    <PressScaleView onPress={handleNext} scaleValue={0.97}>
                        <View className="bg-primary py-4 rounded-lg items-center">
                            <Text className="text-white font-medium text-lg">
                                {activeIndex === slides.length - 1 ? t('Get Started') : t('Next')}
                            </Text>
                        </View>
                    </PressScaleView>
                </View>
            </FadeInUpView>
        </View>
    );
}
