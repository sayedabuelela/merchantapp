import React from 'react';
import {View, Text, FlatList, Image, Dimensions, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useWelcomeViewModel} from './welcome.viewmodel';

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
                        <Image
                            source={item.image}
                            className="w-72 h-72 mb-8"
                            resizeMode="contain"
                        />
                        <Text className="text-2xl font-bold text-center text-primary mb-4">
                            {item.title}
                        </Text>
                        <Text className="text-base text-gray-600 text-center">
                            {item.description}
                        </Text>
                    </View>
                )}
            />

            {/* Pagination dots */}
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

            {/* Bottom button */}
            <View className="px-8 pb-12">
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-primary py-4 rounded-lg items-center"
                >
                    <Text className="text-white font-medium text-lg">
                        {activeIndex === slides.length - 1 ? t('Get Started') : t('Next')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
