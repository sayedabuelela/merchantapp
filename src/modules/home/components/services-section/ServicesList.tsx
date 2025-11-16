import React from 'react'
import { FlatList, Pressable, View } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import ServiceCard from './ServiceCard'
import { useTranslation } from 'react-i18next'
import { ArrowRightIcon } from 'react-native-heroicons/outline'
import { Link } from 'expo-router'
import { useServices } from '../../hooks/useServices'

const ServicesList = ({ qrCodeActionPress }: { qrCodeActionPress: () => void }) => {
    const { t } = useTranslation()
    const services = useServices(qrCodeActionPress);
    return (
        <View className="my-8">
            <View className='flex-row items-center justify-between mb-4'>
                <FontText type="head" weight="bold" className='text-xl self-start text-content-primary'>{t('Services')}</FontText>
                <Link href="/services" asChild>
                    <Pressable className='flex-row items-center gap-2'>
                        <FontText type="body" weight="regular" className='text-primary text-xs'>{t('All Services')}</FontText>
                        <ArrowRightIcon size={16} color="#001F5F" />
                    </Pressable>
                </Link>
            </View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName='gap-2'
                data={services}
                renderItem={({ item }) => <ServiceCard {...item} />}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    )
}

export default ServicesList